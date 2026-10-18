import { isAuthenticated } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { readAboutDocument } from '@/lib/about';
import AboutEditor from '@/components/admin/AboutEditor';
export default async function AdminAboutPage() {
  if (!(await isAuthenticated())) redirect('/admin/login');
  return <AboutEditor initial={await readAboutDocument()} />;
}
