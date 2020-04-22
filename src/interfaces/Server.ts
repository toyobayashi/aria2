/**
 * @public
 */
export interface Server {
  /** Original URI. */
  uri: string
  /** This is the URI currently used for downloading. If redirection is involved, currentUri and uri may differ. */
  currentUri: string
  /** Download speed (byte/sec) */
  downloadSpeed: string
}

/**
 * @public
 */
export interface ServerInfo {
  /** Index of the file, starting at 1, in the same order as files appear in the multi-file metalink. */
  index: string
  /** A list of structs which contain the following keys. */
  servers: Server[]
}
