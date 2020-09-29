import { tryGetRequireFunction } from '@tybys/native-require'

declare const __webpack_modules__: any

const _require = tryGetRequireFunction(typeof __webpack_modules__ !== 'undefined' ? undefined : (typeof module !== 'undefined' ? module : undefined))

export { _require }
