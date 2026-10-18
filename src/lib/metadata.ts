import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Roopo Visa | Visa Support with Clarity and Care', template: '%s | Roopo Visa' },
  description: site.description,
  keywords: ['Roopo Visa', 'IVAC appointment support', 'VFS Global appointment support', 'Korean visa processing', 'visa application support Bangladesh'],
  authors: [{ name: 'Roopo Visa' }],
  creator: 'Roopo Visa',
  icons: { icon: '/roopo-visa-mark.svg' },
  openGraph: {
    title: 'Roopo Visa | Support with clarity. Process with care.',
    description: site.description,
    url: site.url,
    siteName: 'Roopo Visa',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Roopo Visa — visa application support' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roopo Visa | Visa Support with Clarity and Care',
    description: site.description,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};
