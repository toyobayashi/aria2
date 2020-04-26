import { EventEmitter } from './EventEmitter'
import { nativeRequire } from '@tybys/native-require'

/**
 * @public
 */
class SimpleWebSocket extends EventEmitter {
  private readonly _socket: import('ws') | WebSocket

  public static readonly CONNECTING: number = 0
  public static readonly OPEN: number = 1
  public static readonly CLOSING: number = 2
  public static readonly CLOSED: number = 3

  public get readyState (): number {
    return this._socket.readyState
  }

  constructor (url: string, protocols?: string | string[]) {
    super()
    if (typeof window === 'undefined') {
      if (nativeRequire == null) {
        throw new ReferenceError('require is not defined.')
      }
      const Ws: typeof import('ws') = nativeRequire('ws')
      this._socket = new Ws(url, protocols)

      this._socket.on('open', () => { this.emit('open') })
      this._socket.on('message', (data) => { this.emit('message', data) })
      this._socket.on('error', (err) => { this.emit('error', err) })
      this._socket.on('close', (code, reason) => { this.emit('close', code, reason) })
    } else {
      this._socket = new WebSocket(url, protocols)
      this._socket.addEventListener('open', () => { this.emit('open') })
      this._socket.addEventListener('message', (ev) => { this.emit('message', ev.data) })
      this._socket.addEventListener('error', (ev) => { this.emit('error', ev) })
      this._socket.addEventListener('close', (ev) => { this.emit('close', ev.code, ev.reason) })
    }
  }

  public on (event: 'close', listener: (this: SimpleWebSocket, code: number, reason: string) => void): this
  public on (event: 'error', listener: (this: SimpleWebSocket, err: Error) => void): this
  public on (event: 'message', listener: (this: SimpleWebSocket, data: any) => void): this
  public on (event: 'open', listener: (this: SimpleWebSocket) => void): this
  public on (event: string | symbol, listener: (this: SimpleWebSocket, ...args: any[]) => void): this
  public on (event: any, listener: any): this {
    return super.on(event, listener)
  }

  public once (event: 'close', listener: (this: SimpleWebSocket, code: number, reason: string) => void): this
  public once (event: 'error', listener: (this: SimpleWebSocket, err: Error) => void): this
  public once (event: 'message', listener: (this: SimpleWebSocket, data: any) => void): this
  public once (event: 'open', listener: (this: SimpleWebSocket) => void): this
  public once (event: string | symbol, listener: (this: SimpleWebSocket, ...args: any[]) => void): this
  public once (event: any, listener: any): this {
    return super.once(event, listener)
  }

  public send (data: any, cb?: (err?: Error) => void): void {
    if (typeof window === 'undefined') {
      (this._socket as import('ws')).send(data, cb)
    } else {
      try {
        (this._socket as WebSocket).send(data)
      } catch (err) {
        if (typeof cb === 'function') cb(err)
        return
      }
      if (typeof cb === 'function') cb()
    }
  }

  public close (code?: number, reason?: string): void {
    if (typeof window === 'undefined') {
      (this._socket as import('ws')).close(code, reason)
    } else {
      (this._socket as WebSocket).close(code, reason)
    }
  }
}

export { SimpleWebSocket }
