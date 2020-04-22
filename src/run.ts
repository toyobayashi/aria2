import { nodeRequire } from './internal/require'

function which (cmd: string): string {
  const PATH = process.platform === 'win32' ? process.env.Path : process.env.PATH
  const pathList = process.platform === 'win32' ? PATH?.split(';') : PATH?.split(':')
  if (pathList === undefined || pathList.length === 0) return ''
  const path: typeof import('path') = nodeRequire('path')
  const fs: typeof import('fs') = nodeRequire('fs')

  const PATHEXT = process.platform === 'win32' ? (process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.RB;.RBW') : ''
  const extlist = process.platform === 'win32' ? PATHEXT.split(';').map(v => v.toLowerCase()) : ['', '.sh']
  for (let i = 0; i < pathList.length; i++) {
    const p = pathList[i]
    for (let j = 0; j < extlist.length; j++) {
      const target = path.extname(cmd) === '' ? path.join(p, cmd + extlist[j]) : path.join(p, cmd)
      if (fs.existsSync(target)) {
        if (process.platform === 'win32') {
          return target
        }
        try {
          fs.accessSync(target, fs.constants.X_OK)
          return target
        } catch {}
      }
    }
  }

  return ''
}

/**
 * @public
 */
export interface RunOption {
  path?: string
  args?: string[]
  stdio?: import('child_process').StdioOptions
}

/**
 * @public
 */
export function run (options?: RunOption): import('child_process').ChildProcess {
  if (typeof global === 'undefined' && typeof window !== 'undefined') throw new Error('Can not call run() in browser.')
  const cmd = options?.path ?? which('aria2c')
  if (cmd === '') throw new Error('Can not find aria2.')
  const { spawn } = nodeRequire('child_process') as typeof import('child_process')
  const args = options?.args ?? ['--enable-rpc', '--rpc-listen-all=true', '--rpc-allow-origin-all']
  const stdio = options?.stdio ?? 'ignore'
  return spawn(cmd, args, { stdio })
}
