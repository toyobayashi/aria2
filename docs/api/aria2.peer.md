<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [Peer](./aria2.peer.md)

## Peer interface


<b>Signature:</b>

```typescript
export interface Peer 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [amChoking](./aria2.peer.amchoking.md) | string | <code>true</code> if aria2 is choking the peer. Otherwise <code>false</code>. |
|  [bitfield](./aria2.peer.bitfield.md) | string | Hexadecimal representation of the download progress of the peer. The highest bit corresponds to the piece at index 0. Set bits indicate the piece is available and unset bits indicate the piece is missing. Any spare bits at the end are set to zero. |
|  [downloadSpeed](./aria2.peer.downloadspeed.md) | string | Download speed (byte/sec) that this client obtains from the peer. |
|  [ip](./aria2.peer.ip.md) | string | IP address of the peer. |
|  [peerChoking](./aria2.peer.peerchoking.md) | string | <code>true</code> if the peer is choking aria2. Otherwise <code>false</code>. |
|  [peerId](./aria2.peer.peerid.md) | string | Percent-encoded peer ID. |
|  [port](./aria2.peer.port.md) | string | Port number of the peer. |
|  [seeder](./aria2.peer.seeder.md) | string | <code>true</code> if this peer is a seeder. Otherwise <code>false</code>. |
|  [uploadSpeed](./aria2.peer.uploadspeed.md) | string | Upload speed(byte/sec) that this client uploads to the peer. |
