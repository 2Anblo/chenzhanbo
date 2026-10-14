import AdminText from '@/components/admin/AdminText';
import AdminLanguageControl from '@/components/admin/AdminLanguageControl';
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
        <AdminLanguageControl />
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 font-display"> <AdminText text="Admin Disabled" /> </h1>
          <p className="text-muted-foreground mb-4"> <AdminText text="The admin panel is not configured. Set" /> {' '}
            <code className="bg-muted px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> <AdminText text="in your environment to enable it." /> </p>
          <p className="text-xs text-muted-foreground"> <AdminText text="Note: the CMS requires ADMIN_PASSWORD to be set and a serverful Next.js deployment." /> </p>
        </div>
      </div>
    );
  }

  return <><AdminLanguageControl />{children}</>;
}
