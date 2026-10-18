import Link from 'next/link';

export type ServicePageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  accent: 'copper' | 'navy' | 'teal';
  highlights: string[];
  scopeTitle: string;
  scope: string[];
  process?: string[];
  note?: string;
  articleTitle?: string;
  articleIntro?: string;
  articlePoints?: string[];
};

export default function ServicePage({ content }: { content: ServicePageContent }) {
  return (
    <>
      <section className={`page-hero page-hero-${content.accent}`}>
        <div className="wrap page-hero-grid">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="hero-copy">{content.intro}</p>
            <div className="hero-actions"><Link className="button" href="/contact">Discuss your application <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/visa-processing-services">View all services →</Link></div>
          </div>
          <div className="hero-orbit" aria-hidden="true"><span className="orbit-ring orbit-one"></span><span className="orbit-ring orbit-two"></span><span className="orbit-core">RV<span>ROOPO VISA</span></span><span className="orbit-label orbit-label-a">CLEAR GUIDANCE</span><span className="orbit-label orbit-label-b">CAREFUL PROCESS</span></div>
        </div>
        <div className="wrap hero-foot"><span>Support with clarity. Process with care.</span><span>Application support • Process coordination</span></div>
      </section>
      <section className="section section-paper">
        <div className="wrap detail-grid">
          <div className="detail-intro"><p className="eyebrow">What we support</p><h2>Clear steps.<br/><em>Careful preparation.</em></h2><p>Every application is different. We help you understand the relevant steps, organise information and prepare carefully based on the details you provide and the current requirements you verify.</p></div>
          <div className="detail-list">{content.highlights.map((item, i) => <div className="detail-item" key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">Service scope</p><h2>{content.scopeTitle}</h2></div>
          <div className="scope-grid">{content.scope.map((item, i) => <div className="scope-item" key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div>
          {content.note && <p className="notice">{content.note}</p>}
        </div>
      </section>
      {content.articleTitle && <section className="section section-paper" id="indian-medical-guidance">
        <div className="wrap medical-guidance-article">
          <p className="eyebrow">Guidance article</p>
          <h2>{content.articleTitle}</h2>
          {content.articleIntro && <p className="section-copy">{content.articleIntro}</p>}
          {content.articlePoints && <ul>{content.articlePoints.map((point) => <li key={point}>{point}</li>)}</ul>}
          <p className="notice">Hospital acceptance, medical appointments, visa eligibility and visa decisions are determined by the relevant hospital and official authorities. Confirm current requirements directly before making payments or travel plans.</p>
        </div>
      </section>}
      <section className="section section-ink">
        <div className="wrap process-layout">
          <div><p className="eyebrow eyebrow-light">A considered process</p><h2>Know what happens <em>next.</em></h2><p className="section-copy">We aim to make the process easier to understand, with clear communication and realistic expectations at each stage.</p></div>
          <div className="process-list">{(content.process || ['Share your destination, visa category and intended timeline.', 'Review the applicable requirements and your available documents.', 'Receive guidance on the next steps and any gaps to address.', 'Proceed with your application through the relevant official channel.']).map((item, i) => <div className="process-item" key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div>
        </div>
      </section>
      <section className="cta-band"><div className="wrap cta-band-inner"><div><p className="eyebrow">Start with a conversation</p><h2>Let’s understand your next step.</h2></div><Link className="button button-light" href="/contact">Contact Roopo Visa <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
