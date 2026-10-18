import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth';
import { getEnquiry, listNotes, STATUSES, STATUS_LABEL, DELIVERY_LABEL } from '@/lib/server/enquiries';
import { addNoteAction, deleteEnquiryAction, updateStatusAction } from '../../actions';
import { Card, Csrf, Flash, fmt, first } from '../../_components';

export default async function EnquiryDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin();
  const { id } = await params; const sp = await searchParams;
  const e = await getEnquiry(Number(id));
  if (!e) notFound();
  const notes = await listNotes(e.id);
  return (
    <>
      <p><Link href="/admin/enquiries">← All enquiries</Link></p>
      <h1>Enquiry #{e.id}</h1>
      <Flash ok={first(sp.ok)} err={first(sp.err)} />
      <div className="admin-grid">
        <Card title="Details">
          <dl className="admin-dl">
            <dt>Name</dt><dd>{e.name}</dd><dt>Email</dt><dd><a href={`mailto:${e.email}`}>{e.email}</a></dd><dt>Phone</dt><dd>{e.phone || '—'}</dd>
            <dt>Service</dt><dd>{e.service || '—'}</dd><dt>Received</dt><dd>{fmt(e.createdAt)}</dd><dt>Last updated</dt><dd>{fmt(e.updatedAt)}</dd>
            <dt>Email notification</dt><dd>{DELIVERY_LABEL[e.delivery]}{e.deliveryDetail ? <span className="admin-muted"> — {e.deliveryDetail}</span> : null}</dd>
          </dl>
          <h3>Message</h3><p className="admin-message">{e.message}</p>
        </Card>
        <div>
          <Card title="Status">
            <form action={updateStatusAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="id" value={e.id} />
              <label>Status<select name="status" defaultValue={e.status}>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
              <button className="button button-small" type="submit">Update status</button></form>
          </Card>
          <Card title="Internal notes">
            <form action={addNoteAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="id" value={e.id} />
              <label>Add a note<textarea name="note" required maxLength={2000} rows={3} /></label><button className="button button-small" type="submit">Add note</button></form>
            {notes.length === 0 ? <p className="admin-muted">No notes yet.</p> : <ul className="admin-list">{notes.map((n) => <li key={n.id}><span className="admin-message">{n.note}</span><br /><span className="admin-muted">{n.author || 'Admin'} · {fmt(n.createdAt)}</span></li>)}</ul>}
          </Card>
          <Card title="Delete enquiry">
            <form action={deleteEnquiryAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="id" value={e.id} />
              <label className="admin-check"><input type="checkbox" name="confirm" value="yes" /> Permanently delete this enquiry and its notes</label>
              <button className="button button-small admin-danger" type="submit">Delete</button></form>
          </Card>
        </div>
      </div>
    </>
  );
}
