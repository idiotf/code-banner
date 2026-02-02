import { useCallback, useMemo } from 'react'
import { useAsyncValue } from './async-state'
import { createTokenData, type TokenOptions } from '@/lib/highlighter'
import { createBannerSVG, type BannerOptions } from '@/lib/banner'

export function useBannerPreview(highlightOptions: TokenOptions, bannerOptions: BannerOptions) {
  const getTokenData = useCallback(() => createTokenData(highlightOptions.code, highlightOptions), [highlightOptions])
  const tokens = useAsyncValue(getTokenData)
  return useMemo(() => tokens && createBannerSVG(tokens, bannerOptions), [tokens, bannerOptions])
}
