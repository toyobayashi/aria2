<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [EventEmitter](./aria2.eventemitter.md) &gt; [on](./aria2.eventemitter.on.md)

## EventEmitter.on() method

Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.

<b>Signature:</b>

```typescript
on(eventName: string | symbol, listener: Function | WrappedFunction): this;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  eventName | string \| symbol |  |
|  listener | Function \| [WrappedFunction](./aria2.wrappedfunction.md) |  |

<b>Returns:</b>

this
