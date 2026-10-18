import type { Metadata } from 'next';
import Link from 'next/link';
import { currentAdmin } from '@/lib/server/auth';
import { logoutAction } from './actions';
import { Csrf } from './_components';

export const metadata: Metadata = { title: { absolute: 'Roopo Visa Admin' }, robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let admin = null;
  try { admin = await currentAdmin(); } catch { /* DB down: pages render their own errors */ }
  return (
    <div className="admin-shell">
      <header className="admin-top">
        <strong>Roopo Visa — Admin</strong>
        {admin && (
          <nav aria-label="Admin">
            <Link href="/admin">Dashboard</Link><Link href="/admin/enquiries">Enquiries</Link><Link href="/admin/content">Content</Link><Link href="/admin/faq">FAQ</Link><Link href="/admin/blog">Blog &amp; SEO</Link><Link href="/admin/settings">Settings</Link>
            <form action={logoutAction}><Csrf token={admin.csrf} /><button type="submit" className="admin-link-button">Sign out ({admin.displayName})</button></form>
          </nav>
        )}
      </header>
      <div className="admin-body">{children}</div>
    </div>
  );
}
