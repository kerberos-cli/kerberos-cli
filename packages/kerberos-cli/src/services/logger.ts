import chalk from 'chalk'

export function warn(message: string) {
  console.log(chalk.yellow.bold(`⚠️ ${message}`))
}

export function success(message: string) {
  console.log('✨', chalk.green.bold(message))
}

export function info(message: string) {
  console.log(chalk.cyan(message))
}

export function error(message: string) {
  console.log(chalk.red.bold(`✗ ${message}`))
}
