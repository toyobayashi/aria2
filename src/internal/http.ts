import { Aria2ClientConstructOption } from '../Aria2Client'
import { nativeRequire } from '@tybys/native-require'

export async function post <T = any> (options: Required<Aria2ClientConstructOption>, data: any): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    const url = `http${options.secure ? 's' : ''}://${options.host}:${options.port}${options.path}`
    if (typeof window === 'undefined') {
      if (nativeRequire == null) {
        reject(new ReferenceError('require is not defined.'))
        return
      }
      const http: typeof import('http') = nativeRequire('http')
      const https: typeof import('http') = nativeRequire('https')
      let got: typeof import('got') | undefined
      try {
        got = nativeRequire('got')
      } catch {}

      if (got !== undefined) {
        got.post(url, {
          json: true,
          body: data,
          retry: 0
        }).then((r) => {
          resolve(r.body)
        }).catch(reject)
      } else {
        const client = options.secure ? https : http
        const req = client.request({
          host: options.host,
          port: options.port,
          protocol: options.secure ? 'https:' : 'http:',
          path: options.path,
          method: 'POST'
        }, (res) => {
          let responseString = ''
          res.on('data', (chunk: any) => {
            responseString += chunk.toString() as string
          })

          res.on('error', reject)
          res.on('end', () => {
            try {
              resolve(JSON.parse(responseString))
            } catch (err) {
              reject(err)
            }
          })
        })

        req.on('error', reject)
        req.on('abort', () => reject(new Error('HTTP request abort.')))

        req.setHeader('Content-Type', 'application/json')
        req.end(JSON.stringify(data), 'utf8')
      }
    } else {
      window.fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => {
        resolve(res.json())
      }).catch(reject)
    }
  })
}
