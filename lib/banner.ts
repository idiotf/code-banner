import memoize from 'lodash.memoize'
import {
  codeToTokens,
  type BundledLanguage,
  type BundledTheme,
  type CodeToTokensOptions,
  type TokensResult,
} from 'shiki'

export type TokenOptions = CodeToTokensOptions<BundledLanguage, BundledTheme>

export const createTokenData = memoize(codeToTokens, (code, options) => JSON.stringify([code, options]))

export interface BannerOptions {
  paddingX: number
  paddingY: number
  maxWidth: number
  fontSize: number
  fontFamily: string
  lineHeight: number
  speed: number
  outHeight: number
}

const escapeHTML = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')

const escapeAttr = (attr: string) =>
  attr
    .replaceAll('"', '&quot;')

interface TspanSVG {
  content: string
  attr: string
  color?: string
}

const base        = '0123456789abcdefghijklmnop'
const identifiers = 'etaoinsrhdlucmfywgpbvkxqjz'

export function createBannerSVG(tokenData: TokensResult, {
  paddingX,
  paddingY,
  maxWidth,
  fontSize,
  fontFamily,
  lineHeight,
  speed,
  outHeight,
}: BannerOptions) {
  const height = tokenData.tokens.length * lineHeight

  let mostUsedColorCount = 0, mostUsedColor = '', dy = fontSize, firstDy: number | undefined
  const tspanSVGList: TspanSVG[] = [], colorCountTable = new Map<string, number>()

  for (const line of tokenData.tokens) {
    let isFirstInLine = true, whitespace = '', lastToken: TspanSVG | undefined

    for (const token of line) {
      // 현재 토큰이 쌩 공백이면 whitespace에만 추가한다.
      // 뒤 토큰이 없으면 whitespace는 svg에 추가되지 않는다.
      if (token.content.trim() == '') {
        whitespace += token.content
        continue
      }

      if (lastToken && token.color == lastToken.color) {
        lastToken.content += whitespace + token.content
        whitespace = ''
        continue
      }

      let attr = ''
      if (isFirstInLine) {
        if (firstDy == undefined) firstDy = dy
        else attr += ` x="0" dy="${dy}"`
        dy = 0
        isFirstInLine = false
      }

      if (token.color) {
        const count = (colorCountTable.get(token.color) || 0) + 1
        colorCountTable.set(token.color, count)

        if (count > mostUsedColorCount) {
          mostUsedColor = token.color
          mostUsedColorCount = count
        }
      }

      tspanSVGList.push(lastToken = { content: whitespace + token.content, attr, color: token.color })
      whitespace = ''
    }

    dy += lineHeight
  }

  const colorMapTable = new Map<string, string>()
  for (const color of colorCountTable.keys()) {
    if (color == mostUsedColor || colorCountTable.get(color) == 1) continue
    const index = colorMapTable.size
    const id = index.toString(base.length).split('').map(v => identifiers[base.indexOf(v)]).join('')
    colorMapTable.set(color, escapeAttr(id))
  }

  const tspanSVG = tspanSVGList.map(text => {
    const colorId = text.color && colorMapTable.get(text.color)
    const colorAttribute = colorId ? ` d="${colorId}"` : text.color && ` fill="${escapeAttr(text.color.toLowerCase())}"`

    const attr = (text.color && text.color != mostUsedColor ? colorAttribute : '') + text.attr
    const content = escapeHTML(text.content)

    return attr ? `<tspan${attr}>${content}</tspan>` : content
  }).join('')

  const colorMapSheet =
    colorMapTable
      .entries()
      .map(([color, id]) => `[d=${escapeHTML(id)}]{fill:${escapeHTML(color.toLowerCase())}}`)
      .toArray()
      .join('')

  firstDy ||= 0

  const duration = (height + paddingY * 2 - outHeight) / speed
  const hasAnimation = duration > 0 || ''

  const textStyle = ''
  + (hasAnimation && `animation:e ${duration}s infinite linear;`)
  + (mostUsedColor && `fill:${escapeHTML(mostUsedColor.toLowerCase())};`)
  + `translate:var(--e)${paddingY + firstDy}px;`
  + `font:${fontSize}px ${escapeHTML(fontFamily)};`
  + `white-space:pre;`
  + `--e:max(calc(50% - ${maxWidth / 2}px),${paddingX}px)`

  const sheet = colorMapSheet
  + `text{${textStyle}}`
  + (hasAnimation && ''
  +   `@keyframes e{`
  +     `to{translate:var(--e)${outHeight - height - paddingY + firstDy}px}`
  +   `}`
  + '')

  return ''
  + `<svg xmlns="http://www.w3.org/2000/svg" height="${outHeight}">`
  +   `<style>${sheet}</style>`
  +   `<rect width="100%" height="100%"${tokenData.bg ? ` fill="${escapeAttr(tokenData.bg.toLowerCase())}"` : ''}/>`
  +   `<text>${tspanSVG}</text>`
  + `</svg>`
}
