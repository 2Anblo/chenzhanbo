import type { Metadata } from 'next'
import ResumePage from '@/components/ResumePage'
import { getAllProjects } from '@/lib/projects'
import { getResumeMetadata } from '@/lib/i18n/metadata'

export const metadata: Metadata = getResumeMetadata('zh')

export default function ResumeRoute() {
  const projects = getAllProjects()
  return <ResumePage projects={projects} />
}
