import { checkAdminEnabled } from '@/lib/admin/auth';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enabled = await checkAdminEnabled();

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
            Note: the CMS requires ADMIN_PASSWORD to be set and a serverful Next.js deployment.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
