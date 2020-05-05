/**
 * aria2 JSON RPC library for Node.js and browser
 *
 * @packageDocumentation
 */


/**
 * @public
 */
export declare class ApiNamespace extends EventEmitter {
    protected _name: string;
    protected _client: Aria2Client;
    constructor(name: string, client: Aria2Client);
    hasMethod(method: string): Promise<boolean>;
    hasEvent(event: string): Promise<boolean>;
    invokeWithSecret<T = any>(name: string, ...args: any[]): Promise<T>;
    invoke<T = any>(name: string, ...args: any[]): Promise<T>;
}

/**
 * @public
 */
export declare class ApiNamespaceAria2 extends ApiNamespace {
    constructor(client: Aria2Client);
    on(event: 'download-start', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    on(event: 'download-pause', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    on(event: 'download-stop', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    on(event: 'download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    on(event: 'download-error', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    on(event: 'bt-download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    on(event: string | symbol, listener: (this: ApiNamespaceAria2, ...args: any[]) => void): this;
    once(event: 'download-start', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    once(event: 'download-pause', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    once(event: 'download-stop', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    once(event: 'download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    once(event: 'download-error', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    once(event: 'bt-download-complete', listener: (this: ApiNamespaceAria2, data: Aria2EventParam) => void): this;
    once(event: string | symbol, listener: (this: ApiNamespaceAria2, ...args: any[]) => void): this;
    /**
     * This method returns the version of aria2 and the list of enabled features.
     * @returns the version of aria2 and the list of enabled features
     */
    getVersion(): Promise<VersionInfo>;
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
    addUri(uris: string[], options?: Option_2, position?: number): Promise<string>;
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
    addTorrent(torrent: string, uris?: string[], options?: Option_2, position?: number): Promise<string>;
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
    addMetalink(metalink: string, options?: Option_2, position?: number): Promise<string[]>;
    /**
     * This method removes the download denoted by gid (string).
     * If the specified download is in progress, it is first stopped.
     * The status of the removed download becomes removed.
     * This method returns GID of removed download.
     * @param gid - GID
     * @returns GID of removed download
     */
    remove(gid: string): Promise<string>;
    /**
     * This method removes the download denoted by gid.
     * This method behaves just like `aria2.remove()`
     * except that this method removes the download without performing any actions which take time,
     * such as contacting BitTorrent trackers to unregister the download first.
     * @param gid - GID
     * @returns GID of removed download
     */
    forceRemove(gid: string): Promise<string>;
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
    pause(gid: string): Promise<string>;
    /**
     * This method is equal to calling `aria2.pause()` for every active/waiting download.
     * This methods returns `OK`.
     * @returns string 'OK'
     */
    pauseAll(): Promise<'OK'>;
    /**
     * This method pauses the download denoted by gid.
     * This method behaves just like `aria2.pause()`
     * except that this method pauses downloads without performing any actions which take time,
     * such as contacting BitTorrent trackers to unregister the download first.
     * @param gid - GID
     * @returns GID of paused download
     */
    forcePause(gid: string): Promise<string>;
    /**
     * This method is equal to calling `aria2.forcePause()` for every active/waiting download.
     * This methods returns `OK`.
     * @returns string 'OK'
     */
    forcePauseAll(): Promise<'OK'>;
    /**
     * This method changes the status of the download denoted by gid (string) from `paused` to `waiting`,
     * making the download eligible to be restarted.
     * This method returns the GID of the unpaused download.
     * @param gid - GID
     * @returns GID of unpaused download
     */
    unpause(gid: string): Promise<string>;
    /**
     * This method is equal to calling `aria2.unpause()` for every paused download.
     * This methods returns `OK`.
     * @returns string 'OK'
     */
    unpauseAll(): Promise<'OK'>;
    /**
     * This method returns the URIs used in the download denoted by gid (string).
     * The response is an array of structs. Values are string.
     * @param gid - GID
     * @returns an array of structs
     */
    getUris(gid: string): Promise<Uri[]>;
    /**
     * This method returns the file list of the download denoted by gid (string).
     * The response is an array of structs. Values are strings.
     * @param gid - GID
     * @returns an array of structs
     */
    getFiles(gid: string): Promise<File_2[]>;
    /**
     * This method returns a list peers of the download denoted by gid (string).
     * This method is for BitTorrent only.
     * The response is an array of structs. Values are strings.
     * @param gid - GID
     * @returns an array of structs
     */
    getPeers(gid: string): Promise<Peer[]>;
    /**
     * This method returns currently connected HTTP(S)/FTP/SFTP servers of the download denoted by gid (string).
     * The response is an array of structs. Values are strings.
     * @param gid - GID
     * @returns an array of structs
     */
    getServers(gid: string): Promise<ServerInfo[]>;
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
    getGlobalOption(): Promise<GlobalOption>;
    /**
     * This method returns options of the download denoted by gid.
     * The response is a struct where keys are the names of options.
     * The values are strings.
     * Note that this method does not return options which have no default value and have not been set on the command-line,
     * in configuration files or RPC methods.
     * @param gid - GID
     */
    getOption(gid: string): Promise<GlobalOption>;
    /**
     * This method changes options of the download denoted by gid (string) dynamically.
     * options is a struct.
     * This method returns OK for success.
     * @param gid - GID
     * @param options - struct
     * @returns string 'OK'
     */
    changeOption(gid: string, options: Omit<Option_2, 'dry-run' | 'metalink-base-uri' | 'parameterized-uri' | 'pause' | 'piece-length' | 'rpc-save-upload-metadata'>): Promise<'OK'>;
    /**
     * This method changes global options dynamically.
     * options is a struct.
     * This method returns OK for success.
     * @param options - struct
     * @returns string 'OK'
     */
    changeGlobalOption(options: {
        'bt-max-open-files'?: string;
        'download-result'?: string;
        'keep-unfinished-download-result'?: string;
        log?: string;
        'log-level'?: string;
        'max-concurrent-downloads'?: string;
        'max-download-result'?: string;
        'max-overall-download-limit'?: string;
        'max-overall-upload-limit'?: string;
        'optimize-concurrent-downloads'?: string;
        'save-cookies'?: string;
        'save-session'?: string;
        'server-stat-of'?: string;
    } & Omit<Option_2, 'checksum' | 'index-out' | 'out' | 'pause' | 'select-file'>): Promise<'OK'>;
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
    tellStatus<T extends keyof Status>(gid: string, keys?: T[]): Promise<Pick<Status, T>>;
    /**
     * This method returns a list of active downloads.
     * The response is an array of the same structs as returned by the `aria2.tellStatus()` method.
     * @param keys - response contains these keys only
     * @returns array
     */
    tellActive<T extends keyof Status>(keys?: T[]): Promise<Array<Pick<Status, T>>>;
    /**
     * This method returns a list of waiting downloads, including paused ones.
     * offset is an integer and specifies the offset from the download waiting at the front.
     * num is an integer and specifies the max. number of downloads to be returned.
     * For the keys parameter, please refer to the `aria2.tellStatus()` method.
     * If offset is a positive integer, this method returns downloads in the range of [offset, offset + num).
     * offset can be a negative integer.
     * offset == -1 points last download in the waiting queue and
     * offset == -2 points the download before the last download, and so on.
     * Downloads in the response are in reversed order then.
     * @param offset - an integer and specifies the offset from the download waiting at the front
     * @param num - an integer and specifies the max number of downloads to be returned
     * @param keys - response contains these keys only
     * @returns array
     */
    tellWaiting<T extends keyof Status>(offset: number, num: number, keys?: T[]): Promise<Array<Pick<Status, T>>>;
    /**
     * This method returns a list of stopped downloads.
     * offset is an integer and specifies the offset from the least recently stopped download.
     * num is an integer and specifies the max. number of downloads to be returned.
     * For the keys parameter, please refer to the `aria2.tellStatus()` method.
     * offset and num have the same semantics as described in the `aria2.tellWaiting()` method.
     * The response is an array of the same structs as returned by the `aria2.tellStatus()` method.
     * @param offset - an integer and specifies the offset from the least recently stopped download
     * @param num - an integer and specifies the max number of downloads to be returned
     * @param keys - response contains these keys only
     * @returns array
     */
    tellStopped<T extends keyof Status>(offset: number, num: number, keys?: T[]): Promise<Array<Pick<Status, T>>>;
    /**
     * This method changes the position of the download denoted by gid in the queue.
     * pos is an integer.
     * how is a string.
     * If how is POS_SET, it moves the download to a position relative to the beginning of the queue.
     * If how is POS_CUR, it moves the download to a position relative to the current position.
     * If how is POS_END, it moves the download to a position relative to the end of the queue.
     * If the destination position is less than 0 or beyond the end of the queue,
     * it moves the download to the beginning or the end of the queue respectively.
     * The response is an integer denoting the resulting position.
     * @param gid - GID
     * @param pos - position
     * @param how - POS_SET | POS_CUR | POS_END
     * @returns an integer denoting the resulting position.
     */
    changePosition(gid: string, pos: number, how: Aria2Client.Position): Promise<number>;
    /**
     * This method removes the URIs in delUris from and appends the URIs in addUris to download denoted by gid.
     * delUris and addUris are lists of strings.
     * A download can contain multiple files and URIs are attached to each file.
     * fileIndex is used to select which file to remove/attach given URIs.
     * fileIndex is 1-based.
     * position is used to specify where URIs are inserted in the existing waiting URI list.
     * position is 0-based.
     * When position is omitted, URIs are appended to the back of the list.
     * This method first executes the removal and then the addition.
     * position is the position after URIs are removed, not the position when this method is called.
     * When removing an URI, if the same URIs exist in download, only one of them is removed for each URI in delUris.
     * In other words, if there are three URIs `http://example.org/aria2` and you want remove them all,
     * you have to specify (at least) 3 `http://example.org/aria2` in delUris.
     * This method returns a list which contains two integers.
     * The first integer is the number of URIs deleted.
     * The second integer is the number of URIs added.
     * @param gid - GID
     * @param fileIndex - 1-based, be used to select which file to remove/attach given URIs
     * @param delUris - lists of strings
     * @param addUris - lists of strings
     * @param position - 0-based, be used to specify where URIs are inserted in the existing waiting URI list
     * @returns a list which contains two integers.
     */
    changeUri(gid: string, fileIndex: number, delUris: string[], addUris: string[], position?: number): Promise<[number, number]>;
    /**
     * This method saves the current session to a file specified by the `--save-session` option.
     * This method returns `OK` if it succeeds.
     * @returns string 'OK'
     */
    saveSession(): Promise<'OK'>;
    /**
     * This method returns session information. The response is a struct
     * @returns session information
     */
    getSessionInfo(): Promise<Session>;
    /**
     * This method returns global statistics such as the overall download and upload speeds
     * @returns global statistics such as the overall download and upload speeds
     */
    getGlobalStat(): Promise<GlobalStat>;
    /**
     * This method purges completed/error/removed downloads to free memory.
     * This method returns OK.
     * @returns string 'OK'
     */
    purgeDownloadResult(): Promise<'OK'>;
    /**
     * This method removes a completed/error/removed download denoted by gid from memory.
     * This method returns OK.
     * @param gid - GID
     * @returns string 'OK'
     */
    removeDownloadResult(gid: string): Promise<'OK'>;
    /**
     * This method shuts down aria2. This method returns `OK`.
     * @returns string 'OK'
     */
    shutdown(): Promise<'OK'>;
    /**
     * This method shuts down `aria2()`.
     * This method behaves like :func:'aria2.shutdown\`
     * without performing any actions which take time,
     * such as contacting BitTorrent trackers to unregister downloads first.
     * This method returns `OK`.
     * @returns string 'OK'
     */
    forceShutdown(): Promise<'OK'>;
}

/**
 * @public
 */
export declare class ApiNamespaceSystem extends ApiNamespace {
    constructor(client: Aria2Client);
    /**
     * This method returns all the available RPC methods in an array of string.
     * Unlike other methods, this method does not require secret token.
     * This is safe because this method just returns the available method names.
     */
    listMethods(): Promise<string[]>;
    /**
     * This method returns all the available RPC notifications in an array of string.
     * Unlike other methods, this method does not require secret token.
     * This is safe because this method just returns the available notifications names.
     */
    listNotifications(): Promise<string[]>;
    multicall(methods: Aria2Client.MulticallParam[]): Promise<Array<[any]>>;
    multicall(methods: RPCRequest[]): Promise<RPCResponse[]>;
}

/**
 * @public
 */
export declare class Aria2Client extends EventEmitter {
    private readonly _options;
    private _socket;
    readonly aria2: ApiNamespaceAria2;
    readonly system: ApiNamespaceSystem;
    static getApiVersion(): string;
    static readonly EVENT_OPEN: 'open';
    static readonly EVENT_MESSAGE: 'message';
    static readonly EVENT_ERROR: 'error';
    static readonly EVENT_CLOSE: 'close';
    constructor(options?: Aria2ClientConstructOption);
    on(event: 'open', listener: (this: Aria2Client, data: any) => void): this;
    on(event: 'message', listener: (this: Aria2Client, data: any) => void): this;
    on(event: 'error', listener: (this: Aria2Client, error: Error) => void): this;
    on(event: 'close', listener: (this: Aria2Client) => void): this;
    once(event: 'open', listener: (this: Aria2Client, data: any) => void): this;
    once(event: 'message', listener: (this: Aria2Client, data: any) => void): this;
    once(event: 'error', listener: (this: Aria2Client, error: Error) => void): this;
    once(event: 'close', listener: (this: Aria2Client) => void): this;
    connect(): Promise<SimpleWebSocket>;
    disconnect(): void;
    getSocket(): SimpleWebSocket | null;
    getOption(): Required<Aria2ClientConstructOption>;
    createRequestParam(method: string, ...args: any[]): Aria2Client.RequestParam;
    hasMethod(method: string): Promise<boolean>;
    hasEvent(event: string): Promise<boolean>;
    invoke<T = any>(method: string, ...args: any[]): Promise<T>;
}

/**
 * @public
 */
export declare namespace Aria2Client {
    export enum Position {
        POS_SET = "POS_SET",
        POS_CUR = "POS_CUR",
        POS_END = "POS_END"
    }
    export class MulticallParam implements RPCMultiRequest {
        methodName: string;
        params: any[];
        constructor(methodName: string, params: any[]);
    }
    export class RequestParam<T = any[]> implements RPCRequest<T> {
        jsonrpc: string;
        id: string;
        method: string;
        params: T;
        constructor(jsonrpc: string, id: string, method: string, params: T);
    }
}

/**
 * @public
 */
export declare interface Aria2ClientConstructOption {
    host?: string;
    port?: number;
    path?: string;
    secret?: string;
    secure?: boolean;
    jsonrpcVersion?: string;
}

/**
 * @public
 */
export declare class Aria2Error extends Error {
    code: number;
    constructor(message: string, code: number);
}

/**
 * @public
 */
export declare type Aria2EventParam = Aria2EventParamItem[];

/**
 * @public
 */
export declare interface Aria2EventParamItem {
    gid: string;
}

/**
 * See also https://nodejs.org/api/events.html
 * @public
 */
export declare class EventEmitter {
    static defaultMaxListeners: number;
    static errorMonitor: symbol;
    private maxListeners;
    private readonly _events;
    constructor();
    private _addListener;
    /** Alias for emitter.on(eventName, listener). */
    addListener(eventName: string | symbol, listener: Function | WrappedFunction): this;
    /**
     * Synchronously calls each of the listeners registered for the event named
     * eventName, in the order they were registered, passing the supplied
     * arguments to each.
     * @returns true if the event had listeners, false otherwise
     */
    emit(eventName: string | symbol, ...args: any[]): boolean;
    /**
     * Returns an array listing the events for which the emitter has
     * registered listeners.
     */
    eventNames(): [string | symbol];
    /**
     * Returns the current max listener value for the EventEmitter which is
     * either set by emitter.setMaxListeners(n) or defaults to
     * EventEmitter.defaultMaxListeners.
     */
    getMaxListeners(): number;
    /**
     * Returns the number of listeners listening to the event named
     * eventName.
     */
    listenerCount(eventName: string | symbol): number;
    private _listeners;
    private unwrapListeners;
    /** Returns a copy of the array of listeners for the event named eventName. */
    listeners(eventName: string | symbol): Function[];
    /**
     * Returns a copy of the array of listeners for the event named eventName,
     * including any wrappers (such as those created by .once()).
     */
    rawListeners(eventName: string | symbol): Array<Function | WrappedFunction>;
    /** Alias for emitter.removeListener(). */
    off(eventName: string | symbol, listener: Function): this;
    /**
     * Adds the listener function to the end of the listeners array for the event
     *  named eventName. No checks are made to see if the listener has already
     * been added. Multiple calls passing the same combination of eventName and
     * listener will result in the listener being added, and called, multiple
     * times.
     */
    on(eventName: string | symbol, listener: Function | WrappedFunction): this;
    /**
     * Adds a one-time listener function for the event named eventName. The next
     * time eventName is triggered, this listener is removed and then invoked.
     */
    once(eventName: string | symbol, listener: Function): this;
    private onceWrap;
    /**
     * Adds the listener function to the beginning of the listeners array for the
     *  event named eventName. No checks are made to see if the listener has
     * already been added. Multiple calls passing the same combination of
     * eventName and listener will result in the listener being added, and
     * called, multiple times.
     */
    prependListener(eventName: string | symbol, listener: Function | WrappedFunction): this;
    /**
     * Adds a one-time listener function for the event named eventName to the
     * beginning of the listeners array. The next time eventName is triggered,
     * this listener is removed, and then invoked.
     */
    prependOnceListener(eventName: string | symbol, listener: Function): this;
    /** Removes all listeners, or those of the specified eventName. */
    removeAllListeners(eventName?: string | symbol): this;
    /**
     * Removes the specified listener from the listener array for the event
     * named eventName.
     */
    removeListener(eventName: string | symbol, listener: Function): this;
    /**
     * By default EventEmitters will print a warning if more than 10 listeners
     * are added for a particular event. This is a useful default that helps
     * finding memory leaks. Obviously, not all events should be limited to just
     * 10 listeners. The emitter.setMaxListeners() method allows the limit to be
     * modified for this specific EventEmitter instance. The value can be set to
     * Infinity (or 0) to indicate an unlimited number of listeners.
     */
    setMaxListeners(n: number): this;
}

/**
 * @public
 */
declare interface File_2 {
    /** Index of the file, starting at 1, in the same order as files appear in the multi-file torrent. */
    index: string;
    /** File path. */
    path: string;
    /** File size in bytes. */
    length: string;
    /**
     * Completed length of this file in bytes.
     * Please note that it is possible that sum of `completedLength` is less than the `completedLength` returned by the `aria2.tellStatus()` method.
     * This is because `completedLength` in `aria2.getFiles()` only includes completed pieces.
     * On the other hand, `completedLength` in `aria2.tellStatus()` also includes partially completed pieces.
     */
    completedLength: string;
    /**
     * `true` if this file is selected by `--select-file` option.
     * If `--select-file` is not specified or this is single-file torrent or not a torrent download at all,
     * this value is always `true`. Otherwise `false`.
     */
    selected: string;
    /** Returns a list of URIs for this file. The element type is the same struct used in the `aria2.getUris()` method. */
    uris: Uri[];
}
export { File_2 as File }

/**
 * @public
 */
export declare interface GlobalOption {
    'allow-overwrite': string;
    'allow-piece-length-change': string;
    'always-resume': string;
    'async-dns': string;
    'auto-file-renaming': string;
    'auto-save-interval': string;
    'bt-detach-seed-only': string;
    'bt-enable-hook-after-hash-check': string;
    'bt-enable-lpd': string;
    'bt-force-encryption': string;
    'bt-hash-check-seed': string;
    'bt-load-saved-metadata': string;
    'bt-max-open-files': string;
    'bt-max-peers': string;
    'bt-metadata-only': string;
    'bt-min-crypto-level': string;
    'bt-remove-unselected-file': string;
    'bt-request-peer-speed-limit': string;
    'bt-require-crypto': string;
    'bt-save-metadata': string;
    'bt-seed-unverified': string;
    'bt-stop-timeout': string;
    'bt-tracker-connect-timeout': string;
    'bt-tracker-interval': string;
    'bt-tracker-timeout': string;
    'check-certificate': string;
    'check-integrity': string;
    'conditional-get': string;
    'conf-path': string;
    'connect-timeout': string;
    'console-log-level': string;
    'content-disposition-default-utf8': string;
    continue: string;
    daemon: string;
    'deferred-input': string;
    'dht-file-path': string;
    'dht-file-path6': string;
    'dht-listen-port': string;
    'dht-message-timeout': string;
    dir: string;
    'disable-ipv6': string;
    'disk-cache': string;
    'download-result': string;
    'dry-run': string;
    dscp: string;
    'enable-color': string;
    'enable-dht': string;
    'enable-dht6': string;
    'enable-http-keep-alive': string;
    'enable-http-pipelining': string;
    'enable-mmap': string;
    'enable-peer-exchange': string;
    'enable-rpc': string;
    'event-poll': string;
    'file-allocation': string;
    'follow-metalink': string;
    'follow-torrent': string;
    'force-save': string;
    'ftp-pasv': string;
    'ftp-reuse-connection': string;
    'ftp-type': string;
    'hash-check-only': string;
    help: string;
    'http-accept-gzip': string;
    'http-auth-challenge': string;
    'http-no-cache': string;
    'human-readable': string;
    'keep-unfinished-download-result': string;
    'listen-port': string;
    'log-level': string;
    'lowest-speed-limit': string;
    'max-concurrent-downloads': string;
    'max-connection-per-server': string;
    'max-download-limit': string;
    'max-download-result': string;
    'max-file-not-found': string;
    'max-mmap-limit': string;
    'max-overall-download-limit': string;
    'max-overall-upload-limit': string;
    'max-resume-failure-tries': string;
    'max-tries': string;
    'max-upload-limit': string;
    'metalink-enable-unique-protocol': string;
    'metalink-preferred-protocol': string;
    'min-split-size': string;
    'min-tls-version': string;
    'netrc-path': string;
    'no-conf': string;
    'no-file-allocation-limit': string;
    'no-netrc': string;
    'optimize-concurrent-downloads': string;
    'parameterized-uri': string;
    'pause-metadata': string;
    'peer-agent': string;
    'peer-id-prefix': string;
    'piece-length': string;
    'proxy-method': string;
    quiet: string;
    'realtime-chunk-checksum': string;
    'remote-time': string;
    'remove-control-file': string;
    'retry-wait': string;
    'reuse-uri': string;
    'rpc-allow-origin-all': string;
    'rpc-listen-all': string;
    'rpc-listen-port': string;
    'rpc-max-request-size': string;
    'rpc-save-upload-metadata': string;
    'rpc-secure': string;
    'save-not-found': string;
    'save-session-interval': string;
    'seed-ratio': string;
    'server-stat-timeout': string;
    'show-console-readout': string;
    'show-files': string;
    'socket-recv-buffer-size': string;
    split: string;
    stderr: string;
    stop: string;
    'stream-piece-selector': string;
    'summary-interval': string;
    timeout: string;
    'truncate-console-readout': string;
    'uri-selector': string;
    'use-head': string;
    'user-agent': string;
    [key: string]: string | undefined;
}

/**
 * @public
 */
export declare interface GlobalStat {
    /** Overall download speed (byte/sec). */
    downloadSpeed: string;
    /** Overall upload speed(byte/sec). */
    uploadSpeed: string;
    /** The number of active downloads. */
    numActive: string;
    /** The number of waiting downloads. */
    numWaiting: string;
    /** The number of stopped downloads in the current session. This value is capped by the --max-download-result option. */
    numStopped: string;
    /** The number of stopped downloads in the current session and not capped by the --max-download-result option. */
    numStoppedTotal?: string;
}

/**
 * @public
 */
declare interface Option_2 {
    'all-proxy'?: string;
    'all-proxy-passwd'?: string;
    'all-proxy-user'?: string;
    'allow-overwrite'?: string;
    'allow-piece-length-change'?: string;
    'always-resume'?: string;
    'async-dns'?: string;
    'auto-file-renaming'?: string;
    'bt-enable-hook-after-hash-check'?: string;
    'bt-enable-lpd'?: string;
    'bt-exclude-tracker'?: string;
    'bt-external-ip'?: string;
    'bt-force-encryption'?: string;
    'bt-hash-check-seed'?: string;
    'bt-load-saved-metadata'?: string;
    'bt-max-peers'?: string;
    'bt-metadata-only'?: string;
    'bt-min-crypto-level'?: string;
    'bt-prioritize-piece'?: string;
    'bt-remove-unselected-file'?: string;
    'bt-request-peer-speed-limit'?: string;
    'bt-require-crypto'?: string;
    'bt-save-metadata'?: string;
    'bt-seed-unverified'?: string;
    'bt-stop-timeout'?: string;
    'bt-tracker'?: string;
    'bt-tracker-connect-timeout'?: string;
    'bt-tracker-interval'?: string;
    'bt-tracker-timeout'?: string;
    'check-integrity'?: string;
    checksum?: string;
    'conditional-get'?: string;
    'connect-timeout'?: string;
    'content-disposition-default-utf8'?: string;
    continue?: string;
    dir?: string;
    'dry-run'?: string;
    'enable-http-keep-alive'?: string;
    'enable-http-pipelining'?: string;
    'enable-mmap'?: string;
    'enable-peer-exchange'?: string;
    'file-allocation'?: string;
    'follow-metalink'?: string;
    'follow-torrent'?: string;
    'force-save'?: string;
    'ftp-passwd'?: string;
    'ftp-pasv'?: string;
    'ftp-proxy'?: string;
    'ftp-proxy-passwd'?: string;
    'ftp-proxy-user'?: string;
    'ftp-reuse-connection'?: string;
    'ftp-type'?: string;
    'ftp-user'?: string;
    gid?: string;
    'hash-check-only'?: string;
    header?: string;
    'http-accept-gzip'?: string;
    'http-auth-challenge'?: string;
    'http-no-cache'?: string;
    'http-passwd'?: string;
    'http-proxy'?: string;
    'http-proxy-passwd'?: string;
    'http-proxy-user'?: string;
    'http-user'?: string;
    'https-proxy'?: string;
    'https-proxy-passwd'?: string;
    'https-proxy-user'?: string;
    'index-out'?: string;
    'lowest-speed-limit'?: string;
    'max-connection-per-server'?: string;
    'max-download-limit'?: string;
    'max-file-not-found'?: string;
    'max-mmap-limit'?: string;
    'max-resume-failure-tries'?: string;
    'max-tries'?: string;
    'max-upload-limit'?: string;
    'metalink-base-uri'?: string;
    'metalink-enable-unique-protocol'?: string;
    'metalink-language'?: string;
    'metalink-location'?: string;
    'metalink-os'?: string;
    'metalink-preferred-protocol'?: string;
    'metalink-version'?: string;
    'min-split-size'?: string;
    'no-file-allocation-limit'?: string;
    'no-netrc'?: string;
    'no-proxy'?: string;
    out?: string;
    'parameterized-uri'?: string;
    pause?: string;
    'pause-metadata'?: string;
    'piece-length'?: string;
    'proxy-method'?: string;
    'realtime-chunk-checksum'?: string;
    referer?: string;
    'remote-time'?: string;
    'remove-control-file'?: string;
    'retry-wait'?: string;
    'reuse-uri'?: string;
    'rpc-save-upload-metadata'?: string;
    'seed-ratio'?: string;
    'seed-time'?: string;
    'select-file'?: string;
    split?: string;
    'ssh-host-key-md'?: string;
    'stream-piece-selector'?: string;
    timeout?: string;
    'uri-selector'?: string;
    'use-head'?: string;
    'user-agent'?: string;
    [key: string]: string | undefined;
}
export { Option_2 as Option }

/**
 * @public
 */
export declare interface Peer {
    /** Percent-encoded peer ID. */
    peerId: string;
    /** IP address of the peer. */
    ip: string;
    /** Port number of the peer. */
    port: string;
    /**
     * Hexadecimal representation of the download progress of the peer.
     * The highest bit corresponds to the piece at index 0.
     * Set bits indicate the piece is available and unset bits indicate the piece is missing.
     * Any spare bits at the end are set to zero.
     */
    bitfield: string;
    /** `true` if aria2 is choking the peer. Otherwise `false`. */
    amChoking: string;
    /** `true` if the peer is choking aria2. Otherwise `false`. */
    peerChoking: string;
    /** Download speed (byte/sec) that this client obtains from the peer. */
    downloadSpeed: string;
    /** Upload speed(byte/sec) that this client uploads to the peer. */
    uploadSpeed: string;
    /** `true` if this peer is a seeder. Otherwise `false`. */
    seeder: string;
}

/**
 * @public
 */
export declare interface RPCMultiRequest<T = any[]> {
    methodName: string;
    params: T;
}

/**
 * @public
 */
export declare interface RPCRequest<T = any[]> {
    jsonrpc: string;
    id: string;
    method: string;
    params: T;
}

/**
 * @public
 */
export declare interface RPCResponse<T = any> {
    jsonrpc: string;
    id?: string;
    result?: T;
    method?: string;
    error?: {
        code: number;
        message: string;
    };
}

/**
 * @public
 */
export declare function run(options?: RunOption): import('child_process').ChildProcess;

/**
 * @public
 */
export declare interface RunOption {
    path?: string;
    args?: string[];
    stdio?: import('child_process').StdioOptions;
}

/**
 * @public
 */
export declare interface Server {
    /** Original URI. */
    uri: string;
    /** This is the URI currently used for downloading. If redirection is involved, currentUri and uri may differ. */
    currentUri: string;
    /** Download speed (byte/sec) */
    downloadSpeed: string;
}

/**
 * @public
 */
export declare interface ServerInfo {
    /** Index of the file, starting at 1, in the same order as files appear in the multi-file metalink. */
    index: string;
    /** A list of structs which contain the following keys. */
    servers: Server[];
}

/**
 * @public
 */
export declare interface Session {
    sessionId: string;
}

/**
 * @public
 */
export declare class SimpleWebSocket extends EventEmitter {
    private readonly _socket;
    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSING: number;
    static readonly CLOSED: number;
    get readyState(): number;
    constructor(url: string, protocols?: string | string[]);
    on(event: 'close', listener: (this: SimpleWebSocket, code: number, reason: string) => void): this;
    on(event: 'error', listener: (this: SimpleWebSocket, err: Error) => void): this;
    on(event: 'message', listener: (this: SimpleWebSocket, data: any) => void): this;
    on(event: 'open', listener: (this: SimpleWebSocket) => void): this;
    on(event: string | symbol, listener: (this: SimpleWebSocket, ...args: any[]) => void): this;
    once(event: 'close', listener: (this: SimpleWebSocket, code: number, reason: string) => void): this;
    once(event: 'error', listener: (this: SimpleWebSocket, err: Error) => void): this;
    once(event: 'message', listener: (this: SimpleWebSocket, data: any) => void): this;
    once(event: 'open', listener: (this: SimpleWebSocket) => void): this;
    once(event: string | symbol, listener: (this: SimpleWebSocket, ...args: any[]) => void): this;
    send(data: any, cb?: (err?: Error) => void): void;
    close(code?: number, reason?: string): void;
}

/**
 * @public
 */
export declare interface Status {
    /** GID of the download. */
    gid: string;
    /**
     * `active` for currently downloading/seeding downloads.
     * `waiting` for downloads in the queue; download is not started.
     * `paused` for paused downloads.
     * `error` for downloads that were stopped because of error.
     * `complete` for stopped and completed downloads.
     * `removed` for the downloads removed by user.
     */
    status: string;
    /** Total length of the download in bytes. */
    totalLength: string;
    /** Completed length of the download in bytes. */
    completedLength: string;
    /** Uploaded length of the download in bytes. */
    uploadLength: string;
    /**
     * Hexadecimal representation of the download progress.
     * The highest bit corresponds to the piece at index 0.
     * Any set bits indicate loaded pieces, while unset bits indicate not yet loaded and/or missing pieces.
     * Any overflow bits at the end are set to zero.
     * When the download was not started yet, this key will not be included in the response.
     */
    bitfield: string;
    /** Download speed of this download measured in bytes/sec. */
    downloadSpeed: string;
    /** Upload speed of this download measured in bytes/sec. */
    uploadSpeed: string;
    /** InfoHash. BitTorrent only. */
    infoHash?: string;
    /** The number of seeders aria2 has connected to. BitTorrent only. */
    numSeeders?: string;
    /** `true` if the local endpoint is a seeder. Otherwise `false`. BitTorrent only. */
    seeder?: string;
    /** Piece length in bytes. */
    pieceLength: string;
    /** The number of pieces. */
    numPieces: string;
    /** The number of peers/servers aria2 has connected to. */
    connections: string;
    /**
     * The code of the last error for this item, if any.
     * The value is a string. The error codes are defined in the EXIT STATUS section.
     * This value is only available for stopped/completed downloads.
     */
    errorCode?: string;
    /** The (hopefully) human readable error message associated to `errorCode`. */
    errorMessage?: string;
    /**
     * List of GIDs which are generated as the result of this download.
     * For example, when aria2 downloads a Metalink file,
     * it generates downloads described in the Metalink (see the `--follow-metalink option`).
     * This value is useful to track auto-generated downloads.
     * If there are no such downloads, this key will not be included in the response.
     */
    followedBy?: string;
    /** The reverse link for `followedBy`. A download included in `followedBy` has this object's GID in its `following` value. */
    following?: string;
    /**
     * GID of a parent download. Some downloads are a part of another download.
     * For example, if a file in a Metalink has BitTorrent resources,
     * the downloads of ".torrent" files are parts of that parent.
     * If this download has no parent, this key will not be included in the response. */
    belongsTo?: string;
    /** Directory to save files. */
    dir: string;
    /** Returns the list of files. The elements of this list are the same structs used in `aria2.getFiles()` method. */
    files: File_2[];
    /** Struct which contains information retrieved from the .torrent (file). BitTorrent only. It contains following keys. */
    bittorrent?: {
        /** List of lists of announce URIs. If the torrent contains `announce` and no `announce-list`, `announce` is converted to the `announce-list` format. */
        announceList: string[][];
        /** The comment of the torrent. `comment.utf-8` is used if available. */
        comment?: string;
        /** The creation time of the torrent. The value is an integer since the epoch, measured in seconds. */
        creationDate?: number;
        /** File mode of the torrent. The value is either `single` or `multi`. */
        mode?: string;
        /** Struct which contains data from Info dictionary. It contains following keys. */
        info?: {
            /** name in info dictionary. `name.utf-8` is used if available. */
            name: string;
        };
    };
    /** The number of verified number of bytes while the files are being hash checked. This key exists only when this download is being hash checked. */
    verifiedLength?: string;
    /** `true` if this download is waiting for the hash check in a queue. This key exists only when this download is in the queue. */
    verifyIntegrityPending?: string;
}

/**
 * @public
 */
export declare interface Uri {
    /** URI */
    uri: string;
    /** 'used' if the URI is in use. 'waiting' if the URI is still waiting in the queue. */
    status: string;
}

/**
 * @public
 */
export declare interface VersionInfo {
    enabledFeatures: string[];
    version: string;
}

declare interface WrappedFunction extends Function {
    listener: Function;
}

export { }

export as namespace aria2
