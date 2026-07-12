import type { Metadata } from 'next'
import BlogListPage from '@/components/BlogListPage'
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog'
import { getBlogMetadata } from '@/lib/i18n/metadata'

export const metadata: Metadata = getBlogMetadata('zh')

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const categories = getBlogCategories()

  return <BlogListPage posts={posts} categories={categories} />
}
