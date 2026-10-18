import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth';
import { smtpStatus } from '@/lib/server/mailer';
import { contactRecipient } from '@/lib/server/cms';
import { changePasswordAction, sendTestEmailAction, updateProfileAction } from '../actions';
import { Card, Csrf, Flash, first } from '../_components';

export default async function Settings({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const smtp = smtpStatus(); const recipient = await contactRecipient();
  const mask = (v: string) => (v ? v.replace(/^(.).*(@.*)$/, '$1•••$2') : '');
  const row = (label: string, good: boolean, text: string) => <li key={label}><span className={`pill ${good ? 'pill-replied' : 'pill-new'}`}>{good ? 'OK' : 'Missing'}</span> {label}: {text}</li>;
  return (<>
    <h1>Settings</h1><Flash ok={first(sp.ok)} err={first(sp.err)} />
    <div className="admin-grid">
      <Card title="Email (SMTP) status">
        <ul className="admin-list">
          {row('SMTP host', !smtp.missing.includes('SMTP_HOST'), smtp.host || 'not set')}
          {row('SMTP user', !smtp.missing.includes('SMTP_USER'), smtp.missing.includes('SMTP_USER') ? 'not set' : 'set (hidden)')}
          {row('SMTP password', !smtp.missing.includes('SMTP_PASSWORD'), smtp.missing.includes('SMTP_PASSWORD') ? 'not set' : 'set (hidden)')}
          {row('Notification recipient', Boolean(recipient), recipient ? mask(recipient) : 'not set')}
        </ul>
        <p className="admin-muted">Port {smtp.port}, {smtp.secure ? 'SSL/TLS' : 'STARTTLS/plain'}. SMTP secrets live only in server environment variables and are never shown here. Edit the recipient under <Link href={`/admin/content?key=${encodeURIComponent('site')}`}>Content → Site settings</Link>. Enquiries are always saved even when email fails.</p>
        <form action={sendTestEmailAction}><Csrf token={admin.csrf} /><button className="button button-small" type="submit">Send test email</button></form>
      </Card>
      <div>
        <Card title="Profile"><form action={updateProfileAction} className="admin-form"><Csrf token={admin.csrf} />
          <label>Display name<input name="display_name" required minLength={2} maxLength={100} defaultValue={admin.displayName} /></label>
          <label>Email<input name="email" type="email" required maxLength={254} defaultValue={admin.email} autoComplete="username" /></label>
          <label>Current password (required only to change email)<input name="current" type="password" maxLength={200} autoComplete="current-password" /></label>
          <button className="button button-small" type="submit">Save profile</button></form></Card>
        <Card title="Change password"><form action={changePasswordAction} className="admin-form"><Csrf token={admin.csrf} />
          <label>Current password<input name="current" type="password" required maxLength={200} autoComplete="current-password" /></label>
          <label>New password (12+ characters)<input name="next" type="password" required minLength={12} maxLength={200} autoComplete="new-password" /></label>
          <label>Repeat new password<input name="again" type="password" required minLength={12} maxLength={200} autoComplete="new-password" /></label>
          <button className="button button-small" type="submit">Change password</button></form></Card>
      </div>
    </div>
  </>);
}
