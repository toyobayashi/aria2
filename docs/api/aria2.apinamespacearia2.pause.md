<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [ApiNamespaceAria2](./aria2.apinamespacearia2.md) &gt; [pause](./aria2.apinamespacearia2.pause.md)

## ApiNamespaceAria2.pause() method

This method pauses the download denoted by gid (string). The status of paused download becomes `paused`<!-- -->. If the download was active, the download is placed in the front of waiting queue. While the status is `paused`<!-- -->, the download is not started. To change status to waiting, use the `aria2.unpause()` method. This method returns GID of paused download.

<b>Signature:</b>

```typescript
pause(gid: string): Promise<string>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  gid | string | GID |

<b>Returns:</b>

Promise&lt;string&gt;

GID of paused download
