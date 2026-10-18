import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#182d42',
    theme_color: '#a96e49',
    icons: [{ src: '/roopo-visa-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
