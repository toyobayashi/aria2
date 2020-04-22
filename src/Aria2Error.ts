/**
 * @public
 */
export class Aria2Error extends Error {
  public code: number
  constructor (message: string, code: number) {
    super(message)
    if (typeof code !== 'number') {
      throw new TypeError('Aria2Error constructor: the second argument must be a number.')
    }
    this.code = code
  }
}
