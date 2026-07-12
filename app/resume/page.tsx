import type { Metadata } from 'next'
import ResumePage from '@/components/ResumePage'
import { getAllProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: '简历',
  description: '陈展博的个人简历 - AI 应用开发工程师。',
  openGraph: {
    title: '简历 | Zhanbo',
    description: '陈展博的个人简历 - AI 应用开发工程师。',
    type: 'website',
  },
}

export default function ResumeRoute() {
  const projects = getAllProjects()
  return <ResumePage projects={projects} />
}
