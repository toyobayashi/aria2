<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tybys/aria2](./aria2.md) &gt; [Status](./aria2.status.md) &gt; [followedBy](./aria2.status.followedby.md)

## Status.followedBy property

List of GIDs which are generated as the result of this download. For example, when aria2 downloads a Metalink file, it generates downloads described in the Metalink (see the `--follow-metalink option`<!-- -->). This value is useful to track auto-generated downloads. If there are no such downloads, this key will not be included in the response.

<b>Signature:</b>

```typescript
followedBy?: string;
```
