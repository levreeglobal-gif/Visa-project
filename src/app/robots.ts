import type { MetadataRoute } from 'next';
import { publicSite } from '@/lib/server/cms';
export const revalidate = 300;
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await publicSite();
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }, sitemap: `${site.url}/sitemap.xml` };
}
