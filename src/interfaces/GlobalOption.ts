/**
 * @public
 */
export interface GlobalOption {
  'allow-overwrite': string
  'allow-piece-length-change': string
  'always-resume': string
  'async-dns': string
  'auto-file-renaming': string
  'auto-save-interval': string
  'bt-detach-seed-only': string
  'bt-enable-hook-after-hash-check': string
  'bt-enable-lpd': string
  'bt-force-encryption': string
  'bt-hash-check-seed': string
  'bt-load-saved-metadata': string
  'bt-max-open-files': string
  'bt-max-peers': string
  'bt-metadata-only': string
  'bt-min-crypto-level': string
  'bt-remove-unselected-file': string
  'bt-request-peer-speed-limit': string
  'bt-require-crypto': string
  'bt-save-metadata': string
  'bt-seed-unverified': string
  'bt-stop-timeout': string
  'bt-tracker-connect-timeout': string
  'bt-tracker-interval': string
  'bt-tracker-timeout': string
  'check-certificate': string
  'check-integrity': string
  'conditional-get': string
  'conf-path': string
  'connect-timeout': string
  'console-log-level': string
  'content-disposition-default-utf8': string
  continue: string
  daemon: string
  'deferred-input': string
  'dht-file-path': string
  'dht-file-path6': string
  'dht-listen-port': string
  'dht-message-timeout': string
  dir: string
  'disable-ipv6': string
  'disk-cache': string
  'download-result': string
  'dry-run': string
  dscp: string
  'enable-color': string
  'enable-dht': string
  'enable-dht6': string
  'enable-http-keep-alive': string
  'enable-http-pipelining': string
  'enable-mmap': string
  'enable-peer-exchange': string
  'enable-rpc': string
  'event-poll': string
  'file-allocation': string
  'follow-metalink': string
  'follow-torrent': string
  'force-save': string
  'ftp-pasv': string
  'ftp-reuse-connection': string
  'ftp-type': string
  'hash-check-only': string
  help: string
  'http-accept-gzip': string
  'http-auth-challenge': string
  'http-no-cache': string
  'human-readable': string
  'keep-unfinished-download-result': string
  'listen-port': string
  'log-level': string
  'lowest-speed-limit': string
  'max-concurrent-downloads': string
  'max-connection-per-server': string
  'max-download-limit': string
  'max-download-result': string
  'max-file-not-found': string
  'max-mmap-limit': string
  'max-overall-download-limit': string
  'max-overall-upload-limit': string
  'max-resume-failure-tries': string
  'max-tries': string
  'max-upload-limit': string
  'metalink-enable-unique-protocol': string
  'metalink-preferred-protocol': string
  'min-split-size': string
  'min-tls-version': string
  'netrc-path': string
  'no-conf': string
  'no-file-allocation-limit': string
  'no-netrc': string
  'optimize-concurrent-downloads': string
  'parameterized-uri': string
  'pause-metadata': string
  'peer-agent': string
  'peer-id-prefix': string
  'piece-length': string
  'proxy-method': string
  quiet: string
  'realtime-chunk-checksum': string
  'remote-time': string
  'remove-control-file': string
  'retry-wait': string
  'reuse-uri': string
  'rpc-allow-origin-all': string
  'rpc-listen-all': string
  'rpc-listen-port': string
  'rpc-max-request-size': string
  'rpc-save-upload-metadata': string
  'rpc-secure': string
  'save-not-found': string
  'save-session-interval': string
  'seed-ratio': string
  'server-stat-timeout': string
  'show-console-readout': string
  'show-files': string
  'socket-recv-buffer-size': string
  split: string
  stderr: string
  stop: string
  'stream-piece-selector': string
  'summary-interval': string
  timeout: string
  'truncate-console-readout': string
  'uri-selector': string
  'use-head': string
  'user-agent': string
  [key: string]: string | undefined
}
