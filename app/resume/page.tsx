import type { Metadata } from 'next'
import ResumePage from '@/components/ResumePage'
import { getAllProjects } from '@/lib/projects'
import { getResumeMetadata } from '@/lib/i18n/metadata'

export const metadata: Metadata = getResumeMetadata('zh')
export const revalidate = 60;

export default async function ResumeRoute() {
  const projects = await getAllProjects()
  return <ResumePage projects={projects} />
}
