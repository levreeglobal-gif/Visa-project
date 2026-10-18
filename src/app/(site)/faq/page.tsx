import { pageMetadata, publicFaqs } from '@/lib/server/cms';
import { FAQ_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';
import Link from 'next/link';
export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/faq', SEO_DEFAULTS['/faq']); }
export default async function FAQPage() {
  const faqs = await publicFaqs(FAQ_DEFAULTS);
  return <><section className="page-hero page-hero-navy"><div className="wrap page-hero-grid"><div><p className="eyebrow eyebrow-light">Questions, answered</p><h1>Understand the process <em>before you begin.</em></h1><p className="hero-copy">Straight answers about appointment support, application preparation and expectations.</p></div><div className="faq-hero-mark"><span>Q</span><span>+</span><span>A</span></div></div><div className="wrap hero-foot"><span>Clear information first</span><span>Roopo Visa</span></div></section><section className="section section-paper"><div className="wrap faq-layout"><div><p className="eyebrow">Frequently asked</p><h2>Good to know.</h2><p className="section-copy">If your question is not covered here, contact us with your destination and visa category.</p><Link className="text-link" href="/contact">Ask a question →</Link></div><div className="faq-list">{faqs.map(([q,a],i)=><details key={q} className="faq-item"><summary><span>{String(i+1).padStart(2,'0')}</span>{q}<b aria-hidden="true">+</b></summary><p>{a}</p></details>)}</div></div></section><section className="cta-band"><div className="wrap cta-band-inner"><div><p className="eyebrow">Still have questions?</p><h2>We’re here to help clarify.</h2></div><Link className="button button-light" href="/contact">Contact us ↗</Link></div></section></>;
}
