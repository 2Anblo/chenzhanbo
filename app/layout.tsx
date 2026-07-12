import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import '@/index.css'

export const metadata: Metadata = {
  title: {
    default: 'Zhanbo - Developer Portfolio',
    template: '%s | Zhanbo',
  },
  description: '陈展博的个人职业主页 - Java 后端开发 | AI Agent 开发。',
  keywords: ['陈展博', 'Java', 'Spring Boot', 'AI Agent', 'RAG', 'LLM', '后端开发', '微服务'],
  authors: [{ name: '陈展博' }],
  creator: '陈展博',
  metadataBase: new URL('https://chenzhanbo.vercel.app'),
  openGraph: {
    title: '陈展博 - Developer Portfolio',
    description: 'Java 后端开发 | AI Agent 开发 - 个人职业主页',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Zhanbo - Developer Portfolio',
  },
  twitter: {
    card: 'summary',
    title: '陈展博 - Developer Portfolio',
    description: 'Java 后端开发 | AI Agent 开发 - 个人职业主页',
  },
  icons: {
    icon: '/favicon.png',
  },
}

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
        <Analytics />
        <CustomCursor />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
