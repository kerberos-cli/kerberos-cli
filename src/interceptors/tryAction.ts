import PrettyError from 'pretty-error'
import { PromiseType } from 'utility-types'
import { error as errorPrompt } from '../services/logger'

export default function tryAction<T extends (...args: any[]) => Promise<any>, A extends Parameters<T>, R extends PromiseType<ReturnType<T>>>(
  callback: T
): (...args: A) => Promise<R> {
  return async function(...args: A): Promise<R> {
    const pe = new PrettyError()
    try {
      return await callback(...args)
    } catch (error) {
      errorPrompt(error.message)
      console.log('\n')

      const message = pe.render(error)
      console.log(message)
    }
  }
}
