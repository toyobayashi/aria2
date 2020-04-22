import { ApiNamespace } from './ApiNamespace'
import { Aria2Client } from '../Aria2Client'
import { RPCRequest, RPCResponse } from '../interfaces/RPC'
import { post } from './http'

/**
 * @public
 */
export class ApiNamespaceSystem extends ApiNamespace {
  constructor (client: Aria2Client) {
    super('system', client)
  }

  /**
   * This method returns all the available RPC methods in an array of string.
   * Unlike other methods, this method does not require secret token.
   * This is safe because this method just returns the available method names.
   */
  public async listMethods (): Promise<string[]> {
    return await this.invoke<string[]>('listMethods')
  }

  /**
   * This method returns all the available RPC notifications in an array of string.
   * Unlike other methods, this method does not require secret token.
   * This is safe because this method just returns the available notifications names.
   */
  public async listNotifications (): Promise<string[]> {
    return await this.invoke<string[]>('listNotifications')
  }

  public async multicall (methods: Aria2Client.MulticallParam[]): Promise<Array<[any]>>
  public async multicall (methods: RPCRequest[]): Promise<RPCResponse[]>
  public async multicall (methods: Aria2Client.MulticallParam[] | RPCRequest[]): Promise<any> {
    if (Array.isArray(methods) && methods.length > 0) {
      if ('methodName' in methods[0]) {
        return await this.invoke<Array<[any]>>('multicall', methods)
      } else {
        return await new Promise<RPCResponse[]>((resolve, reject) => {
          const socket = this._client.getSocket()
          if (socket !== null) {
            const callback: (data: any) => void = (data) => {
              let res: RPCResponse[]
              try {
                res = JSON.parse(data)
              } catch (err) {
                reject(err)
                socket.off('message', callback)
                return
              }

              if (Array.isArray(res) && res.length === methods.length) {
                let valid = true
                for (let i = 0; i < res.length; i++) {
                  if (res[i].jsonrpc !== (methods[i] as RPCRequest).jsonrpc || res[i].id !== (methods[i] as RPCRequest).id) {
                    valid = false
                    break
                  }
                }
                if (valid) {
                  resolve(res)
                  socket.off('message', callback)
                }
              }
            }
            socket.on('message', callback)
            socket.send(JSON.stringify(methods), (err) => {
              if (err != null) {
                reject(err)
                socket.off('message', callback)
              }
            })
          } else {
            post<RPCResponse[]>(this._client.getOption(), methods)
              .then(resolve)
              .catch(reject)
          }
        })
      }
    } else {
      return []
    }
  }
}
