import Link from 'next/link';
import { navLinks } from '@/lib/site';
import MobileNav from '@/components/layout/MobileNav';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner wrap">
        <Link href="/" className="brand" aria-label="Roopo Visa home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-wordmark"><strong>ROOPO</strong><span>VISA</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((item) => <Link key={item.href} href={item.href} className={(item.name === 'IVAC' || item.name === 'VFS Global' || item.name === 'Korean Visa') ? 'nav-priority' : ''}>{item.name}</Link>)}
        </nav>
        <Link href="/contact" className="button button-small header-cta">Talk to our team <span aria-hidden="true">↗</span></Link>
        <MobileNav />
      </div>
      <div className="header-rule" />
    </header>
  );
}
