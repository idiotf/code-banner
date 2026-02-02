'use client'

import { useCallback } from 'react'
import { useBannerPreview } from '@/hooks/banner'
import { useFormContext } from 'react-hook-form'

import { Download, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import { Form } from '../ui/form'

import { createTokenData } from '@/lib/highlighter'
import { createBannerSVG } from '@/lib/banner'
import { downloadText, uploadFile } from '@/lib/file'

import { BannerEditor } from './editor'
import { usePopover } from '@/hooks/popover'
import { BannerOptionsPopover, useBannerForm, type FormSchema, type PopoverProps } from './options'

const FormHeader = ({ popover }: { popover: PopoverProps }) => {
  const form = useFormContext<FormSchema>()

  const uploadCodeFile = useCallback(async () => {
    const files = await uploadFile()
    if (!files?.[0]) return

    const file = files[0]
    form.setValue('code', await file.text())
  }, [form])

  return (
    <header className='flex gap-3 items-center p-4 h-16'>
      <Button type='button' onClick={uploadCodeFile} className='h-8 cursor-pointer'>
        <Upload />
        업로드
      </Button>
      <Button type='submit' className='h-8 cursor-pointer'>
        <Download />
        다운로드
      </Button>
      <BannerOptionsPopover {...popover} />
    </header>
  )
}

export const BannerCreator = () => {
  const [form, highlightOptions, bannerOptions] = useBannerForm()
  const previewSVG = useBannerPreview(highlightOptions, bannerOptions)

  const popover = usePopover()

  const onSubmit = useCallback(async ({ code, ...options }: FormSchema) => {
    const tokenData = await createTokenData(code, options)
    const svg = createBannerSVG(tokenData, options)
    downloadText(svg, 'image/svg+xml')
  }, [])

  const onError = useCallback(() => {
    popover.setOpen(true)
  }, [popover])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className='flex flex-col h-full'>
        <FormHeader popover={popover} />
        <BannerEditor
          svg={previewSVG}
          fontSize={bannerOptions.fontSize}
          fontFamily={bannerOptions.fontFamily}
          lineHeight={bannerOptions.lineHeight}
          placeholder='// Paste your code here'
        />
      </form>
    </Form>
  )
}
