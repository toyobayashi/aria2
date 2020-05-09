<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [Status](./aria2.status.md) &gt; [bittorrent](./aria2.status.bittorrent.md)

## Status.bittorrent property

Struct which contains information retrieved from the .torrent (file). BitTorrent only. It contains following keys.

<b>Signature:</b>

```typescript
bittorrent?: {
        announceList: string[][];
        comment?: string;
        creationDate?: number;
        mode?: string;
        info?: {
            name: string;
        };
    };
```