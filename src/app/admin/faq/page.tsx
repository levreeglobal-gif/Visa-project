import { requireAdmin } from '@/lib/server/auth';
import { listFaqs } from '@/lib/server/cms';
import { createFaqAction, deleteFaqAction, importFaqAction, saveFaqAction } from '../actions';
import { Card, Csrf, Flash, first } from '../_components';

export default async function FaqAdmin({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const items = await listFaqs(true);
  return (<>
    <h1>FAQ</h1><Flash ok={first(sp.ok)} err={first(sp.err)} />
    {items.length === 0 && <Card title="Using built-in FAQ"><p className="admin-muted">The public FAQ currently shows the built-in questions. Import them to edit, reorder or hide each one.</p>
      <form action={importFaqAction}><Csrf token={admin.csrf} /><button className="button button-small" type="submit">Import built-in FAQ for editing</button></form></Card>}
    <Card title="Add a question"><form action={createFaqAction} className="admin-form"><Csrf token={admin.csrf} />
      <label>Question<input name="question" required minLength={5} maxLength={300} /></label>
      <label>Answer<textarea name="answer" required minLength={5} maxLength={2000} rows={4} /></label>
      <button className="button button-small" type="submit">Add</button></form></Card>
    {items.map((f) => <Card key={f.id} title={`#${f.id}${f.published ? '' : ' (hidden)'}`}>
      <form action={saveFaqAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="id" value={f.id} />
        <label>Question<input name="question" required minLength={5} maxLength={300} defaultValue={f.question} /></label>
        <label>Answer<textarea name="answer" required minLength={5} maxLength={2000} rows={4} defaultValue={f.answer} /></label>
        <div className="admin-inline"><label>Order<input name="sort_order" type="number" defaultValue={f.sortOrder} step={1} /></label>
          <label className="admin-check"><input type="checkbox" name="published" defaultChecked={f.published} /> Published</label>
          <button className="button button-small" type="submit">Save</button></div></form>
      <form action={deleteFaqAction}><Csrf token={admin.csrf} /><input type="hidden" name="id" value={f.id} /><button className="admin-link-button admin-danger-text" type="submit">Delete</button></form>
    </Card>)}
  </>);
}
