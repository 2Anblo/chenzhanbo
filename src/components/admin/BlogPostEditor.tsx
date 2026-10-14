'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminTranslation } from '@/components/admin/AdminText';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { blogCategories } from '@/data/blogCategories';
import { getReadingStats } from '@/lib/reading-time';

interface BlogPostEditorProps {
  initial?: BlogPostForm;
}

const emptyForm: BlogPostForm = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  categories: [],
  tags: '',
  publishedAt: new Date().toISOString().split('T')[0],
  readingTime: '',
  slug: '',
  cover: '',
  en: { title: '', excerpt: '', content: '' },
};

export default function BlogPostEditor({ initial }: BlogPostEditorProps) {
  const { t } = useAdminTranslation();
  const router = useRouter();
  const initialForm = initial ?? emptyForm;
  const initialReadingStats = getReadingStats(initialForm.content);
  const [form, setForm] = useState<BlogPostForm>(() => ({
    ...initialForm,
    readingTime: initialReadingStats.minutes ? String(initialReadingStats.minutes) : '',
  }));
  const [autoCalculateReadingTime, setAutoCalculateReadingTime] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(initial);

  const update = (field: keyof BlogPostForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEnglish = (field: 'title' | 'excerpt' | 'content', value: string) => {
    setForm((prev) => ({
      ...prev,
      en: { title: '', excerpt: '', content: '', ...prev.en, [field]: value },
    }));
  };

  const toggleCategory = (category: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      categories: checked
        ? [...new Set([...prev.categories, category])]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const readingStats = getReadingStats(form.content);

  const updateContent = (content: string) => {
    setForm((prev) => ({
      ...prev,
      content,
      readingTime: autoCalculateReadingTime
        ? getReadingStats(content).minutes.toString().replace(/^0$/, '')
        : prev.readingTime,
    }));
  };

  const toggleAutoCalculateReadingTime = (checked: boolean) => {
    setAutoCalculateReadingTime(checked);
    if (checked) {
      update('readingTime', readingStats.minutes ? String(readingStats.minutes) : '');
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.categories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: BlogPostForm = isEditing
      ? { ...form, publishedAt: new Date().toISOString().split('T')[0] }
      : form;

    try {
      const result = await saveBlogPost(payload);

      if (result.success) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        setError(result.error ?? "Failed to save");
      }
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog" className="flex items-center gap-1">
            <ArrowLeft size={16} /> {t("Back")} </Link>
        </Button>
        <h1 className="text-3xl font-bold font-display">{isEditing ? t("Edit Post") : t("New Post")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title"> {t("Title *")} </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug"> {t("Slug")} </Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder={t("Leave blank to use a date timestamp")}
                aria-describedby="slug-help"
                disabled={isEditing}
              />
              <p id="slug-help" className="text-xs text-muted-foreground">
                {isEditing ? t("The slug cannot be changed after creation.") : t("Optional. Leave blank to generate a UTC date timestamp when saving.")}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label> {t("Categories *")} </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {blogCategories.map((category) => (
                  <label key={category} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        toggleCategory(category, checked === true)
                      }
                    />
                    {t(category)}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt"> {t("Published Date *")} </Label>
              <Input
                id="publishedAt"
                type="date"
                value={form.publishedAt}
                onChange={(e) => update('publishedAt', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="excerpt"> {t("Excerpt *")} </Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags"> {t("Tags (comma separated)")} </Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="Java, Spring Boot, AI"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readingTime"> {t("Reading Time (minutes)")} </Label>
              <Input
                id="readingTime"
                type="number"
                value={form.readingTime}
                onChange={(e) => update('readingTime', e.target.value)}
                placeholder={t("Auto")}
                min={1}
                step={1}
                disabled={autoCalculateReadingTime}
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={autoCalculateReadingTime}
                  onCheckedChange={(checked) =>
                    toggleAutoCalculateReadingTime(checked === true)
                  }
                /> {t("Auto-calculate from Markdown")} </label>
              <p className="text-xs text-muted-foreground">
                {readingStats.cjkCharacters} {t("CJK characters +")} {readingStats.words} {t("words")} {' · '}{readingStats.minutes || 0} {t("min estimated")} </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cover"> {t("Cover Image Path")} </Label>
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
            <TabsTrigger value="edit"> {t("Edit")} </TabsTrigger>
            <TabsTrigger value="preview"> {t("Preview")} </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="content"> {t("Markdown Content *")} </Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => updateContent(e.target.value)}
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

        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="font-display text-lg font-semibold"> {t("English version")} </h2>
              <p className="text-sm text-muted-foreground"> {t("Shown when visitors switch to English. Keep code and math unchanged.")} </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-en"> {t("English title *")} </Label>
              <Input id="title-en" value={form.en?.title ?? ''} onChange={(e) => updateEnglish('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt-en"> {t("English excerpt *")} </Label>
              <Textarea id="excerpt-en" value={form.en?.excerpt ?? ''} onChange={(e) => updateEnglish('excerpt', e.target.value)} rows={3} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-en"> {t("English Markdown content *")} </Label>
              <Textarea id="content-en" value={form.en?.content ?? ''} onChange={(e) => updateEnglish('content', e.target.value)} rows={24} className="font-mono text-sm" required />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-destructive text-sm">{t(error)}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? t("Saving...") : isEditing ? t("Update Post") : t("Create Post")}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/blog"> {t("Cancel")} </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
