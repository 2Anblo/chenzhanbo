import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import BlogPostPage from '@/components/BlogPostPage'
import { getBlogPostBySlug } from '@/lib/blog'
import { localizeBlogPost } from '@/lib/i18n/content'

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

  const translated = localizeBlogPost(post, 'en')

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://www.chenzhanbo.com'
  const pageUrl = `${baseUrl}/blog/${post.slug}`

  return {
    title: translated.title,
    description: translated.excerpt,
    keywords: post.tags,
    authors: [{ name: 'Zhanbo Chen' }],
    openGraph: {
      title: translated.title,
      description: translated.excerpt,
      type: 'article',
      url: pageUrl,
      publishedTime: post.publishedAt,
      authors: ['Zhanbo Chen'],
    },
    twitter: {
      card: 'summary',
      title: translated.title,
      description: translated.excerpt,
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

  const translated = localizeBlogPost(post, 'en')

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://www.chenzhanbo.com'
  const pageUrl = `${baseUrl}/blog/${post.slug}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translated.title,
    description: translated.excerpt,
    author: {
      '@type': 'Person',
      name: 'Zhanbo Chen',
    },
    datePublished: post.publishedAt,
    keywords: post.tags.join(', '),
    url: pageUrl,
  }

  return (
    <>
      <Script
        id={`blog-json-ld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPostPage post={post} />
    </>
  )
}
