import type { Metadata } from 'next'
import BlogListPage from '@/components/BlogListPage'
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog'

export const metadata: Metadata = {
  title: '博客',
  description: '陈展博的技术博客，分享 Java 后端、Spring 生态、AI Agent 等领域的实践心得。',
  openGraph: {
    title: '博客 | Zhanbo',
    description: '陈展博的技术博客，分享 Java 后端、Spring 生态、AI Agent 等领域的实践心得。',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const categories = getBlogCategories()

  return <BlogListPage posts={posts} categories={categories} />
}
