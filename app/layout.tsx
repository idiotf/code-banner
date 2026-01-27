import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Template',
  description: 'Next.js + Shadcn template',
}

const RootLayout = ({ children }: React.PropsWithChildren) =>
  <html lang='ko' className='h-full'>
    <body className={`${notoSansKR.className} antialiased h-full`}>
      {children}
    </body>
  </html>

export default RootLayout
