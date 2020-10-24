import chalk from 'chalk'
import { getProjectInfoCollection, getConfigBranch } from '../services/project'
import { getBranch } from '../services/git'
import { fail } from '../services/logger'
import i18n from '../i18n'
import { PromiseType } from 'utility-types'

export default function branchInterceptor<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function (...args: A): Promise<R> {
    const projects = await getProjectInfoCollection()
    const branches = await Promise.all(
      projects.map(async ({ name, folder }) => {
        const branch = await getBranch(folder)
        return { name, branch }
      })
    )

    const branch = await getConfigBranch()
    const diff = branches.filter(({ branch: name }) => name !== branch)
    if (diff.length > 0) {
      const branches = diff.map(({ name, branch }) => {
        let content = chalk.gray(` - ${chalk.red.bold(name)}`)
        if (branch) {
          content += ` -> ${chalk.green.bold(branch)}`
        }

        return content
      })

      fail(i18n.INTERCEPTORS__BRANCH__ERROR_INVALID_BRANCH`${branch}${branches.join('\n')}`)
      process.exit(0)
    }

    return callback(...args)
  }
}
