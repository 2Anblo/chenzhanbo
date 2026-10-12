import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressiveBlurOverlay from '@/components/ProgressiveBlurOverlay'
import CustomCursor from '@/components/CustomCursor'
import { I18nProvider } from '@/components/I18nProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getSiteMetadata } from '@/lib/i18n/metadata'
import { defaultLocale, localeHtmlLangs, type Locale } from '@/lib/i18n/config'
import '@waline/client/waline.css'
import 'katex/dist/katex.min.css'
import '@/index.css'

const jetbrainsMono = localFont({
  src: './fonts/jetbrainsmono/JetBrainsMono-Variable.ttf',
  weight: '100 800',
  variable: '--font-mono',
  display: 'swap',
})

const cormorant = localFont({
  src: [
    { path: './fonts/cormorantgaramond/CormorantGaramond-Variable.ttf', weight: '300 700', style: 'normal' },
    { path: './fonts/cormorantgaramond/CormorantGaramond-Italic-Variable.ttf', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
})

const alexBrush = localFont({
  src: './fonts/alexbrush/AlexBrush-Regular.ttf',
  weight: '400',
  variable: '--font-alex-brush',
  display: 'swap',
})

async function getRequestLocale(): Promise<{ locale: Locale; hasLocaleCookie: boolean }> {
  const saved = (await cookies()).get('locale')?.value
  const hasLocaleCookie = saved === 'zh' || saved === 'en'
  return { locale: hasLocaleCookie ? saved : defaultLocale, hasLocaleCookie }
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestLocale()
  return getSiteMetadata(locale)
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8f6' },
    { media: '(prefers-color-scheme: dark)', color: '#101211' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale, hasLocaleCookie } = await getRequestLocale()

  return (
    <html
      lang={localeHtmlLangs[locale]}
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${cormorant.variable} ${alexBrush.variable}`}
    >
      <body className="bg-background text-foreground antialiased font-sans">
        <ThemeProvider>
          <I18nProvider initialLocale={locale} hasLocaleCookie={hasLocaleCookie}>
            <Analytics />
            <CustomCursor />
            <Header />
            <ProgressiveBlurOverlay />
            {children}
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
