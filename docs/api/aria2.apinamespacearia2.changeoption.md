<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [ApiNamespaceAria2](./aria2.apinamespacearia2.md) &gt; [changeOption](./aria2.apinamespacearia2.changeoption.md)

## ApiNamespaceAria2.changeOption() method

This method changes options of the download denoted by gid (string) dynamically. options is a struct. This method returns OK for success.

<b>Signature:</b>

```typescript
changeOption(gid: string, options: Omit<Aria2Option, 'dry-run' | 'metalink-base-uri' | 'parameterized-uri' | 'pause' | 'piece-length' | 'rpc-save-upload-metadata'>): Promise<'OK'>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  gid | string | GID |
|  options | Omit&lt;[Aria2Option](./aria2.aria2option.md)<!-- -->, 'dry-run' \| 'metalink-base-uri' \| 'parameterized-uri' \| 'pause' \| 'piece-length' \| 'rpc-save-upload-metadata'&gt; | struct |

<b>Returns:</b>

Promise&lt;'OK'&gt;

string 'OK'
