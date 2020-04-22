import { ApiNamespace } from './ApiNamespace'
import { Aria2Client } from '../Aria2Client'
import { GlobalOption, Option, VersionInfo, Status } from '../types'
import { Uri } from '../interfaces/Uri'
import { File } from '../interfaces/File'
import { Peer } from '../interfaces/Peer'
import { ServerInfo } from '../interfaces/Server'
import { Session } from '../interfaces/Session'
import { GlobalStat } from '../interfaces/GlobalStat'

/**
 * @public
 */
export interface Aria2EventParamItem {
  gid: string
}

/**
 * @public
 */
export type Aria2EventParam = Aria2EventParamItem[]

/**
 * @public
 */
export class ApiNamespaceAria2 extends ApiNamespace {
  constructor (client: Aria2Client) {
    super('aria2', client)
  }

  public on (event: 'download-start', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public on (event: 'download-pause', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public on (event: 'download-stop', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public on (event: 'download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public on (event: 'download-error', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public on (event: 'bt-download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public on (event: string | symbol, listener: (this: ApiNamespaceAria2, ...args: any[]) => void): this
  public on (event: any, listener: any): any {
    return super.on(event, listener)
  }

  public once (event: 'download-start', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public once (event: 'download-pause', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public once (event: 'download-stop', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public once (event: 'download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public once (event: 'download-error', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public once (event: 'bt-download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this
  public once (event: string | symbol, listener: (this: ApiNamespaceAria2, ...args: any[]) => void): this
  public once (event: any, listener: any): any {
    return super.once(event, listener)
  }

  /**
   * This method returns the version of aria2 and the list of enabled features.
   * @returns the version of aria2 and the list of enabled features
   */
  public async getVersion (): Promise<VersionInfo> {
    return await this.invokeWithSecret<VersionInfo>('getVersion')
  }

  /**
   * This method adds a new download.
   * uris is an array of HTTP/FTP/SFTP/BitTorrent URIs (strings) pointing to the same resource.
   * If you mix URIs pointing to different resources,
   * then the download may fail or be corrupted without aria2 complaining.
   * When adding BitTorrent Magnet URIs,
   * uris must have only one element and it should be BitTorrent Magnet URI.
   * options is a struct and its members are pairs of option name and value.
   * See `Options` below for more details. If position is given,
   * it must be an integer starting from 0.
   * The new download will be inserted at position in the waiting queue.
   * If position is omitted or position is larger than the current size of the queue,
   * the new download is appended to the end of the queue.
   * This method returns the GID of the newly registered download.
   *
   * @param uris - an array of HTTP/FTP/SFTP/BitTorrent URIs (strings) pointing to the same resource
   * @param options - a struct and its members are pairs of option name and value
   * @param position - an integer starting from 0
   * @returns the GID of the newly registered download
   */
  public async addUri (uris: string[], options?: Option, position?: number): Promise<string> {
    return await this.invokeWithSecret<string>('addUri', uris, options, position)
  }

  /**
   * This method adds a BitTorrent download by uploading a ".torrent" file.
   * If you want to add a BitTorrent Magnet URI, use the `aria2.addUri()` method instead.
   * torrent must be a base64-encoded string containing the contents of the ".torrent" file.
   * uris is an array of URIs (string). uris is used for Web-seeding.
   * For single file torrents, the URI can be a complete URI pointing to the resource;
   * if URI ends with /, name in torrent file is added.
   * For multi-file torrents, name and path in torrent are added to form a URI for each file.
   * options is a struct and its members are pairs of option name and value. See Options below for more details.
   * If position is given, it must be an integer starting from 0.
   * The new download will be inserted at position in the waiting queue.
   * If position is omitted or position is larger than the current size of the queue,
   * the new download is appended to the end of the queue.
   * This method returns the GID of the newly registered download.
   * If `--rpc-save-upload-metadata` is `true`, the uploaded data is saved as a file
   * named as the hex string of SHA-1 hash of data plus ".torrent" in the directory specified by `--dir` option.
   * E.g. a file name might be `0a3893293e27ac0490424c06de4d09242215f0a6.torrent`.
   * If a file with the same name already exists, it is overwritten!
   * If the file cannot be saved successfully or `--rpc-save-upload-metadata` is `false`,
   * the downloads added by this method are not saved by `--save-session`.
   * @param torrent - a base64-encoded string containing the contents of the ".torrent" file
   * @param uris - an array of URIs (string)
   * @param options - struct and its members are pairs of option name and value
   * @param position - an integer starting from 0
   * @returns the GID of the newly registered download
   */
  public async addTorrent (torrent: string, uris?: string[], options?: Option, position?: number): Promise<string> {
    return await this.invokeWithSecret<string>('addTorrent', torrent, uris, options, position)
  }

  /**
   * This method adds a Metalink download by uploading a ".metalink" file.
   * metalink is a base64-encoded string which contains the contents of the ".metalink" file.
   * options is a struct and its members are pairs of option name and value. See Options below for more details.
   * If position is given, it must be an integer starting from 0.
   * The new download will be inserted at position in the waiting queue.
   * If position is omitted or position is larger than the current size of the queue,
   * the new download is appended to the end of the queue.
   * This method returns an array of GIDs of newly registered downloads.
   * If `--rpc-save-upload-metadata` is `true`,
   * the uploaded data is saved as a file named hex string of SHA-1 hash of data plus ".metalink" in the directory specified by `--dir` option.
   * E.g. a file name might be 0a3893293e27ac0490424c06de4d09242215f0a6.metalink.
   * If a file with the same name already exists, it is overwritten!
   * If the file cannot be saved successfully or `--rpc-save-upload-metadata` is `false`,
   * the downloads added by this method are not saved by `--save-session`.
   * @param metalink - a base64-encoded string which contains the contents of the ".metalink" file
   * @param options - a struct and its members are pairs of option name and value
   * @param position - an integer starting from 0
   * @returns the GID of the newly registered download
   */
  public async addMetalink (metalink: string, options?: Option, position?: number): Promise<string[]> {
    return await this.invokeWithSecret<string[]>('addMetalink', metalink, options, position)
  }

  /**
   * This method removes the download denoted by gid (string).
   * If the specified download is in progress, it is first stopped.
   * The status of the removed download becomes removed.
   * This method returns GID of removed download.
   * @param gid - GID
   * @returns GID of removed download
   */
  public async remove (gid: string): Promise<string> {
    return await this.invokeWithSecret<string>('remove', gid)
  }

  /**
   * This method removes the download denoted by gid.
   * This method behaves just like `aria2.remove()`
   * except that this method removes the download without performing any actions which take time,
   * such as contacting BitTorrent trackers to unregister the download first.
   * @param gid - GID
   * @returns GID of removed download
   */
  public async forceRemove (gid: string): Promise<string> {
    return await this.invokeWithSecret<string>('forceRemove', gid)
  }

  /**
   * This method pauses the download denoted by gid (string).
   * The status of paused download becomes `paused`.
   * If the download was active, the download is placed in the front of waiting queue.
   * While the status is `paused`, the download is not started.
   * To change status to waiting, use the `aria2.unpause()` method.
   * This method returns GID of paused download.
   * @param gid - GID
   * @returns GID of paused download
   */
  public async pause (gid: string): Promise<string> {
    return await this.invokeWithSecret<string>('pause', gid)
  }

  /**
   * This method is equal to calling `aria2.pause()` for every active/waiting download.
   * This methods returns `OK`.
   * @returns string 'OK'
   */
  public async pauseAll (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('pauseAll')
  }

  /**
   * This method pauses the download denoted by gid.
   * This method behaves just like `aria2.pause()`
   * except that this method pauses downloads without performing any actions which take time,
   * such as contacting BitTorrent trackers to unregister the download first.
   * @param gid - GID
   * @returns GID of paused download
   */
  public async forcePause (gid: string): Promise<string> {
    return await this.invokeWithSecret<string>('forcePause', gid)
  }

  /**
   * This method is equal to calling `aria2.forcePause()` for every active/waiting download.
   * This methods returns `OK`.
   * @returns string 'OK'
   */
  public async forcePauseAll (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('forcePauseAll')
  }

  /**
   * This method changes the status of the download denoted by gid (string) from `paused` to `waiting`,
   * making the download eligible to be restarted.
   * This method returns the GID of the unpaused download.
   * @param gid - GID
   * @returns GID of unpaused download
   */
  public async unpause (gid: string): Promise<string> {
    return await this.invokeWithSecret<string>('unpause', gid)
  }

  /**
   * This method is equal to calling `aria2.unpause()` for every paused download.
   * This methods returns `OK`.
   * @returns string 'OK'
   */
  public async unpauseAll (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('unpauseAll')
  }

  /**
   * This method returns the URIs used in the download denoted by gid (string).
   * The response is an array of structs. Values are string.
   * @param gid - GID
   * @returns an array of structs
   */
  public async getUris (gid: string): Promise<Uri[]> {
    return await this.invokeWithSecret<Uri[]>('getUris', gid)
  }

  /**
   * This method returns the file list of the download denoted by gid (string).
   * The response is an array of structs. Values are strings.
   * @param gid - GID
   * @returns an array of structs
   */
  public async getFiles (gid: string): Promise<File[]> {
    return await this.invokeWithSecret<File[]>('getFiles', gid)
  }

  /**
   * This method returns a list peers of the download denoted by gid (string).
   * This method is for BitTorrent only.
   * The response is an array of structs. Values are strings.
   * @param gid - GID
   * @returns an array of structs
   */
  public async getPeers (gid: string): Promise<Peer[]> {
    return await this.invokeWithSecret<Peer[]>('getPeers', gid)
  }

  /**
   * This method returns currently connected HTTP(S)/FTP/SFTP servers of the download denoted by gid (string).
   * The response is an array of structs. Values are strings.
   * @param gid - GID
   * @returns an array of structs
   */
  public async getServers (gid: string): Promise<ServerInfo[]> {
    return await this.invokeWithSecret<ServerInfo[]>('getServers', gid)
  }

  /**
   * This method returns the global options.
   * The response is a struct.
   * Its keys are the names of options.
   * Values are strings.
   * Note that this method does not return options which have no default value and have not been set on the command-line,
   * in configuration files or RPC methods.
   * Because global options are used as a template for the options of newly added downloads,
   * the response contains keys returned by the `aria2.getOption()` method.
   */
  public async getGlobalOption (): Promise<GlobalOption> {
    return await this.invokeWithSecret<GlobalOption>('getGlobalOption')
  }

  /**
   * This method returns options of the download denoted by gid.
   * The response is a struct where keys are the names of options.
   * The values are strings.
   * Note that this method does not return options which have no default value and have not been set on the command-line,
   * in configuration files or RPC methods.
   * @param gid - GID
   */
  public async getOption (gid: string): Promise<GlobalOption> {
    return await this.invokeWithSecret<GlobalOption>('getOption', gid)
  }

  public async changeOption (gid: string, options: Omit<Option, 'dry-run' | 'metalink-base-uri' | 'parameterized-uri' | 'pause' | 'piece-length' | 'rpc-save-upload-metadata'>): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('changeOption', gid, options)
  }

  public async changeGlobalOption (options: {
    'bt-max-open-files'?: string
    'download-result'?: string
    'keep-unfinished-download-result'?: string
    log?: string
    'log-level'?: string
    'max-concurrent-downloads'?: string
    'max-download-result'?: string
    'max-overall-download-limit'?: string
    'max-overall-upload-limit'?: string
    'optimize-concurrent-downloads'?: string
    'save-cookies'?: string
    'save-session'?: string
    'server-stat-of'?: string
  } & Omit<Option, 'checksum' | 'index-out' | 'out' | 'pause' | 'select-file'>): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('changeGlobalOption', options)
  }

  /**
   * This method returns the progress of the download denoted by gid (string).
   * keys is an array of strings.
   * If specified, the response contains only keys in the keys array.
   * If keys is empty or omitted, the response contains all keys.
   * This is useful when you just want specific keys and avoid unnecessary transfers.
   * For example, `aria2.tellStatus("2089b05ecca3d829", ["gid", "status"])` returns the gid and status keys only.
   * The response is a struct. Values are strings.
   * @param gid - GID
   * @param keys - response contains these keys only
   * @returns struct
   */
  public async tellStatus <T extends keyof Status>(gid: string, keys?: T[]): Promise<Pick<Status, T>> {
    return await this.invokeWithSecret<Pick<Status, T>>('tellStatus', gid, keys)
  }

  /**
   * This method returns a list of active downloads.
   * The response is an array of the same structs as returned by the `aria2.tellStatus()` method.
   * @param keys - response contains these keys only
   * @returns array
   */
  public async tellActive <T extends keyof Status>(keys?: T[]): Promise<Array<Pick<Status, T>>> {
    return await this.invokeWithSecret<Array<Pick<Status, T>>>('tellActive', keys)
  }

  public async tellWaiting <T extends keyof Status>(offset: number, num: number, keys?: T[]): Promise<Array<Pick<Status, T>>> {
    return await this.invokeWithSecret<Array<Pick<Status, T>>>('tellWaiting', offset, num, keys)
  }

  public async tellStopped <T extends keyof Status>(offset: number, num: number, keys?: T[]): Promise<Array<Pick<Status, T>>> {
    return await this.invokeWithSecret<Array<Pick<Status, T>>>('tellStopped', offset, num, keys)
  }

  /**
   * @returns an integer denoting the resulting position.
   */
  public async changePosition (gid: string, pos: number, how: Aria2Client.Position): Promise<number> {
    return await this.invokeWithSecret<number>('changePosition', gid, pos, how)
  }

  /**
   * @returns a list which contains two integers. The first integer is the number of URIs deleted. The second integer is the number of URIs added.
   */
  public async changeUri (gid: string, fileIndex: number, delUris: string[], addUris: string[], position?: number): Promise<number> {
    return await this.invokeWithSecret<number>('changeUri', gid, fileIndex, delUris, addUris, position)
  }

  /**
   * This method saves the current session to a file specified by the `--save-session` option.
   * This method returns `OK` if it succeeds.
   * @returns string 'OK'
   */
  public async saveSession (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('saveSession')
  }

  /**
   * This method returns session information. The response is a struct
   */
  public async getSessionInfo (): Promise<Session> {
    return await this.invokeWithSecret<Session>('getSessionInfo')
  }

  /**
   * This method returns global statistics such as the overall download and upload speeds
   */
  public async getGlobalStat (): Promise<GlobalStat> {
    return await this.invokeWithSecret<GlobalStat>('getGlobalStat')
  }

  /**
   * This method purges completed/error/removed downloads to free memory.
   * This method returns OK.
   * @returns string 'OK'
   */
  public async purgeDownloadResult (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('purgeDownloadResult')
  }

  /**
   * This method removes a completed/error/removed download denoted by gid from memory.
   * This method returns OK.
   * @param gid - GID
   * @returns string 'OK'
   */
  public async removeDownloadResult (gid: string): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('removeDownloadResult', gid)
  }

  /**
   * This method shuts down aria2. This method returns `OK`.
   * @returns string 'OK'
   */
  public async shutdown (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('shutdown')
  }

  /**
   * This method shuts down `aria2()`.
   * This method behaves like :func:'aria2.shutdown\`
   * without performing any actions which take time,
   * such as contacting BitTorrent trackers to unregister downloads first.
   * This method returns `OK`.
   * @returns string 'OK'
   */
  public async forceShutdown (): Promise<'OK'> {
    return await this.invokeWithSecret<'OK'>('forceShutdown')
  }
}
