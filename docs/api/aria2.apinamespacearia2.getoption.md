<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [ApiNamespaceAria2](./aria2.apinamespacearia2.md) &gt; [getOption](./aria2.apinamespacearia2.getoption.md)

## ApiNamespaceAria2.getOption() method

This method returns options of the download denoted by gid. The response is a struct where keys are the names of options. The values are strings. Note that this method does not return options which have no default value and have not been set on the command-line, in configuration files or RPC methods.

<b>Signature:</b>

```typescript
getOption(gid: string): Promise<GlobalOption>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  gid | string | GID |

<b>Returns:</b>

Promise&lt;[GlobalOption](./aria2.globaloption.md)<!-- -->&gt;
