<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [ApiNamespaceAria2](./aria2.apinamespacearia2.md) &gt; [addTorrent](./aria2.apinamespacearia2.addtorrent.md)

## ApiNamespaceAria2.addTorrent() method

This method adds a BitTorrent download by uploading a ".torrent" file. If you want to add a BitTorrent Magnet URI, use the `aria2.addUri()` method instead. torrent must be a base64-encoded string containing the contents of the ".torrent" file. uris is an array of URIs (string). uris is used for Web-seeding. For single file torrents, the URI can be a complete URI pointing to the resource; if URI ends with /, name in torrent file is added. For multi-file torrents, name and path in torrent are added to form a URI for each file. options is a struct and its members are pairs of option name and value. See Options below for more details. If position is given, it must be an integer starting from 0. The new download will be inserted at position in the waiting queue. If position is omitted or position is larger than the current size of the queue, the new download is appended to the end of the queue. This method returns the GID of the newly registered download. If `--rpc-save-upload-metadata` is `true`<!-- -->, the uploaded data is saved as a file named as the hex string of SHA-1 hash of data plus ".torrent" in the directory specified by `--dir` option. E.g. a file name might be `0a3893293e27ac0490424c06de4d09242215f0a6.torrent`<!-- -->. If a file with the same name already exists, it is overwritten! If the file cannot be saved successfully or `--rpc-save-upload-metadata` is `false`<!-- -->, the downloads added by this method are not saved by `--save-session`<!-- -->.

<b>Signature:</b>

```typescript
addTorrent(torrent: string, uris?: string[], options?: Aria2Option, position?: number): Promise<string>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  torrent | string | a base64-encoded string containing the contents of the ".torrent" file |
|  uris | string\[\] | an array of URIs (string) |
|  options | [Aria2Option](./aria2.aria2option.md) | struct and its members are pairs of option name and value |
|  position | number | an integer starting from 0 |

<b>Returns:</b>

Promise&lt;string&gt;

the GID of the newly registered download

