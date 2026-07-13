'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { saveProject } from '@/lib/admin/actions';
import type { ProjectForm } from '@/lib/admin/types';
import MarkdownPreview from '@/components/admin/MarkdownPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectEditorProps {
  initial?: ProjectForm;
}

const emptyForm: ProjectForm = {
  id: '',
  title: '',
  subtitle: '',
  description: '',
  background: '',
  content: '',
  techStack: '',
  contributions: '',
  highlights: '',
  githubUrl: '',
  demoUrl: '',
  category: 'personal',
  slug: '',
  date: new Date().toISOString().split('T')[0],
  image: '',
};

export default function ProjectEditor({ initial }: ProjectEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectForm>(initial ?? emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(initial);

  const update = (field: keyof ProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveProject(form);

    setSaving(false);
    if (result.success) {
      router.push('/admin/projects');
      router.refresh();
    } else {
      setError(result.error ?? 'Failed to save');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/projects" className="flex items-center gap-1">
            <ArrowLeft size={16} /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-display">{isEditing ? 'Edit Project' : 'New Project'}</h1>
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => update('subtitle', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => update('category', e.target.value as ProjectForm['category'])}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="background">Background *</Label>
              <Textarea
                id="background"
                value={form.background}
                onChange={(e) => update('background', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL *</Label>
              <Input
                id="githubUrl"
                type="url"
                value={form.githubUrl}
                onChange={(e) => update('githubUrl', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                type="url"
                value={form.demoUrl}
                onChange={(e) => update('demoUrl', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="techStack">Tech Stack (one per line)</Label>
              <Textarea
                id="techStack"
                value={form.techStack}
                onChange={(e) => update('techStack', e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contributions">Contributions (one per line)</Label>
              <Textarea
                id="contributions"
                value={form.contributions}
                onChange={(e) => update('contributions', e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="highlights">Highlights (one per line)</Label>
              <Textarea
                id="highlights"
                value={form.highlights}
                onChange={(e) => update('highlights', e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Project Image Path</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => update('image', e.target.value)}
                placeholder="projects/my-project.png"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit Markdown</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="content">Markdown Content</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                rows={20}
                className="font-mono text-sm"
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
            {saving ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/projects">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
