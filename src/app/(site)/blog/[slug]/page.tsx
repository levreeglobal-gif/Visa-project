import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, listBlogPosts } from '@/lib/server/blog';
import { publicSite } from '@/lib/server/cms';
export const revalidate = 300;
export async function generateStaticParams() { try { return (await listBlogPosts()).map((p) => ({ slug: p.slug })); } catch { return []; } }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPost(slug); if (!post) return { title: 'Article not found' };
    const site = await publicSite(); const title = post.seoTitle || post.title; const description = post.seoDescription || post.excerpt;
    const canonical = `${site.url}/blog/${post.slug}`;
    return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'article', publishedTime: post.publishedAt?.toISOString(), authors: [post.authorName], images: [post.ogImage || '/og-image.png'] }, twitter: { card: 'summary_large_image', title, description, images: [post.ogImage || '/og-image.png'] } };
  } catch { return { title: 'Visa guidance | Roopo Visa' }; }
}
export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; let post;
  try { post = await getBlogPost(slug); } catch { notFound(); }
  if (!post) notFound();
  const site = await publicSite();
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.seoDescription || post.excerpt, datePublished: post.publishedAt?.toISOString(), dateModified: post.updatedAt.toISOString(), author: { '@type': 'Organization', name: post.authorName }, publisher: { '@type': 'Organization', name: 'Roopo Visa' }, mainEntityOfPage: `${site.url}/blog/${post.slug}`, image: post.ogImage ? [post.ogImage] : [`${site.url}/og-image.png`] };
  return <article className="wrap page-shell blog-article"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><p className="eyebrow">{post.category}</p><h1>{post.title}</h1><p className="lead">{post.excerpt}</p><p className="article-meta">By {post.authorName}{post.publishedAt ? ` · ${new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(post.publishedAt)}` : ''}</p><div className="article-body">{post.body.split(/\n\s*\n/).map((paragraph, i) => paragraph.trim() ? <p key={i}>{paragraph.trim()}</p> : null)}</div>{post.tags.length > 0 && <p className="article-tags">Topics: {post.tags.join(' · ')}</p>}<p><Link className="text-link" href="/blog">← All articles</Link></p><p className="article-disclaimer">Information is general guidance, not a guarantee of visa approval. Requirements can change; confirm current instructions with the relevant authority.</p></article>;
}
