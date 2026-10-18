import type { MetadataRoute } from 'next';
import { publicSite } from '@/lib/server/cms';
import { listBlogPosts } from '@/lib/server/blog';
export const revalidate = 300;
const routes = [
  '', '/about', '/vfs-global-appointment-services', '/gvcw-appointment-support',
  '/ivac-appointment-services', '/korean-visa-processing', '/visa-processing-services',
  '/faq', '/contact', '/privacy-policy', '/terms-of-use',
];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await publicSite();
  const pages = routes.map((route, index) => ({ url: `${site.url}${route}`, changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly', priority: index === 0 ? 1 : ['/ivac-appointment-services', '/vfs-global-appointment-services', '/korean-visa-processing'].includes(route) ? 0.9 : 0.7 }));
  let posts: Awaited<ReturnType<typeof listBlogPosts>> = [];
  try { posts = await listBlogPosts(); } catch { /* keep the main sitemap available if database is offline */ }
  const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const categories = [...new Set(posts.map((post) => slugify(post.category)))];
  const tags = [...new Set(posts.flatMap((post) => post.tags.map(slugify)))];
  return [...pages, { url: `${site.url}/blog`, changeFrequency: 'weekly' as const, priority: 0.75 }, ...categories.map((category) => ({ url: `${site.url}/blog/category/${category}`, changeFrequency: 'monthly' as const, priority: 0.45 })), ...tags.map((tag) => ({ url: `${site.url}/blog/tag/${tag}`, changeFrequency: 'monthly' as const, priority: 0.4 })), ...posts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.65 }))];
}
