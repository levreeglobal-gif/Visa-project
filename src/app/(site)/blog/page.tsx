import type { Metadata } from 'next';
import Link from 'next/link';
import { listBlogPosts } from '@/lib/server/blog';
import { pageMetadata } from '@/lib/server/cms';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/blog', { title: 'Visa Guidance & Updates | Roopo Visa', description: 'Practical visa application guidance, preparation checklists and service updates from Roopo Visa.' });
}
export default async function BlogIndex() {
  const posts = await listBlogPosts();
  return <div className="wrap page-shell"><section className="section"><p className="eyebrow">ROOPO VISA JOURNAL</p><h1>Visa guidance, made clearer.</h1><p className="lead">Practical information to help you understand the process and prepare with care.</p>
    {posts.length ? <div className="blog-grid">{posts.map((p) => <article className="service-card" key={p.id}><p className="eyebrow">{p.category}</p><h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3><p>{p.excerpt}</p><div className="blog-taxonomy"><Link href={`/blog/category/${p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}>{p.category}</Link>{p.tags.map((tag) => <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}>#{tag}</Link>)}</div><Link className="text-link" href={`/blog/${p.slug}`}>Read article ↗</Link></article>)}</div> : <div className="content-panel"><h2>New guidance is on the way.</h2><p>Our editorial team is preparing practical resources. Please contact us if you need help with a specific application.</p><Link className="button" href="/contact">Contact our team</Link></div>}
  </section></div>;
}
