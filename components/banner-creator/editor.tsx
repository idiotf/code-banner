import { memo } from 'react'
import { Editor } from '../form/code-input'
import { useOrientationType } from '@/hooks/orientation-type'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable'

const Loading = () =>
  <div className='w-full h-full flex justify-center items-center text-center'>
    미리보기 로딩 중...
  </div>

const BannerPreview = ({ svg }: { svg?: string }) => svg ?
  <span
    dangerouslySetInnerHTML={{ __html: svg }}
    className='w-full h-full *:w-full flex justify-center items-center'
  />
: <Loading />

export const BannerEditor = memo(function BannerEditor({ svg, fontSize, fontFamily, lineHeight, placeholder }: {
  svg?: string
  fontSize: number
  fontFamily: string
  lineHeight: number
  placeholder?: string
}) {
  const orientationType = useOrientationType('landscape-primary')
  const isPortrait = orientationType.includes('portrait')
  const orientation = isPortrait ? 'vertical' : 'horizontal'

  return (
    <ResizablePanelGroup
      orientation={orientation}
      className='flex-1'
    >
      <ResizablePanel>
        <Editor
          name='code'
          placeholder={placeholder}
          className='h-full'
          style={{
            fontSize,
            fontFamily,
            lineHeight: lineHeight + 'px',
          }}
        />
      </ResizablePanel>
      <ResizableHandle data-panel-group-direction={orientation} withHandle />
      <ResizablePanel>
        <BannerPreview svg={svg} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
})
