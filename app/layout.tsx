import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: [],
})

const bodyClass = cn(
  notoSansKR.className,
  'antialiased h-full',
)

export const metadata: Metadata = {
  title: 'Code Banner',
  description: '원하는 코드를 입력하면 svg 배너로 만들어 줍니다.',
}

const RootLayout = ({ children }: React.PropsWithChildren) =>
  <html
    lang='ko'
    className='h-full'
    suppressHydrationWarning
  >
    <body className={bodyClass}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </body>
  </html>

export default RootLayout
