'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveAboutDocument } from '@/lib/admin/about-actions';
import { aboutDocumentSchema, type AboutDocument } from '@/lib/about-content';

type Value = string | Value[] | { [key: string]: Value };
const names: Record<string, string> = {
  name: '名称', title: '个人头衔', summary: '个人简介', avatar: '头像地址', contact: '联系方式', email: '邮箱', github: 'GitHub', linkedin: 'LinkedIn',
  education: '教育经历', school: '学校', major: '专业', degree: '学位', startDate: '开始日期', endDate: '结束日期', description: '说明',
  experience: '工作经历', company: '公司', role: '职位', period: '时间', skills: '技术栈', category: '分类', learning: '学习雷达',
  labels: '栏目标题与页面文案', categories: '技术分类名称', ai: 'AI', backend: '后端', tools: '工具', backToHome: '返回首页',
  fullBioTitle: '简介标题', educationTitle: '教育标题', experienceTitle: '经历标题', projectsTitle: '项目链接文案', techStackTitle: '技术栈标题',
  contactTitle: '联系标题', viewResume: '简历链接文案', contactCta: '联系按钮文案', learningTitle: '学习栏目标题', learningDescription: '学习栏目说明', learningEmpty: '学习清单为空时的文案',
};
const templates: Record<string, Value> = {
  education: { school: '', major: '', degree: '', startDate: '', endDate: '', description: '' },
  experience: { company: '', role: '', period: '', description: '' },
  skills: { name: '', description: '', category: 'backend' }, learning: { name: '', description: '' },
};
function Fields({ value, onChange, field = '', path = 'about', disabled }: { value: Value; onChange: (v: Value) => void; field?: string; path?: string; disabled: boolean }) {
  if (typeof value === 'string') return <div className="space-y-2">
    <label htmlFor={path} className="text-sm font-medium">{names[field] ?? field}</label>
    {field === 'category' ? <select id={path} disabled={disabled} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-border rounded-md bg-background p-2">
      <option value="ai">AI</option><option value="backend">后端</option><option value="tools">工具</option>
    </select> : ['summary', 'description', 'learningDescription'].includes(field)
      ? <Textarea id={path} disabled={disabled} value={value} onChange={e => onChange(e.target.value)} rows={4} />
      : <Input id={path} disabled={disabled} value={value} onChange={e => onChange(e.target.value)} />}
  </div>;
  if (Array.isArray(value)) return <fieldset className="space-y-4 rounded-lg border border-border p-5" disabled={disabled}>
    <legend className="px-2 font-semibold">{names[field]}</legend>
    {value.map((item, i) => <div key={i} className="space-y-4 border-b border-border pb-4">
      <Fields value={item} field={field} path={path + '.' + i} disabled={disabled} onChange={next => onChange(value.map((old, j) => j === i ? next : old))} />
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" disabled={disabled || i === 0} onClick={() => { const next = [...value]; [next[i-1], next[i]] = [next[i], next[i-1]]; onChange(next); }}>上移</Button>
        <Button type="button" variant="outline" size="sm" disabled={disabled || i === value.length - 1} onClick={() => { const next = [...value]; [next[i+1], next[i]] = [next[i], next[i+1]]; onChange(next); }}>下移</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange(value.filter((_, j) => j !== i))}>删除</Button>
      </div>
    </div>)}
    <Button type="button" variant="outline" onClick={() => onChange([...value, structuredClone(templates[field])])}>添加{names[field]}</Button>
  </fieldset>;
  return <div className="space-y-5">{Object.entries(value).map(([key, item]) => (
    typeof item === 'object' && !Array.isArray(item)
      ? <fieldset key={key} className="rounded-lg border border-border p-5"><legend className="px-2 font-semibold">{names[key]}</legend><Fields field={key} path={path + '.' + key} value={item} disabled={disabled} onChange={next => onChange({ ...value, [key]: next })} /></fieldset>
      : <Fields key={key} field={key} path={path + '.' + key} value={item} disabled={disabled} onChange={next => onChange({ ...value, [key]: next })} />
  ))}</div>;
}
export default function AboutEditor({ initial }: { initial: AboutDocument }) {
  const [document, setDocument] = useState(initial);
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  return <form className="max-w-3xl space-y-6" onSubmit={async e => {
    e.preventDefault();
    const checked = aboutDocumentSchema.safeParse(document);
    if (!checked.success) {
      const issue = checked.error.issues[0];
      setLocale(issue.path[0] === 'en' ? 'en' : 'zh');
      setMessage('请检查：' + issue.path.map(key => names[String(key)] ?? (key === 'zh' ? '中文' : key === 'en' ? 'English' : String(Number(key) + 1))).join(' / ') + '。邮箱须有效，链接须为 http 或 https，头像可用站内路径。');
      return;
    }
    setBusy(true); setMessage('');
    try { const result = await saveAboutDocument(document); setMessage(result.success ? '已保存，关于页已更新。' : result.error ?? '保存失败'); if (result.success) router.refresh(); }
    catch { setMessage('保存失败，请检查登录状态或稍后重试。'); } finally { setBusy(false); }
  }}>
    <div><h1 className="text-3xl font-bold">关于页</h1><p className="mt-2 text-sm text-muted-foreground">分别编辑中英文内容。列表支持新增、删除和排序；保存后更新 /about。</p></div>
    <div className="flex gap-2">{(['zh', 'en'] as const).map(l => <Button key={l} type="button" disabled={busy} variant={locale === l ? 'default' : 'outline'} onClick={() => setLocale(l)}>{l === 'zh' ? '中文' : 'English'}</Button>)}</div>
    <Fields value={document[locale]} disabled={busy} onChange={value => setDocument({ ...document, [locale]: value })} />
    <div className="sticky bottom-0 border-t border-border bg-background py-4 flex items-center gap-4"><Button disabled={busy} type="submit">{busy ? '保存中…' : '保存全部内容'}</Button><p role="status" className="text-sm">{message}</p></div>
  </form>;
}
