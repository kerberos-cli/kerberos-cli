import { program } from 'commander'
import { fail, success } from '../services/logger'
import { getVariables, updateVariables } from '../services/env'
import tryGetLanguage from './share/tryGetLanguage'
import intercept from '../interceptors'
import i18n, { languages as Languages, getCurrent } from '../i18n'
import * as I18nTypes from '../i18n/types'

async function takeAction(lang: I18nTypes.Language): Promise<void> {
  const { language: origin } = getVariables() || {}
  const { alias } = Languages[origin] || {}
  const language = await tryGetLanguage(i18n.COMMAND__LANGUAGE__SELECT_LANGUAGE`${alias}`, lang, { default: origin })
  if (-1 === i18n.supported.indexOf(language)) {
    fail(i18n.COMMAND__LANGUAGE__ERROR_NOT_EXISTS`${language || ''}`)
    return
  }

  const { alias: tAlias } = Languages[language] || {}
  updateVariables({ language })
  success(i18n.COMMAND__LANGUAGE__SUCCESS_MESSAGE`${tAlias}`)
}

program
  .command('language [lang]')
  .description(i18n.COMMAND__LANGUAGE__DESC`${getCurrent().alias}`, {
    lang: i18n.COMMAND__LANGUAGE__ARGS_LANG``,
  })
  .action((language: I18nTypes.Language, options) => intercept()(takeAction)(language, options))
