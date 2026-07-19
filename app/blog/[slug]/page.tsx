import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogPostPage from '@/components/BlogPostPage'
import { getBlogPostBySlug } from '@/lib/blog'

interface BlogPostRouteProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60;

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {}
  }

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://chenzhanbo.vercel.app'
  const pageUrl = `${baseUrl}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: '陈展博' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: pageUrl,
      publishedTime: post.publishedAt,
      authors: ['陈展博'],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export default async function BlogPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://chenzhanbo.vercel.app'
  const pageUrl = `${baseUrl}/blog/${post.slug}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: '陈展博',
    },
    datePublished: post.publishedAt,
    keywords: post.tags.join(', '),
    url: pageUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPostPage post={post} />
    </>
  )
}
