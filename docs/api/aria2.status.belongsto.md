<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [Status](./aria2.status.md) &gt; [belongsTo](./aria2.status.belongsto.md)

## Status.belongsTo property

GID of a parent download. Some downloads are a part of another download. For example, if a file in a Metalink has BitTorrent resources, the downloads of ".torrent" files are parts of that parent. If this download has no parent, this key will not be included in the response.

<b>Signature:</b>

```typescript
belongsTo?: string;
```
