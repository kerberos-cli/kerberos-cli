import { spawn as cpSpawn, exec, SpawnOptions, ExecOptions } from 'child_process'

export async function spawn(cli: string, params: string[] = [], options: SpawnOptions = {}, stdout?: (data: string, type: 'out' | 'err') => void): Promise<number> {
  return new Promise((resolve, reject) => {
    let cp = cpSpawn(cli, params, { stdio: 'inherit', ...options })

    if (typeof stdout === 'function') {
      cp.stdout.on('data', data => stdout(data, 'out'))
      cp.stderr.on('data', data => stdout(data, 'err'))
    }

    let handleProcessSigint = process.exit.bind(process)
    let handleProcessExit = () => {
      cp && cp.kill('SIGINT')
      process.removeListener('exit', handleProcessExit)
      process.removeListener('SIGINT', handleProcessSigint)

      cp = undefined
      handleProcessExit = undefined
      handleProcessSigint = undefined
    }

    cp.on('exit', code => resolve(code))
    cp.on('SIGINT', () => reject(new Error('Process has been killed')))

    process.on('exit', handleProcessExit)
    process.on('SIGINT', handleProcessSigint)
  })
}

export async function getStdout(command: string, options: ExecOptions = {}, stdoutFn?: (data: string, type: 'out' | 'err') => void): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        if (typeof stdoutFn === 'function') {
          stdoutFn(stderr, 'err')
        }

        reject(error)
        return
      }

      if (typeof stdoutFn === 'function') {
        stdoutFn(stdout, 'out')
      }

      resolve(stdout.toString())
    })
  })
}
