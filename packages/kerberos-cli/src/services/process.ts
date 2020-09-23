import { EventEmitter } from 'events'
import { spawn as cpSpawn, exec, SpawnOptions, ExecOptions } from 'child_process'
import Queue from '../libs/Queue'

const EXIT_TOKEN = 'processExit'
const eventEmitter = new EventEmitter()
const processes = []

const handleProcessSigint = process.exit.bind(process)
const handleProcessExit = () => {
  eventEmitter.emit(EXIT_TOKEN)
  eventEmitter.removeAllListeners()

  process.removeListener('exit', handleProcessExit)
  process.removeListener('SIGINT', handleProcessSigint)
}

process.on('exit', handleProcessExit)
process.on('SIGINT', handleProcessSigint)

/**
 * 程序退出事件
 */
export function onexit(handle: (...args: any[]) => void) {
  eventEmitter.on(EXIT_TOKEN, handle)
}

/**
 * spawn promisify
 * @param cli 命令
 * @param params 参数
 * @param options SpawnOptions
 * @param stdoutFn 输出配置
 * @param killToken 关闭 token
 */
export function spawn(cli: string, params?: Array<string>, options?: SpawnOptions, stdoutFn?: (data: string, type: 'out' | 'err') => void, killToken?: symbol): Promise<any> {
  return new Promise((resolve, reject) => {
    let cp = cpSpawn(cli, params || [], { stdio: 'inherit', ...options })

    if (typeof stdoutFn === 'function') {
      cp.stdout.on('data', (data) => stdoutFn(data, 'out'))
      cp.stderr.on('data', (data) => stdoutFn(data, 'err'))
    }

    cp.on('exit', (code) => resolve(code))
    cp.on('SIGINT', () => reject(new Error('Process has been killed')))

    const kill = () => {
      cp && cp.kill('SIGINT')
      cp = undefined
    }

    onexit(kill)

    killToken && processes.push({ token: killToken, kill })
  })
}

/**
 * kill spawn process
 * @param killToken 关闭 token
 */
export function kill(killToken?: symbol): void {
  const index = processes.findIndex((item) => item.killToken === killToken)
  if (-1 === index) {
    const process = processes.splice(index, 1).pop()
    process.kill()
  }
}

/**
 * 获取输出信息
 * @param command 执行的命令
 * @param options 执行配置
 * @param stdoutFn 输出配置
 */
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

/**
 * 创建一个队列化执行的 spawn
 */
export function createPipeSpawn(): typeof spawn {
  const spawnQueue = new Queue()
  return spawnQueue.pipefy(spawn)
}
