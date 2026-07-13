import { redirect } from 'next/navigation';
import { isAuthenticated, checkAdminEnabled, verifyPassword, createSession } from '@/lib/admin/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const enabled = await checkAdminEnabled();
  const authenticated = await isAuthenticated();

  if (!enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 font-display">Admin Disabled</h1>
          <p className="text-muted-foreground">Set ADMIN_PASSWORD in your environment to enable the admin panel.</p>
        </div>
      </div>
    );
  }

  if (authenticated) {
    redirect('/admin');
  }

  async function handleLogin(formData: FormData) {
    'use server';

    const password = formData.get('password') as string;
    const valid = await verifyPassword(password);

    if (!valid) {
      redirect('/admin/login?error=1');
    }

    await createSession();
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter the admin password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {params.error && (
              <p className="text-sm text-destructive">Incorrect password.</p>
            )}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
