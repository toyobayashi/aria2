/**
 * @public
 */
export interface RPCRequest<T = any[]> {
  jsonrpc: string
  id: string
  method: string
  params: T
}

/**
 * @public
 */
export interface RPCResponse<T = any> {
  jsonrpc: string
  id?: string
  result?: T
  method?: string
  error?: {
    code: number
    message: string
  }
}

/**
 * @public
 */
export interface RPCMultiRequest<T = any[]> {
  methodName: string
  params: T
}
