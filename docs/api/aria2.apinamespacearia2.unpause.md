<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [ApiNamespaceAria2](./aria2.apinamespacearia2.md) &gt; [unpause](./aria2.apinamespacearia2.unpause.md)

## ApiNamespaceAria2.unpause() method

This method changes the status of the download denoted by gid (string) from `paused` to `waiting`<!-- -->, making the download eligible to be restarted. This method returns the GID of the unpaused download.

<b>Signature:</b>

```typescript
unpause(gid: string): Promise<string>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  gid | string | GID |

<b>Returns:</b>

Promise&lt;string&gt;

GID of unpaused download

