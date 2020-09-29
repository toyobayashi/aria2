import { EventEmitter } from './EventEmitter'
import { Aria2Client } from '../Aria2Client'
import { camelcase } from './camelcase'

/**
 * @public
 */
export class ApiNamespace extends EventEmitter {
  protected _name: string
  protected _client: Aria2Client
  constructor (name: string, client: Aria2Client) {
    super()
    this._name = name
    this._client = client
  }

  public async hasMethod (method: string): Promise<boolean> {
    return await this._client.hasMethod(`${this._name}.${method}`)
  }

  public async hasEvent (event: string): Promise<boolean> {
    return await this._client.hasEvent(`${this._name}.on${camelcase(event, { pascalCase: true })}`)
  }

  public async invokeWithSecret <T = any>(name: string, ...args: any[]): Promise<T> {
    const args_ = [...args]
    const secret = this._client.getOption().secret
    if (typeof secret === 'string' && secret !== '') {
      args_.unshift(`token:${secret}`)
    }
    return await this.invoke<T>(name, ...args_)
  }

  public async invoke <T = any>(name: string, ...args: any[]): Promise<T> {
    return await this._client.invoke<T>(`${this._name}.${name}`, ...args)
  }
}
