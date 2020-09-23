import path from 'path'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import inquirerSearchCheckbox from 'inquirer-search-checkbox'
import inquirerCommandPrompt from 'inquirer-command-prompt'
import { rootPath } from '../constants/config'

inquirerCommandPrompt.setConfig({
  history: {
    save: true,
    folder: path.join(rootPath, '.temporary'),
    limit: 30,
    blacklist: ['exit'],
  },
})

inquirer.registerPrompt('search-list', inquirerSearchList)
inquirer.registerPrompt('search-checkbox', inquirerSearchCheckbox)
inquirer.registerPrompt('command', inquirerCommandPrompt)
