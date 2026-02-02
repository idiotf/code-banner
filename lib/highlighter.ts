import memoize from 'lodash.memoize'

import {
  bundledLanguages,
  bundledThemes,
  codeToTokens,
  type TokensResult,
  type BundledLanguage,
  type BundledTheme,
  type CodeToTokensOptions,
} from 'shiki'

export const languages = [
  ...Object.keys(bundledLanguages) as BundledLanguage[],
  'text', 'plaintext', 'txt', 'plain', 'ansi',
] as const

export const themes = Object.keys(bundledThemes) as BundledTheme[]

export type Language = typeof languages[number]
export type Theme = typeof themes[number]

export type TokenOptions = CodeToTokensOptions<BundledLanguage, BundledTheme> & {
  code: string
}

export type { TokensResult }

export const createTokenData = memoize(codeToTokens, (code, options) => JSON.stringify([code, options]))
