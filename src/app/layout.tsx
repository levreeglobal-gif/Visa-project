import './globals.css';
import type { Metadata } from 'next';
import { siteMetadata } from '@/lib/metadata';
import { publicSite } from '@/lib/server/cms';

export async function generateMetadata(): Promise<Metadata> {
  const site = await publicSite();
  return { ...siteMetadata, metadataBase: new URL(site.url) };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
