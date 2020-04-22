/**
 * @public
 */
export interface Uri {
  /** URI */
  uri: string
  /** 'used' if the URI is in use. 'waiting' if the URI is still waiting in the queue. */
  status: string
}
