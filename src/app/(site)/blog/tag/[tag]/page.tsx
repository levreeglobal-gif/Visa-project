import type { Metadata } from 'next';
import Link from 'next/link';
import { listBlogPosts } from '@/lib/server/blog';
import { publicSite } from '@/lib/server/cms';
export const revalidate = 300;
const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export async function generateStaticParams() { try { return [...new Set((await listBlogPosts()).flatMap((p) => p.tags.map(slugify)))].map((tag) => ({ tag })); } catch { return []; } }
export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> { const { tag } = await params; const label = tag.split('-').join(' '); const site = await publicSite(); return { title: `Articles about ${label}`, description: `Published Roopo Visa guidance tagged ${label}.`, alternates: { canonical: `${site.url}/blog/tag/${tag}` } }; }
export default async function BlogTag({ params }: { params: Promise<{ tag: string }> }) { const { tag } = await params; const posts = (await listBlogPosts()).filter((p) => p.tags.some((t) => slugify(t) === tag)); return <div className="wrap page-shell"><section className="section"><p className="eyebrow">BLOG TOPIC</p><h1>Articles tagged “{tag.split('-').join(' ')}”</h1><div className="blog-grid">{posts.map((p) => <article className="service-card" key={p.id}><p className="eyebrow">{p.category}</p><h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3><p>{p.excerpt}</p><Link className="text-link" href={`/blog/${p.slug}`}>Read article ↗</Link></article>)}</div>{posts.length === 0 && <p>No published articles with this tag yet.</p>}<p><Link className="text-link" href="/blog">← All articles</Link></p></section></div>; }
