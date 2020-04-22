/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-inner-declarations */
import { readFileSync, writeFileSync, existsSync, copy } from 'fs-extra'
import * as gulp from 'gulp'
import * as _webpack from 'webpack'
import { spawn } from 'child_process'
import { rollup as _rollup, watch as _watch, WatcherOptions } from 'rollup'
import config from './scripts/config'
import getWebpackConfig from './scripts/webpack.config'
import getRollupConfig from './scripts/rollup.config'
import p from './scripts/path'
import * as dtsHack from './scripts/dts-hack'
const eslint = require('gulp-eslint')

const webpackConfig = [getWebpackConfig(false), getWebpackConfig(true)]
const rollupConfig = [getRollupConfig(false), getRollupConfig(true)]

const webpackToStringOptions: _webpack.Stats.ToStringOptions = {
  colors: true,
  modules: false,
  entrypoints: false
}

async function _spawn (command: string, args: string[]): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const cwd = p()
    const cp = spawn(command, args, {
      env: process.env,
      cwd,
      stdio: 'inherit'
    })

    cp.once('exit', (code, reason) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Child process exit: ${code}. Reason: ${reason}\n\n${command} ${args.join(' ')}\n`))
      }
    })
  })
}

async function runNpmBin (bin: string, args: string[]): Promise<void> {
  const localBin = p(`node_modules/.bin/${bin}${process.platform === 'win32' ? '.cmd' : ''}`)
  if (existsSync(localBin)) {
    return await _spawn(localBin, args)
  }
  return await _spawn(`${bin}${process.platform === 'win32' ? '.cmd' : ''}`, args)
}

export const lint: gulp.TaskFunction = function lint (): NodeJS.ReadWriteStream {
  return gulp.src('src/**/*.ts')
    .pipe(eslint())
    .pipe(eslint.format())
}

export const webpack: gulp.TaskFunction = function webpack (cb): void {
  _webpack(webpackConfig, (err, stats) => {
    if (err != null) {
      cb(err)
      return
    }
    console.log(stats.toString(webpackToStringOptions))
    cb()
  })
}

export const rollup: gulp.TaskFunction = async function rollup (): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  return await Promise.all(rollupConfig.map(conf => _rollup(conf.input).then(bundle => bundle.write(conf.output)))).then(() => {
    if (config.replaceESModule === true) {
      rollupConfig.forEach(conf => {
        let code = readFileSync(p(conf.output.file as string), 'utf8')
        code = code.replace(/(.\s*)?Object\.defineProperty\s*\(\s*(.*?)\s*,\s*(['"])__esModule['"]\s*,\s*\{\s*value\s*:\s*(.*?)\s*\}\s*\)\s*;?/g, (_match, token, exp, quote, value) => {
          const iifeTemplate = (content: string, replaceVar?: string): string => {
            if (replaceVar != null && replaceVar !== '') {
              return `(function(${replaceVar}){${content.replace(new RegExp(exp, 'g'), replaceVar)}})(${exp})`
            }
            return `(function(){${content}})()`
          }
          const content = (iife: boolean): string => `try{${iife ? 'return ' : ''}Object.defineProperty(${exp},${quote}__esModule${quote},{value:${value}})}catch(_){${iife ? 'return ' : ''}${exp}.__esModule=${value}${iife ? `,${exp}` : ''}}`
          const _token = token ?? token.trim()
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (!_token) return content(false)
          if (_token === '{' || _token === ';') {
            return `${token}${content(false)}`
          } else if (_token === ')' || /^[a-zA-Z$_][a-zA-Z\d_]*$/.test(_token)) {
            return `${token};${content(false)}`
          } else {
            return `${token}${iifeTemplate(content(true), exp === 'this' ? 'e' : '')}`
          }
        })
        writeFileSync(p(conf.output.file as string), code, 'utf8')
      })
    }
  })
}

export const bundle: gulp.TaskFunction = gulp.parallel(...(config.bundle.map(task => exports[task])))

export const tsc: gulp.TaskFunction = async function tsc (): Promise<void> {
  await runNpmBin('tsc', ['-p', 'tsconfig.esm.json'])
  if (typeof config.externalApiDeclarationDir === 'string' && config.externalApiDeclarationDir !== '') {
    return await copy(p(config.externalApiDeclarationDir), p('lib/esm'))
  }
}

export const tscn: gulp.TaskFunction = async function tscn (): Promise<void> {
  await runNpmBin('tsc', ['-p', 'tsconfig.json'])
  if (typeof config.externalApiDeclarationDir === 'string' && config.externalApiDeclarationDir !== '') {
    return await copy(p(config.externalApiDeclarationDir), p('lib/cjs'))
  }
}

export const watch: gulp.TaskFunction = function watch (cb): void {
  gulp.watch('src/**/*.ts', { ignoreInitial: false }, lint)
  runNpmBin('tsc', ['-w', '-p', 'tsconfig.esm.json']).catch(err => console.log(err))
  if (config.bundle.includes('webpack')) {
    _webpack(webpackConfig).watch({ aggregateTimeout: 200 }, (_err, stats) => console.log(stats.toString(webpackToStringOptions)))
  }
  if (config.bundle.includes('rollup')) {
    _watch(rollupConfig.map(conf => ({
      ...conf.input,
      output: conf.output,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      watch: {
        clearScreen: false,
        include: ['src/**/*.ts']
      } as WatcherOptions
    })))
  }
  setTimeout(cb, 200)
}

export const dts: gulp.TaskFunction = async function dts (): Promise<void> {
  let info: dtsHack.DeclarationInfo | null = null
  if (config.namespaceWrapper === true) {
    info = dtsHack.applyChange(p('lib/esm'))
  }
  try {
    await runNpmBin('api-extractor', ['run', '--local', '--verbose'])
  } catch (err) {
    if (config.namespaceWrapper === true) {
      dtsHack.revertChange(info as dtsHack.DeclarationInfo)
    }
    throw err
  }
  if (config.namespaceWrapper === true) {
    dtsHack.revertChange(info as dtsHack.DeclarationInfo)
  }
  const dtsPath = p(`typings/${config.library}.d.ts`)
  const format = config.format ?? 'umd'
  dtsHack.resolveDeclarationFile(dtsPath, config.library, format)
}

export const doc: gulp.TaskFunction = async function doc (): Promise<void> {
  const outputDir = p(config.output.doc ?? 'docs/api')
  await runNpmBin('api-documenter', ['markdown', '-i', './temp', '-o', outputDir])
  writeFileSync(p(outputDir, 'README.md'), readFileSync(p(outputDir, 'index.md'), 'utf8'), 'utf8')
}

export const docs: gulp.TaskFunction = gulp.series(lint, tsc, dts, doc)

export const build: gulp.TaskFunction = gulp.series(lint, tsc, dts, doc, bundle)
