import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/server/auth';
import { loginAction } from '../actions';
import { Flash, first } from '../_components';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  let signedIn = false;
  try { signedIn = Boolean(await currentAdmin()); } catch { /* shown via login error */ }
  if (signedIn) redirect('/admin');
  return (
    <div className="admin-login">
      <h1>Admin sign in</h1>
      <Flash err={first(sp.err)} />
      <form action={loginAction} className="admin-form" autoComplete="on">
        <label>Email<input name="email" type="email" required maxLength={254} autoComplete="username" /></label>
        <label>Password<input name="password" type="password" required maxLength={200} autoComplete="current-password" /></label>
        <button className="button" type="submit">Sign in</button>
      </form>
      <p className="admin-muted">Authorised staff only. Sessions expire after 8 hours.</p>
    </div>
  );
}
