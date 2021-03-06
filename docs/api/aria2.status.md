<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [Status](./aria2.status.md)

## Status interface


<b>Signature:</b>

```typescript
export interface Status 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [belongsTo](./aria2.status.belongsto.md) | string | GID of a parent download. Some downloads are a part of another download. For example, if a file in a Metalink has BitTorrent resources, the downloads of ".torrent" files are parts of that parent. If this download has no parent, this key will not be included in the response. |
|  [bitfield](./aria2.status.bitfield.md) | string | Hexadecimal representation of the download progress. The highest bit corresponds to the piece at index 0. Any set bits indicate loaded pieces, while unset bits indicate not yet loaded and/or missing pieces. Any overflow bits at the end are set to zero. When the download was not started yet, this key will not be included in the response. |
|  [bittorrent](./aria2.status.bittorrent.md) | { announceList: string\[\]\[\]; comment?: string; creationDate?: number; mode?: string; info?: { name: string; }; } | Struct which contains information retrieved from the .torrent (file). BitTorrent only. It contains following keys. |
|  [completedLength](./aria2.status.completedlength.md) | string | Completed length of the download in bytes. |
|  [connections](./aria2.status.connections.md) | string | The number of peers/servers aria2 has connected to. |
|  [dir](./aria2.status.dir.md) | string | Directory to save files. |
|  [downloadSpeed](./aria2.status.downloadspeed.md) | string | Download speed of this download measured in bytes/sec. |
|  [errorCode](./aria2.status.errorcode.md) | string | The code of the last error for this item, if any. The value is a string. The error codes are defined in the EXIT STATUS section. This value is only available for stopped/completed downloads. |
|  [errorMessage](./aria2.status.errormessage.md) | string | The (hopefully) human readable error message associated to <code>errorCode</code>. |
|  [files](./aria2.status.files.md) | [FileInfo](./aria2.fileinfo.md)<!-- -->\[\] | Returns the list of files. The elements of this list are the same structs used in <code>aria2.getFiles()</code> method. |
|  [followedBy](./aria2.status.followedby.md) | string | List of GIDs which are generated as the result of this download. For example, when aria2 downloads a Metalink file, it generates downloads described in the Metalink (see the <code>--follow-metalink option</code>). This value is useful to track auto-generated downloads. If there are no such downloads, this key will not be included in the response. |
|  [following](./aria2.status.following.md) | string | The reverse link for <code>followedBy</code>. A download included in <code>followedBy</code> has this object's GID in its <code>following</code> value. |
|  [gid](./aria2.status.gid.md) | string | GID of the download. |
|  [infoHash](./aria2.status.infohash.md) | string | InfoHash. BitTorrent only. |
|  [numPieces](./aria2.status.numpieces.md) | string | The number of pieces. |
|  [numSeeders](./aria2.status.numseeders.md) | string | The number of seeders aria2 has connected to. BitTorrent only. |
|  [pieceLength](./aria2.status.piecelength.md) | string | Piece length in bytes. |
|  [seeder](./aria2.status.seeder.md) | string | <code>true</code> if the local endpoint is a seeder. Otherwise <code>false</code>. BitTorrent only. |
|  [status](./aria2.status.status.md) | string | <code>active</code> for currently downloading/seeding downloads. <code>waiting</code> for downloads in the queue; download is not started. <code>paused</code> for paused downloads. <code>error</code> for downloads that were stopped because of error. <code>complete</code> for stopped and completed downloads. <code>removed</code> for the downloads removed by user. |
|  [totalLength](./aria2.status.totallength.md) | string | Total length of the download in bytes. |
|  [uploadLength](./aria2.status.uploadlength.md) | string | Uploaded length of the download in bytes. |
|  [uploadSpeed](./aria2.status.uploadspeed.md) | string | Upload speed of this download measured in bytes/sec. |
|  [verifiedLength](./aria2.status.verifiedlength.md) | string | The number of verified number of bytes while the files are being hash checked. This key exists only when this download is being hash checked. |
|  [verifyIntegrityPending](./aria2.status.verifyintegritypending.md) | string | <code>true</code> if this download is waiting for the hash check in a queue. This key exists only when this download is in the queue. |

