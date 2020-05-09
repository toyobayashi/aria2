<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [ApiNamespaceAria2](./aria2.apinamespacearia2.md) &gt; [changePosition](./aria2.apinamespacearia2.changeposition.md)

## ApiNamespaceAria2.changePosition() method

This method changes the position of the download denoted by gid in the queue. pos is an integer. how is a string. If how is POS\_SET, it moves the download to a position relative to the beginning of the queue. If how is POS\_CUR, it moves the download to a position relative to the current position. If how is POS\_END, it moves the download to a position relative to the end of the queue. If the destination position is less than 0 or beyond the end of the queue, it moves the download to the beginning or the end of the queue respectively. The response is an integer denoting the resulting position.

<b>Signature:</b>

```typescript
changePosition(gid: string, pos: number, how: Aria2Client.Position): Promise<number>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  gid | string | GID |
|  pos | number | position |
|  how | Aria2Client.Position | POS\_SET \| POS\_CUR \| POS\_END |

<b>Returns:</b>

Promise&lt;number&gt;

an integer denoting the resulting position.
