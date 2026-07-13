import { redirect } from 'next/navigation';
import { isAuthenticated, checkAdminEnabled } from '@/lib/admin/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enabled = await checkAdminEnabled();
  const authenticated = await isAuthenticated();

  if (!enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 font-display">Admin Disabled</h1>
          <p className="text-muted-foreground mb-4">
            The admin panel is not configured. Set{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> in your environment to enable it.
          </p>
          <p className="text-xs text-muted-foreground">
            Note: in static export mode the CMS only works when running{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded">npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

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
