import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { I18nProvider } from '@/components/I18nProvider'
import { getSiteMetadata } from '@/lib/i18n/metadata'
import '@/index.css'

export const metadata: Metadata = getSiteMetadata('zh')

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-white text-[#1A1A2E]">
        <I18nProvider>
          <Analytics />
          <CustomCursor />
          <Header />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  )
}
