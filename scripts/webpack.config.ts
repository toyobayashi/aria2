import { Configuration, LibraryTarget } from 'webpack'
import p from './path'
import config, { Format } from './config'

const TerserWebpackPlugin = require('terser-webpack-plugin')

function getWebpackLibraryTarget (format: Format): LibraryTarget {
  switch (format) {
    case 'umd': return 'umd'
    case 'cjs': return 'commonjs2'
    case 'iife': return 'var'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    default: throw new Error(`Webpack does not support format: ${format}`)
  }
}

function getWebpackConfig (minimize: boolean): Configuration {
  const format = config.format ?? 'umd'
  const webpackConfig: Configuration = {
    target: config.webpackTarget ?? 'web',
    mode: 'production',
    entry: {
      [config.library + (minimize ? '.min' : '')]: [p(config.entry)]
    },
    output: {
      path: p(config.output.webpack),
      filename: '[name].js',
      library: config.library,
      libraryTarget: getWebpackLibraryTarget(format),
      globalObject: 'typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : (typeof self !== "undefined" ? self : this))'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    node: false,
    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                configFile: p(config.tsconfig)
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimize,
      ...(minimize ? {
        minimizer: [
          new TerserWebpackPlugin({ ...(config.terserOptions !== undefined ? ({ terserOptions: config.terserOptions }) : {}) })
        ]
      } : {})
    }
  }

  return webpackConfig
}

export default getWebpackConfig
