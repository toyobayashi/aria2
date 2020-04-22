// eslint-disable-next-line @typescript-eslint/camelcase
declare var __webpack_require__: any
// eslint-disable-next-line @typescript-eslint/camelcase
declare var __non_webpack_require__: any
declare var wx: any

// eslint-disable-next-line @typescript-eslint/camelcase
export function nodeRequire (request: string): any {
  var __r: any
  // eslint-disable-next-line @typescript-eslint/camelcase
  if (typeof __webpack_require__ !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/camelcase
    __r = ((typeof __non_webpack_require__ !== 'undefined' && typeof wx === 'undefined') ? __non_webpack_require__ : undefined)
  } else {
    __r = ((typeof require !== 'undefined' && typeof wx === 'undefined') ? require : undefined)
  }
  return __r(request)
}
