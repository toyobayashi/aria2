/* async function sleep (ms: number): Promise<void> {
  return await new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
} */

(async function main (/* argc: number, argv: string[] */) {
  let _aria2: typeof aria2
  if (typeof window === 'undefined') {
    _aria2 = require('../../lib/cjs/index.js')
    _aria2.run()
  } else {
    _aria2 = (window as any).aria2
  }
  const Aria2Client = _aria2.Aria2Client
  const client = new Aria2Client()
  // client.on('message', (data) => console.log(data))
  client.once(Aria2Client.EVENT_OPEN, () => console.log('EVENT_OPEN'))
  client.on(Aria2Client.EVENT_ERROR, (err) => { console.log('EVENT_ERROR'); console.error(err) })
  client.on(Aria2Client.EVENT_CLOSE, () => console.log('EVENT_CLOSE'))
  await client.connect()
  client.aria2.on('download-start', (data) => {
    console.log('on aria2.onDownloadStart:')
    console.log(data)
  })
  client.aria2.on('download-pause', (data) => {
    console.log('on aria2.onDownloadPause:')
    console.log(data)
  })
  client.aria2.on('download-stop', (data) => {
    console.log('on aria2.onDownloadStop:')
    console.log(data)
  })
  client.aria2.on('download-error', (data) => {
    console.log('on aria2.onDownloadError:')
    console.log(data)
  })
  client.aria2.on('download-complete', (data) => {
    console.log('on aria2.onDownloadComplete:')
    console.log(data)
  })
  client.aria2.on('bt-download-complete', (data) => {
    console.log('on aria2.onBtDownloadComplete:')
    console.log(data)
  })
  // const globalOption = await client.aria2.getGlobalOption()
  // const methods = await client.system.listNotifications()
  // console.log(methods)
  // await client.aria2.forceShutdown()
  console.log(await client.system.hasMethod('multicall'))
  const res = await client.system.multicall([new Aria2Client.MulticallParam('system.listMethods', []), new Aria2Client.MulticallParam('system.listNotifications', [])])
  const res2 = await client.system.multicall([
    client.createRequestParam('system.listMethods'),
    client.createRequestParam('system.listNotifications')
  ])
  console.log(res)
  console.log(res2)
  const s = await client.aria2.shutdown()
  console.log(s)

  // const gid = await client.aria2.addUri(['https://npm.taobao.org/mirrors/node/v12.16.2/node-v12.16.2-win-x64.zip'], { dir: __dirname })
  // console.log(await client.aria2.getOption(gid))

  // while (true) {
  //   await sleep(200)
  //   const status = await client.aria2.tellStatus(gid)
  //   console.log(status)
  //   if (status.completedLength === status.totalLength && status.totalLength !== '0') {
  //     break
  //   }
  // }
  // console.log(globalOption)
})(/* process.argv.length, process.argv */).catch(err => console.error(err))
