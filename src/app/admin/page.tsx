import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth';
import { counts, STATUS_LABEL, DELIVERY_LABEL, STATUSES } from '@/lib/server/enquiries';
import { query, type RowDataPacket } from '@/lib/server/db';
import { smtpStatus } from '@/lib/server/mailer';
import { contactRecipient } from '@/lib/server/cms';
import { Card, fmt } from './_components';

export default async function Dashboard() {
  await requireAdmin();
  const c = await counts();
  const one = async (sql: string) => Number((await query<RowDataPacket & { c: number }>(sql))[0]?.c ?? 0);
  const customised = await one('SELECT COUNT(*) AS c FROM content_entries');
  const faqPublished = await one('SELECT COUNT(*) AS c FROM faq_items WHERE published = 1');
  const faqTotal = await one('SELECT COUNT(*) AS c FROM faq_items');
  const lastEdit = (await query<RowDataPacket & { t: Date | null }>('SELECT MAX(updated_at) AS t FROM content_entries'))[0]?.t;
  const smtp = smtpStatus(); const recipient = await contactRecipient();
  return (
    <>
      <h1>Dashboard</h1>
      <div className="admin-stats">
        {STATUSES.map((s) => <Link key={s} className="admin-stat" href={`/admin/enquiries?status=${s}`}><b>{c.byStatus[s]}</b><span>{STATUS_LABEL[s]}</span></Link>)}
        <Link className="admin-stat" href="/admin/enquiries"><b>{c.total}</b><span>Total enquiries</span></Link>
        <Link className="admin-stat" href="/admin/enquiries?delivery=failed"><b>{c.failedDelivery}</b><span>Email not delivered</span></Link>
        <div className="admin-stat"><b>{c.last7}</b><span>Last 7 days</span></div>
      </div>
      <div className="admin-grid">
        <Card title="Latest enquiries">
          {c.recent.length === 0 ? <p className="admin-muted">No enquiries yet.</p> : (
            <ul className="admin-list">{c.recent.map((e) => <li key={e.id}><Link href={`/admin/enquiries/${e.id}`}>#{e.id} · {e.name}</Link> <span className={`pill pill-${e.status}`}>{STATUS_LABEL[e.status]}</span> <span className="admin-muted">{fmt(e.createdAt)} · {DELIVERY_LABEL[e.delivery]}</span></li>)}</ul>
          )}
        </Card>
        <Card title="Content & settings">
          <ul className="admin-list">
            <li>{customised} content section(s) customised in the database{lastEdit ? <> · last edit {fmt(lastEdit)}</> : null}</li>
            <li>FAQ: {faqTotal === 0 ? 'using built-in defaults (import to edit)' : `${faqPublished} published of ${faqTotal}`}</li>
            <li>Email notifications: {smtp.configured && recipient ? 'SMTP and recipient configured' : `not ready (${[...smtp.missing, ...(recipient ? [] : ['recipient'])].join(', ')})`}</li>
          </ul>
          <p><Link href="/admin/settings">Review settings →</Link></p>
        </Card>
      </div>
    </>
  );
}
