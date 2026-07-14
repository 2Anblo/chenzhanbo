import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/admin/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
