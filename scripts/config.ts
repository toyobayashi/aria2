import { Configuration as WebpackConfiguration } from 'webpack'
import { MinifyOptions } from 'terser'

export type Bundler = 'webpack' | 'rollup'

export type KeyType<T, U extends keyof T> = T[U]

export type Format = 'umd' | 'cjs' | 'iife'

export interface Configuration {
  entry: string
  output: {
    webpack: string
    rollup: string
    doc?: string
  }
  bundle: Bundler[]
  library: string
  tsconfig: string
  format: Format
  webpackTarget?: KeyType<WebpackConfiguration, 'target'>
  replaceESModule?: boolean
  terserOptions?: MinifyOptions
  namespaceWrapper?: boolean
  externalApiDeclarationDir?: string
}

const config: Configuration = {
  entry: 'src/index.ts',
  output: {
    webpack: 'dist/webpack',
    rollup: 'dist',
    doc: 'docs/api'
  },
  bundle: ['rollup'],
  library: 'aria2',
  tsconfig: 'tsconfig.production.json',
  format: 'umd',
  webpackTarget: 'web',
  replaceESModule: false,
  terserOptions: {
    ie8: false
  }
  // namespaceWrapper: true
  // externalApiDeclarationDir: 'api'
}

export default config
