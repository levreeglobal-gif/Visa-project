'use client';
import Link from 'next/link';
import { useState } from 'react';
import { navLinks } from '@/lib/site';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="mobile-nav">
      <button className="mobile-nav-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
        <span></span><span></span>
      </button>
      {open && <nav id="mobile-navigation" className="mobile-nav-panel" aria-label="Mobile navigation">
        {navLinks.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.name}</Link>)}
        <Link href="/gvcw-appointment-support" onClick={close}>GVCW appointment support</Link>
        <Link href="/ivac-appointment-services#indian-medical-guidance" onClick={close}>Indian medical visa guidance</Link>
        <Link href="/faq" onClick={close}>FAQ</Link>
        <Link href="/privacy-policy" onClick={close}>Privacy policy</Link>
        <Link href="/terms-of-use" onClick={close}>Terms of use</Link>
      </nav>}
    </div>
  );
}
