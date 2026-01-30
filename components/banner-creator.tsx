'use client'

import * as z from 'zod/mini'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Download, Upload } from 'lucide-react'
import { Form } from './ui/form'
import { Button } from './ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

import { bundledLanguages, bundledThemes, type TokensResult } from 'shiki'
import { downloadText, uploadFile } from '@/lib/file'
import { createBannerSVG, createTokenData } from '@/lib/banner'
import { Editor } from './form/code-input'

const defaultCode = `console.log('Hello, world!')`

type formSchema = z.infer<typeof formSchema>
const formSchema = z.object({
  lang: z.union(Object.keys(bundledLanguages).map(v => z.literal(v as keyof typeof bundledLanguages))),
  theme: z.union(Object.keys(bundledThemes).map(v => z.literal(v as keyof typeof bundledThemes))),
  code: z.string(),

  fontSize: z.number().check(z.positive('글꼴 크기는 0보다 커야 합니다.')),
  lineHeight: z.number(),
  fontFamily: z.string(),

  paddingX: z.number(),
  paddingY: z.number(),
  maxWidth: z.number().check(z.positive('최대 너비는 0보다 커야 합니다.')),

  speed: z.number(),
  outHeight: z.number().check(z.positive('높이는 0보다 커야 합니다.')),
})

const resolver = zodResolver(formSchema)

const defaultOptions: formSchema = {
  lang: 'tsx',
  theme: 'dark-plus',
  code: defaultCode,

  fontSize: 14,
  lineHeight: 19,
  fontFamily: 'consolas,monospace',

  paddingX: 9,
  paddingY: 9,
  maxWidth: 1062,

  speed: 100,
  outHeight: 210,
}

export const BannerCreator = () => {
  const form = useForm({
    resolver,
    defaultValues: defaultOptions,
  })

  const options = useWatch({
    control: form.control,
    defaultValue: defaultOptions,
  }) as formSchema

  const [tokenData, setTokenData] = useState<TokensResult>()
  const countRef = useRef(0)
  const lastCountRef = useRef(0)

  const svg = useMemo(() => tokenData && createBannerSVG(tokenData, options), [tokenData, options])

  const uploadCodeFile = useCallback(async () => {
    const files = await uploadFile()
    if (!files?.[0]) return

    const file = files[0]
    form.setValue('code', await file.text())
  }, [form])

  const onSubmit = useCallback(async ({ code, ...options }: formSchema) => {
    const tokenData = await createTokenData(code, options)
    const svg = createBannerSVG(tokenData, options)
    downloadText(svg, 'image/svg+xml')
  }, [])

  useEffect(() => {
    const count = countRef.current++
    (async () => {
      const tokenData = await createTokenData(options.code, options)
      if (count < lastCountRef.current) return

      lastCountRef.current = count
      setTokenData(tokenData)
    })()
  }, [options])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col h-full'>
        <header className='flex gap-4 items-center p-4 h-16'>
          <Button type='button' onClick={uploadCodeFile} className='h-8 cursor-pointer'>
            <Upload />
            업로드
          </Button>
          <Button type='submit' className='h-8 cursor-pointer'>
            <Download />
            다운로드
          </Button>
        </header>
        <ResizablePanelGroup className='flex-1'>
          <ResizablePanel>
            <Editor
              name='code'
              placeholder='// Paste your code here'
              className='h-full'
              style={{
                fontSize: options.fontSize,
                fontFamily: options.fontFamily,
                lineHeight: options.lineHeight + 'px',
              }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            {svg ?
              <span
                dangerouslySetInnerHTML={{ __html: svg }}
                className='w-full h-full *:w-full flex justify-center items-center'
              />
            : <>Loading...</>
            }
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
    </Form>
  )
}
