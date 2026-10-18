import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth';
import { listBlogPosts, type BlogPost } from '@/lib/server/blog';
import { saveBlogPostAction } from '../actions';
import DeleteBlogForm from './DeleteBlogForm';
import { Card, Csrf, Flash, first } from '../_components';
export const dynamic = 'force-dynamic';
export default async function BlogAdmin({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin(); const sp = await searchParams; let posts: BlogPost[] = [];
  try { posts = await listBlogPosts(true); } catch { /* database migration may not have run yet */ }
  return <><h1>Blog &amp; SEO</h1><Flash ok={first(sp.ok)} err={first(sp.err)} /><p className="admin-muted">Write helpful, accurate guidance. Drafts remain private; published articles receive canonical metadata and Article structured data.</p>
    <Card title="Create article"><form action={saveBlogPostAction} className="admin-form"><Csrf token={admin.csrf} />
      <label>Article title<input name="title" required minLength={5} maxLength={180} /></label><label>URL slug<input name="slug" maxLength={180} placeholder="Leave blank to generate from title" /></label>
      <label>Excerpt / summary<textarea name="excerpt" required minLength={10} maxLength={500} rows={3} /></label><label>Article body<textarea name="body" required minLength={30} maxLength={100000} rows={12} /><small className="admin-muted">Plain text with blank lines between paragraphs. HTML is not rendered.</small></label>
      <div className="admin-inline"><label>Category<input name="category" maxLength={100} defaultValue="Visa guidance" /></label><label>Author<input name="author_name" maxLength={100} defaultValue="Roopo Visa Editorial Team" /></label></div>
      <label>Tags (comma separated)<input name="tags" maxLength={500} /></label><label>SEO title (max 70 characters)<input name="seo_title" maxLength={70} /></label><label>SEO description (max 200 characters)<textarea name="seo_description" maxLength={200} rows={3} /></label><label>Social/OG image URL or site path<input name="og_image" maxLength={500} placeholder="/og-image.png" /></label>
      <label className="admin-check"><input type="checkbox" name="published" /> Publish immediately</label><button className="button" type="submit">Save article</button></form></Card>
    <h2>Existing articles</h2>{posts.length === 0 && <Card><p>No articles yet. Run the database migration, then create your first article.</p></Card>}
    {posts.map((p) => <Card key={p.id} title={`${p.title}${p.published ? '' : ' · DRAFT'}`}><p className="admin-muted">/{p.slug} · {p.category} · {p.published ? 'Published' : 'Not public'}</p><form action={saveBlogPostAction} className="admin-form"><Csrf token={admin.csrf} /><input type="hidden" name="id" value={p.id} />
      <label>Title<input name="title" required minLength={5} maxLength={180} defaultValue={p.title} /></label><label>URL slug<input name="slug" required maxLength={180} defaultValue={p.slug} /></label><label>Excerpt<textarea name="excerpt" required minLength={10} maxLength={500} rows={3} defaultValue={p.excerpt} /></label><label>Body<textarea name="body" required minLength={30} maxLength={100000} rows={10} defaultValue={p.body} /></label>
      <div className="admin-inline"><label>Category<input name="category" maxLength={100} defaultValue={p.category} /></label><label>Author<input name="author_name" maxLength={100} defaultValue={p.authorName} /></label></div><label>Tags<input name="tags" maxLength={500} defaultValue={p.tags.join(', ')} /></label><label>SEO title<input name="seo_title" maxLength={70} defaultValue={p.seoTitle} /></label><label>SEO description<textarea name="seo_description" maxLength={200} rows={3} defaultValue={p.seoDescription} /></label><label>OG image URL/path<input name="og_image" maxLength={500} defaultValue={p.ogImage} /></label><label className="admin-check"><input type="checkbox" name="published" defaultChecked={p.published} /> Published</label><button className="button button-small" type="submit">Save changes</button></form>
      {p.published && <p><Link href={`/blog/${p.slug}`} target="_blank">View public article ↗</Link></p>}<DeleteBlogForm id={p.id} csrf={admin.csrf} /></Card>)}
  </>;
}
