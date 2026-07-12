import type { Metadata } from 'next'
import ResumePage from '@/components/ResumePage'

export const metadata: Metadata = {
  title: '简历',
  description: '陈展博的个人简历 - Java 后端开发 | AI Agent 开发。',
  openGraph: {
    title: '简历 | Zhanbo',
    description: '陈展博的个人简历 - Java 后端开发 | AI Agent 开发。',
    type: 'website',
  },
}

export default function ResumeRoute() {
  return <ResumePage />
}
