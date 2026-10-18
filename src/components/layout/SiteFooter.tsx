import Link from 'next/link';
import { navLinks } from '@/lib/site';
import { publicSite } from '@/lib/server/cms';

export default async function SiteFooter() {
  const site = await publicSite();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand brand-light">
            <span className="brand-mark" aria-hidden="true">R</span>
            <span className="brand-wordmark"><strong>ROOPO</strong><span>VISA</span></span>
          </Link>
          <p>{site.tagline}</p>
          <p className="footer-note">Independent visa application support. Final decisions remain with the relevant authorities.</p>
        </div>
        <div><h3>Explore</h3>{navLinks.slice(0,6).map((n) => <Link key={n.href} href={n.href}>{n.name}</Link>)}</div>
        <div><h3>More</h3><Link href="/gvcw-appointment-support">GVCW appointment support</Link><Link href="/ivac-appointment-services#indian-medical-guidance">Indian medical visa guidance</Link><Link href="/faq">FAQs</Link><Link href="/blog">Visa guidance &amp; updates</Link><Link href="/privacy-policy">Privacy policy</Link><Link href="/terms-of-use">Terms of use</Link></div>
        <div><h3>Contact</h3><p>{site.location}</p>{site.phones.map((p) => <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>)}{site.publicEmail && <a href={`mailto:${site.publicEmail}`}>{site.publicEmail}</a>}{site.social.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a>)}<Link className="footer-contact-link" href="/contact">Contact options ↗</Link></div>
      </div>
      <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Roopo Visa</span><span>Support with clarity. Process with care.</span></div>
    </footer>
  );
}
