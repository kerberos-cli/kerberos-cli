import { sync as commandExistsSync } from 'command-exists'
import Sprite from './Sprite'

export default class Git extends Sprite {
  /** 是否支持GIT */
  static supported: boolean = commandExistsSync('git')
}
