import chalk from 'chalk'
import PrettyError from 'pretty-error'

function pretty(info: string | Error, verbose?: boolean) {
  const reason = info instanceof Error ? info : new Error(info)
  const pe = new PrettyError()
  const prettyMessage = pe.render(reason)
  const message = `${reason.message}${verbose === true ? `\n${prettyMessage}` : ''}`
  return { message, reason, prettyMessage }
}

export function success(info: string, verbose: boolean = false) {
  const { message } = pretty(info, verbose)
  console.log('✨', chalk.green.bold(message))
}

export function info(info: string, verbose: boolean = false) {
  const { message } = pretty(info, verbose)
  console.log(chalk.cyan(message))
}

export function warn(info: string | Error, verbose: boolean = false) {
  const { message } = pretty(info, verbose)
  console.log(chalk.yellow.bold(`⚠️ ${message}`))
}

export function fail(info: string | Error, verbose: boolean = true) {
  const { message } = pretty(info, verbose)
  console.log(chalk.red.bold(`✗ ${message}`))
}

export function randomHex() {
  return `#${((Math.random() * (1 << 24)) | 0).toString(16).toUpperCase().padStart(6, '0')}`
}
