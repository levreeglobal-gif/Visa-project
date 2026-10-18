import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth';
import { listEnquiries, PAGE_SIZE, STATUSES, STATUS_LABEL, DELIVERY_LABEL, type Delivery } from '@/lib/server/enquiries';
import { Card, Flash, fmt, first } from '../_components';

export default async function Enquiries({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const f = { q: first(sp.q) || '', status: first(sp.status) || '', delivery: first(sp.delivery) || '', page: Number(first(sp.page)) || 1 };
  const { rows, total, page } = await listEnquiries(f);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (p: number) => { const u = new URLSearchParams(); if (f.q) u.set('q', f.q); if (f.status) u.set('status', f.status); if (f.delivery) u.set('delivery', f.delivery); u.set('page', String(p)); return `?${u}`; };
  return (
    <>
      <h1>Enquiries</h1>
      <Flash ok={first(sp.ok)} err={first(sp.err)} />
      <Card>
        <form method="get" className="admin-filters">
          <label>Search<input name="q" defaultValue={f.q} maxLength={100} placeholder="Name, email, phone, message" /></label>
          <label>Status<select name="status" defaultValue={f.status}><option value="">All</option>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
          <label>Email delivery<select name="delivery" defaultValue={f.delivery}><option value="">All</option>{(Object.keys(DELIVERY_LABEL) as Delivery[]).map((d) => <option key={d} value={d}>{DELIVERY_LABEL[d]}</option>)}</select></label>
          <button className="button button-small" type="submit">Filter</button><Link href="/admin/enquiries" className="admin-muted">Clear</Link>
        </form>
      </Card>
      <Card title={`${total} enquir${total === 1 ? 'y' : 'ies'}`}>
        {rows.length === 0 ? <p className="admin-muted">No enquiries match.</p> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>#</th><th>Received</th><th>Name</th><th>Service</th><th>Status</th><th>Email</th></tr></thead><tbody>
            {rows.map((e) => <tr key={e.id}><td><Link href={`/admin/enquiries/${e.id}`}>{e.id}</Link></td><td>{fmt(e.createdAt)}</td><td><Link href={`/admin/enquiries/${e.id}`}>{e.name}</Link><br /><span className="admin-muted">{e.email}</span></td><td>{e.service || '—'}</td><td><span className={`pill pill-${e.status}`}>{STATUS_LABEL[e.status]}</span></td><td>{DELIVERY_LABEL[e.delivery]}</td></tr>)}
          </tbody></table></div>
        )}
        <p className="admin-pager">{page > 1 && <Link href={qs(page - 1)}>← Previous</Link>} Page {page} of {pages} {page < pages && <Link href={qs(page + 1)}>Next →</Link>}</p>
      </Card>
    </>
  );
}
