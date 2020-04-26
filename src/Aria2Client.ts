/* eslint-disable no-redeclare */

import { SimpleWebSocket } from './internal/SimpleWebSocket'
import { EventEmitter } from './internal/EventEmitter'
// import * as ObjectId from '@tybys/oid'
import { Aria2Error } from './Aria2Error'
import { ApiNamespaceAria2 } from './internal/ApiNamespaceAria2'
import { ApiNamespaceSystem } from './internal/ApiNamespaceSystem'
import { RPCResponse, RPCRequest, RPCMultiRequest } from './interfaces/RPC'
import { post } from './internal/http'
import { ObjectId } from '@tybys/oid'

const decamelize: typeof import('decamelize') = require('decamelize')

/**
 * @public
 */
export interface Aria2ClientConstructOption {
  host?: string
  port?: number
  path?: string
  secret?: string
  secure?: boolean
  jsonrpcVersion?: string
}

/**
 * @public
 */
class Aria2Client extends EventEmitter {
  private readonly _options: Required<Aria2ClientConstructOption>
  private _socket: SimpleWebSocket | null
  public readonly aria2: ApiNamespaceAria2
  public readonly system: ApiNamespaceSystem

  public static getApiVersion (): string {
    return '1.35.0'
  }

  public static readonly EVENT_OPEN: 'open' = 'open'
  public static readonly EVENT_MESSAGE: 'message' = 'message'
  public static readonly EVENT_ERROR: 'error' = 'error'
  public static readonly EVENT_CLOSE: 'close' = 'close'

  constructor (options?: Aria2ClientConstructOption) {
    super()
    this._options = {
      ...({
        host: '127.0.0.1',
        port: 6800,
        path: '/jsonrpc',
        secret: '',
        secure: false,
        jsonrpcVersion: '2.0'
      }),
      ...(Object.prototype.toString.call(options) === '[object Object]' ? options : {})
    }

    this._socket = null
    this.aria2 = new ApiNamespaceAria2(this)
    this.system = new ApiNamespaceSystem(this)
  }

  public on (event: 'open', listener: (this: Aria2Client, data: any) => void): this
  public on (event: 'message', listener: (this: Aria2Client, data: any) => void): this
  public on (event: 'error', listener: (this: Aria2Client, error: Error) => void): this
  public on (event: 'close', listener: (this: Aria2Client) => void): this
  public on (event: any, listener: any): this {
    return super.on(event, listener)
  }

  public once (event: 'open', listener: (this: Aria2Client, data: any) => void): this
  public once (event: 'message', listener: (this: Aria2Client, data: any) => void): this
  public once (event: 'error', listener: (this: Aria2Client, error: Error) => void): this
  public once (event: 'close', listener: (this: Aria2Client) => void): this
  public once (event: any, listener: any): this {
    return super.once(event, listener)
  }

  public async connect (): Promise<SimpleWebSocket> {
    this._socket = await connect(this)
    const proxyEvents = [Aria2Client.EVENT_OPEN, Aria2Client.EVENT_MESSAGE, Aria2Client.EVENT_ERROR, Aria2Client.EVENT_CLOSE]
    for (const eventName of proxyEvents) {
      this._socket.on(eventName, (...args) => {
        this.emit(eventName, ...args)
      })
    }
    this._socket.on(Aria2Client.EVENT_MESSAGE, (data: any) => {
      let res
      try {
        res = JSON.parse(data)
      } catch (err) {
        this.emit(Aria2Client.EVENT_ERROR, err)
        return
      }
      if (res.jsonrpc === this.getOption().jsonrpcVersion && res.method !== undefined && res.id === undefined) {
        const [ns, eventName] = (res.method as string).split('.');
        (this as any)[ns].emit(decamelize(eventName.substring(2), '-'), res.params)
      }
    })
    this._socket.on(Aria2Client.EVENT_CLOSE, () => {
      if (this._socket !== null) {
        this._socket.removeAllListeners()
        this._socket = null
      }
    })
    return this._socket
  }

  public disconnect (): void {
    if (this._socket !== null) {
      this._socket.close()
    }
  }

  public getSocket (): SimpleWebSocket | null {
    return this._socket
  }

  public getOption (): Required<Aria2ClientConstructOption> {
    return JSON.parse(JSON.stringify(this._options))
  }

  public createRequestParam (method: string, ...args: any[]): Aria2Client.RequestParam {
    const params = [...args]
    for (let i = 0; i < params.length; i++) {
      if (params[i] === undefined) {
        params.splice(i, 1)
        i--
      }
    }
    return new Aria2Client.RequestParam(this._options.jsonrpcVersion, new ObjectId().toHexString(), method, params)
  }

  public async hasMethod (method: string): Promise<boolean> {
    const methods = await this.system.listMethods()
    return methods.includes(method)
  }

  public async hasEvent (event: string): Promise<boolean> {
    const events = await this.system.listNotifications()
    return events.includes(event)
  }

  public async invoke <T = any>(method: string, ...args: any[]): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      const socket = this._socket
      if (socket !== null) {
        const requestParams = this.createRequestParam(method, ...args)
        const callback: (data: any) => void = (data) => {
          let res: RPCResponse<T>
          try {
            res = JSON.parse(data)
          } catch (err) {
            reject(err)
            socket.off(Aria2Client.EVENT_MESSAGE, callback)
            return
          }
          if (res.jsonrpc === requestParams.jsonrpc && res.id === requestParams.id) {
            if (res.error !== undefined) {
              reject(new Aria2Error(res.error.message, res.error.code))
              socket.off(Aria2Client.EVENT_MESSAGE, callback)
            } else {
              resolve(res.result)
              socket.off(Aria2Client.EVENT_MESSAGE, callback)
            }
          }
        }
        socket.on(Aria2Client.EVENT_MESSAGE, callback)

        socket.send(JSON.stringify(requestParams), (err) => {
          if (err != null) {
            reject(err)
            socket.off(Aria2Client.EVENT_MESSAGE, callback)
          }
        })
      } else {
        const requestParams = this.createRequestParam(method, ...args)
        post(this._options, requestParams)
          .then(res => {
            if (res.jsonrpc === requestParams.jsonrpc && res.id === requestParams.id) {
              if (res.error !== undefined) {
                reject(new Aria2Error(res.error.message, res.error.code))
              } else {
                resolve(res.result)
              }
            } else {
              reject(new Error('jsonrpc version or call id error.'))
            }
          })
          .catch(reject)
      }
    })
  }
}

/**
 * @public
 */
namespace Aria2Client {
  export enum Position {
    POS_SET = 'POS_SET',
    POS_CUR = 'POS_CUR',
    POS_END = 'POS_END'
  }

  export class MulticallParam implements RPCMultiRequest {
    constructor (public methodName: string, public params: any[]) {}
  }

  export class RequestParam<T = any[]> implements RPCRequest<T> {
    constructor (public jsonrpc: string, public id: string, public method: string, public params: T) {}
  }
}

/**
 * @public
 */
export { Aria2Client }

async function connect (client: Aria2Client): Promise<SimpleWebSocket> {
  return await new Promise<SimpleWebSocket>((resolve, reject) => {
    const options = client.getOption()
    const socket = new SimpleWebSocket(`ws${options.secure ? 's' : ''}://${options.host}:${options.port}${options.path}`)
    function onError (err: Error): void {
      socket.off(Aria2Client.EVENT_ERROR, onError)
      socket.off(Aria2Client.EVENT_OPEN, onOpen)
      client.emit(Aria2Client.EVENT_ERROR, err)
      reject(err)
    }
    function onOpen (): void {
      socket.off(Aria2Client.EVENT_CLOSE, onClose)
      socket.off(Aria2Client.EVENT_ERROR, onError)
      socket.off(Aria2Client.EVENT_OPEN, onOpen)
      client.emit(Aria2Client.EVENT_OPEN)
      resolve(socket)
    }
    function onClose (): void {
      socket.off(Aria2Client.EVENT_CLOSE, onClose)
      client.emit(Aria2Client.EVENT_CLOSE)
    }
    socket.on(Aria2Client.EVENT_CLOSE, onClose)
    socket.on(Aria2Client.EVENT_ERROR, onError)
    socket.on(Aria2Client.EVENT_OPEN, onOpen)
  })
}
