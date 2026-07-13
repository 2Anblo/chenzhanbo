import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { I18nProvider } from '@/components/I18nProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getSiteMetadata } from '@/lib/i18n/metadata'
import '@/index.css'

export const metadata: Metadata = getSiteMetadata('zh')

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#101114' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <I18nProvider>
            <Analytics />
            <CustomCursor />
            <Header />
            {children}
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
