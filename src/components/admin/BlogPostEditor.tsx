'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { saveBlogPost } from '@/lib/admin/actions';
import type { BlogPostForm } from '@/lib/admin/types';
import MarkdownPreview from '@/components/admin/MarkdownPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPostEditorProps {
  initial?: BlogPostForm;
}

const emptyForm: BlogPostForm = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  category: '',
  tags: '',
  publishedAt: new Date().toISOString().split('T')[0],
  readingTime: '',
  slug: '',
  cover: '',
};

export default function BlogPostEditor({ initial }: BlogPostEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostForm>(initial ?? emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(initial);

  const update = (field: keyof BlogPostForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveBlogPost(form);

    setSaving(false);
    if (result.success) {
      router.push('/admin/blog');
      router.refresh();
    } else {
      setError(result.error ?? 'Failed to save');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog" className="flex items-center gap-1">
            <ArrowLeft size={16} /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-display">{isEditing ? 'Edit Post' : 'New Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date *</Label>
              <Input
                id="publishedAt"
                type="date"
                value={form.publishedAt}
                onChange={(e) => update('publishedAt', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="Java, Spring Boot, AI"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readingTime">Reading Time (minutes)</Label>
              <Input
                id="readingTime"
                type="number"
                value={form.readingTime}
                onChange={(e) => update('readingTime', e.target.value)}
                placeholder="Auto"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cover">Cover Image Path</Label>
              <Input
                id="cover"
                value={form.cover}
                onChange={(e) => update('cover', e.target.value)}
                placeholder="blog/my-cover.png"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="content">Markdown Content *</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                rows={24}
                className="font-mono text-sm"
                required
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <MarkdownPreview content={form.content} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
