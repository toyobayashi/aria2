import { File } from './File'

/**
 * @public
 */
export interface Status {
  /** GID of the download. */
  gid: string
  /**
   * `active` for currently downloading/seeding downloads.
   * `waiting` for downloads in the queue; download is not started.
   * `paused` for paused downloads.
   * `error` for downloads that were stopped because of error.
   * `complete` for stopped and completed downloads.
   * `removed` for the downloads removed by user.
   */
  status: string
  /** Total length of the download in bytes. */
  totalLength: string
  /** Completed length of the download in bytes. */
  completedLength: string
  /** Uploaded length of the download in bytes. */
  uploadLength: string
  /**
   * Hexadecimal representation of the download progress.
   * The highest bit corresponds to the piece at index 0.
   * Any set bits indicate loaded pieces, while unset bits indicate not yet loaded and/or missing pieces.
   * Any overflow bits at the end are set to zero.
   * When the download was not started yet, this key will not be included in the response.
   */
  bitfield: string
  /** Download speed of this download measured in bytes/sec. */
  downloadSpeed: string
  /** Upload speed of this download measured in bytes/sec. */
  uploadSpeed: string
  /** InfoHash. BitTorrent only. */
  infoHash?: string
  /** The number of seeders aria2 has connected to. BitTorrent only. */
  numSeeders?: string
  /** `true` if the local endpoint is a seeder. Otherwise `false`. BitTorrent only. */
  seeder?: string
  /** Piece length in bytes. */
  pieceLength: string
  /** The number of pieces. */
  numPieces: string
  /** The number of peers/servers aria2 has connected to. */
  connections: string
  /**
   * The code of the last error for this item, if any.
   * The value is a string. The error codes are defined in the EXIT STATUS section.
   * This value is only available for stopped/completed downloads.
   */
  errorCode?: string
  /** The (hopefully) human readable error message associated to `errorCode`. */
  errorMessage?: string

  /**
   * List of GIDs which are generated as the result of this download.
   * For example, when aria2 downloads a Metalink file,
   * it generates downloads described in the Metalink (see the `--follow-metalink option`).
   * This value is useful to track auto-generated downloads.
   * If there are no such downloads, this key will not be included in the response.
   */
  followedBy?: string
  /** The reverse link for `followedBy`. A download included in `followedBy` has this object's GID in its `following` value. */
  following?: string
  /**
   * GID of a parent download. Some downloads are a part of another download.
   * For example, if a file in a Metalink has BitTorrent resources,
   * the downloads of ".torrent" files are parts of that parent.
   * If this download has no parent, this key will not be included in the response. */
  belongsTo?: string

  /** Directory to save files. */
  dir: string
  /** Returns the list of files. The elements of this list are the same structs used in `aria2.getFiles()` method. */
  files: File[]

  /** Struct which contains information retrieved from the .torrent (file). BitTorrent only. It contains following keys. */
  bittorrent?: {
    /** List of lists of announce URIs. If the torrent contains `announce` and no `announce-list`, `announce` is converted to the `announce-list` format. */
    announceList: string[][]
    /** The comment of the torrent. `comment.utf-8` is used if available. */
    comment?: string
    /** The creation time of the torrent. The value is an integer since the epoch, measured in seconds. */
    creationDate?: number
    /** File mode of the torrent. The value is either `single` or `multi`. */
    mode?: string
    /** Struct which contains data from Info dictionary. It contains following keys. */
    info?: {
      /** name in info dictionary. `name.utf-8` is used if available. */
      name: string
    }
  }

  /** The number of verified number of bytes while the files are being hash checked. This key exists only when this download is being hash checked. */
  verifiedLength?: string
  /** `true` if this download is waiting for the hash check in a queue. This key exists only when this download is in the queue. */
  verifyIntegrityPending?: string
}
