import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth';
import { DEFS, defFor, type Field } from '@/lib/content-schema';
import { effectiveContent } from '@/lib/server/cms';
import { resetContentAction, saveContentAction } from '../actions';
import { Card, Csrf, Flash, first } from '../_components';

function Input({ f, value, bad }: { f: Field; value: unknown; bad: boolean }) {
  const common = { name: f.name, id: `f-${f.name}`, maxLength: f.kind === 'lines' ? undefined : f.max, required: !f.optional && f.kind !== 'lines', 'aria-invalid': bad || undefined } as const;
  if (f.kind === 'textarea') return <textarea {...common} rows={4} defaultValue={String(value ?? '')} />;
  if (f.kind === 'lines') return <textarea name={f.name} id={`f-${f.name}`} rows={6} defaultValue={Array.isArray(value) ? value.join('\n') : ''} />;
  if (f.kind === 'select') return <select name={f.name} id={`f-${f.name}`} defaultValue={String(value ?? '')}>{(f.options || []).map((o) => <option key={o}>{o}</option>)}</select>;
  return <input {...common} type={f.kind === 'email' ? 'email' : f.kind === 'url' ? 'url' : 'text'} defaultValue={String(value ?? '')} />;
}
export default async function ContentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const key = first(sp.key);
  const def = key ? defFor(key) : undefined;
  if (!def) {
    const groups = ['Home', 'Service pages', 'SEO', 'Site'] as const;
    return (<>
      <h1>Content</h1><Flash ok={first(sp.ok)} err={first(sp.err)} />
      <p className="admin-muted">Pick a section to edit. Saved changes appear on the public site immediately. About, Privacy Policy and Terms body text remain in source code (legal text needs owner/legal review).</p>
      {groups.map((g) => <Card key={g} title={g === 'Site' ? 'Contact information, social links & site settings' : g}><ul className="admin-list">{DEFS.filter((d) => d.group === g).map((d) => <li key={d.key}><Link href={`/admin/content?key=${encodeURIComponent(d.key)}`}>{d.label}</Link></li>)}</ul></Card>)}
    </>);
  }
  const eff = await effectiveContent(def.key);
  const badFields = new Set((first(sp.fields) || '').split(',').filter((n) => def.fields.some((f) => f.name === n)));
  return (<>
    <p><Link href="/admin/content">← All content</Link></p>
    <h1>{def.label}</h1>
    {def.route && <p className="admin-muted">Public page: <a href={def.route} target="_blank" rel="noopener noreferrer">{def.route}</a> · {eff?.customised ? 'customised in database' : 'using built-in defaults'}</p>}
    <Flash ok={first(sp.ok)} err={first(sp.err)} />
    {badFields.size > 0 && <p className="admin-flash admin-flash-err">Check: {[...badFields].map((n) => def.fields.find((f) => f.name === n)?.label).join(', ')}</p>}
    <Card>
      <form action={saveContentAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="key" value={def.key} />
        {def.fields.map((f) => <label key={f.name} htmlFor={`f-${f.name}`}>{f.label}{f.optional ? ' (optional)' : ''}<Input f={f} value={eff?.values[f.name]} bad={badFields.has(f.name)} />{f.help && <small className="admin-muted">{f.help}</small>}</label>)}
        <button className="button" type="submit">Save changes</button>
      </form>
    </Card>
    <Card title="Reset"><form action={resetContentAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="key" value={def.key} /><p className="admin-muted">Removes your edits for this section and returns to the built-in text.</p><button className="button button-small admin-danger" type="submit">Reset to defaults</button></form></Card>
  </>);
}
