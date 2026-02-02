import * as z from 'zod/mini'
import { memo, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { BannerOptions } from '@/lib/banner'
import { languages, themes, type TokenOptions } from '@/lib/highlighter'

import { Settings } from 'lucide-react'
import { Combobox } from '../form/combobox'
import { Input, NumberInput } from '../form/input'

import { Separator } from '../ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export type FormSchema = z.infer<typeof FormSchema>
export const FormSchema = z.object({
  lang: z.union(languages.map(v => z.literal(v)), '알 수 없는 코드 언어입니다.'),
  theme: z.union(themes.map(v => z.literal(v)), '알 수 없는 테마입니다.'),
  code: z.string(),

  fontSize: z.number('글꼴 크기를 입력해 주세요.').check(z.positive('글꼴 크기는 0보다 커야 합니다.')),
  lineHeight: z.number('줄 간격을 입력해 주세요.'),
  fontFamily: z.string(),

  paddingX: z.optional(z.number()),
  paddingY: z.optional(z.number()),
  maxWidth: z.optional(z.number()),

  speed: z.optional(z.number()),
  outHeight: z.number('배너 높이를 입력해 주세요.').check(z.positive('배너 높이는 0보다 커야 합니다.')),
  baseColor: z.optional(z.string()),
})

const resolver = zodResolver(FormSchema)

const defaultOptions: FormSchema = {
  lang: 'tsx',
  theme: 'dark-plus',
  code: `console.log('Hello, world!')`,

  fontSize: 14,
  lineHeight: 19,
  fontFamily: 'consolas,monospace',

  paddingX: 9,
  paddingY: 9,
  maxWidth: 1062,

  speed: 100,
  outHeight: 210,
  baseColor: '#d4d4d4',
}

export function useBannerForm() {
  const form = useForm({
    resolver,
    defaultValues: defaultOptions,
  })

  const watchOptions = useWatch({
    control: form.control,
    defaultValue: defaultOptions,
  })

  const {
    lang, theme, code,
    fontSize, lineHeight, fontFamily,
    paddingX, paddingY, maxWidth,
    speed, outHeight, baseColor,
  } = useMemo<FormSchema>(() => ({
    ...defaultOptions,
    ...watchOptions,
  }), [watchOptions])

  const highlightOptions = useMemo<TokenOptions>(() => ({
    lang, theme, code,
  }), [lang, theme, code])

  const bannerOptions = useMemo<BannerOptions>(() => ({
    paddingX, paddingY, maxWidth,
    fontSize, lineHeight, fontFamily,
    speed, outHeight, baseColor,
  }), [paddingX, paddingY, maxWidth, fontSize, lineHeight, fontFamily, speed, outHeight, baseColor])

  return [form, highlightOptions, bannerOptions] as const
}

export type PopoverProps = React.ComponentProps<typeof Popover>

export const BannerOptionsPopover = memo(function BannerOptionsPopover(props: PopoverProps) {
  return (
    <Popover {...props}>
      <PopoverTrigger className='data-[state=open]:*:rotate-180'>
        <Settings className='rounded-full cursor-pointer duration-300 hover:rotate-180' />
      </PopoverTrigger>
      <PopoverContent className='space-y-4'>
        <BannerOptionsContent />
      </PopoverContent>
    </Popover>
  )
})

export const BannerOptionsContent = memo(function BannerOptionsContent() {
  return <>
    <Combobox name='lang' label='코드 언어' placeholder='코드 언어 입력' items={languages} required />
    <Combobox name='theme' label='테마' placeholder='테마 입력' items={themes} required />
    <Separator />

    <NumberInput name='fontSize' label='글꼴 크기' placeholder='글꼴 크기 입력(px)' required />
    <NumberInput name='lineHeight' label='줄 간격' placeholder='줄 간격 입력(px)' required />
    <Input name='fontFamily' label='글꼴 유형' placeholder='글꼴 유형 입력' required />
    <Separator />

    <NumberInput name='paddingX' label='가로 여백' placeholder='가로 여백 입력(px)' />
    <NumberInput name='paddingY' label='세로 여백' placeholder='세로 여백 입력(px)' />
    <NumberInput name='maxWidth' label='최대 너비' placeholder='최대 너비 입력(px)' />
    <Separator />

    <NumberInput name='speed' label='움직임 속도' placeholder='움직임 속도 입력(px/s)' />
    <NumberInput name='outHeight' label='배너 높이' placeholder='배너 높이 입력(px)' required />
    <Input type='color' name='baseColor' label='기본 글 색깔' />
  </>
})
