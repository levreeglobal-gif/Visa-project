import Link from 'next/link';
import { servicePillars, site } from '@/lib/site';
import { pageContent, pageMetadata } from '@/lib/server/cms';
import { HOME_DEFAULTS } from '@/lib/content-defaults';
import { listBlogPosts } from '@/lib/server/blog';
import ServiceCard from '@/components/ui/ServiceCard';
import LowResourceReveal from '@/components/ui/LowResourceReveal';

export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/', {}); }


const quickServices = [
  { title: 'GVCW appointment support', text: 'Support for India → Greece appointment requests.', href: '/gvcw-appointment-support', tag: 'GVCW' },
  { title: 'Other visa processing', text: 'Selected tourist, business, student, entry and medical categories.', href: '/visa-processing-services', tag: 'Visa processing' },
];

export default async function Home() {
  const c = await pageContent('home', HOME_DEFAULTS);
  const latestPosts = (await listBlogPosts()).slice(0, 3);
  return (
    <>
      <section className="home-hero home-hero-cinematic" id="top">
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/media/roopo-hero-poster.jpg" aria-hidden="true">
          <source src="/media/roopo-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-shade" aria-hidden="true"></div>
        <div className="hero-route-art" aria-hidden="true"><span></span><span></span><span></span></div>
        <div className="wrap home-hero-grid cinematic-hero-grid">
          <div className="home-hero-copy cinematic-hero-copy">
            <div className="eyebrow eyebrow-light"><span className="status-dot"></span> {c.heroEyebrow}</div>
            <h1>{c.heroLine1}<br/><em>{c.heroLine2Prefix} {c.heroEm}</em></h1>
            <p className="home-intro">{c.heroIntro}</p>
            <div className="hero-actions"><Link href="/contact" className="button hero-primary-button">{c.ctaPrimary} <span aria-hidden="true">↗</span></Link><Link href="/visa-processing-services" className="hero-secondary hero-outline-link">{c.ctaSecondary} <span aria-hidden="true">→</span></Link></div>
            <div className="hero-proof"><span>01 <b>Clear guidance</b></span><span>02 <b>Careful process</b></span><span>03 <b>Human support</b></span></div>
          </div>
          <div className="hero-side-note" aria-hidden="true"><span>PEOPLE</span><span>PLACES</span><span>POSSIBILITIES</span><i></i><small>ROOPO VISA · BANGLADESH</small></div>
        </div>
        <div className="wrap hero-bottom-line"><span>{site.tagline}</span><a href="#priority-services">Explore priority services <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="section section-paper" id="priority-services">
        <div className="wrap">
          <div className="section-heading section-heading-row"><div><p className="eyebrow">Our priority services</p><h2>Three clear ways<br/>to <em>move forward.</em></h2></div><p className="section-intro">{c.priorityIntro}</p></div>
          <div className="service-grid priority-grid">{servicePillars.map((service) => <LowResourceReveal key={service.href}><ServiceCard {...service} /></LowResourceReveal>)}</div>
        </div>
      </section>

      <section className="home-subhero home-subhero-medical" id="indian-medical-visa">
        <div className="wrap home-subhero-grid">
          <div className="home-subhero-index">01 <span>DEDICATED SUPPORT</span></div>
          <div className="home-subhero-copy">
            <p className="eyebrow">Indian medical visa processing</p>
            <h2>Carefully prepared support for <em>medical travel to India.</em></h2>
            <p>Guidance for Indian Medical Visa preparation, hospital-related paperwork and appointment coordination where applicable. We help clarify the steps and identify what needs confirmation from the hospital or relevant authority.</p>
            <Link className="button" href="/ivac-appointment-services#indian-medical-guidance">Explore medical visa guidance <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="home-subhero-side"><span>MEDICAL TRAVEL</span><span>DOCUMENT PREPARATION</span><span>PROCESS COORDINATION</span></div>
        </div>
      </section>

      <section className="home-subhero home-subhero-korea" id="korean-student-bank-loan">
        <div className="wrap home-subhero-grid">
          <div className="home-subhero-index">02 <span>STUDENT SUPPORT</span></div>
          <div className="home-subhero-copy">
            <p className="eyebrow">South Korean student bank loan cooperation</p>
            <h2>Explore study plans with <em>clearer financial next steps.</em></h2>
            <p>Information and coordination support for students exploring bank-loan cooperation in connection with study in South Korea. Eligibility, financing terms and approval remain subject to the participating bank’s assessment and requirements.</p>
            <Link className="button" href="/korean-visa-processing">Discuss Korean student visa support <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="home-subhero-side"><span>SOUTH KOREA</span><span>STUDENT PATHWAY</span><span>BANK ASSESSMENT APPLIES</span></div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="wrap split-feature">
          <div><p className="eyebrow eyebrow-light">A clear process</p><h2>Less uncertainty.<br/><em>Better preparation.</em></h2><p className="section-copy">{c.processCopy}</p><Link className="text-link text-link-light" href="/about">Learn about our approach →</Link></div>
          <div className="steps-stack"><div className="step-card"><span>01</span><div><h3>Understand</h3><p>Clarify your destination, purpose and timeline.</p></div><b>↗</b></div><div className="step-card"><span>02</span><div><h3>Prepare</h3><p>Review information and organise supporting documents.</p></div><b>↗</b></div><div className="step-card"><span>03</span><div><h3>Proceed</h3><p>Know the next action and where the official decision sits.</p></div><b>↗</b></div></div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">More ways we can help</p><h2>Support for your <em>next step.</em></h2></div>
          <div className="service-grid quick-grid">{quickServices.map((s, i) => <LowResourceReveal key={s.href}><Link className="quick-card" href={s.href}><span className="quick-index">0{i+1} / {s.tag}</span><h3>{s.title}</h3><p>{s.text}</p><span className="text-link">Explore service →</span></Link></LowResourceReveal>)}</div>
        </div>
      </section>

      <section className="section section-paper home-blog-section" id="latest-guidance">
        <div className="wrap">
          <div className="section-heading section-heading-row home-blog-heading">
            <div><p className="eyebrow">Insights & updates</p><h2>Guidance for your <em>next step.</em></h2></div>
            <Link className="text-link" href="/blog">Explore the blog →</Link>
          </div>
          {latestPosts.length ? (
            <div className="home-blog-grid">
              {latestPosts.map((post) => (
                <article className="home-blog-card" key={post.id}>
                  {post.ogImage ? <Link href={`/blog/${post.slug}`} className="home-blog-image-link" aria-label={`Read ${post.title}`}><img className="home-blog-image" src={post.ogImage} alt="" loading="lazy" decoding="async" /></Link> : null}
                  <div className="home-blog-card-content">
                    <p className="eyebrow">{post.category}</p>
                    <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                    <p>{post.excerpt}</p>
                    <Link className="text-link" href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">↗</span></Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="home-blog-empty"><div><h3>Practical guidance is on the way.</h3><p>Our journal will share preparation tips, visa process explainers and important updates. Need help now? Contact our team.</p></div><Link className="button" href="/contact">Ask a question <span aria-hidden="true">↗</span></Link></div>
          )}
        </div>
      </section>

      <section className="section section-paper faq-preview">
        <div className="wrap faq-preview-grid"><div><p className="eyebrow">Before you begin</p><h2>Good support starts with <em>good questions.</em></h2><p className="section-copy">Find answers about our process, appointment support and what to prepare before contacting us.</p><Link className="text-link" href="/faq">Browse frequently asked questions →</Link></div><div className="faq-highlight"><span>Q / A</span><h3>{c.faqHighlightQ}</h3><p>{c.faqHighlightA}</p><Link href="/faq">Read more <span aria-hidden="true">↗</span></Link></div></div>
      </section>
      <section className="cta-band"><div className="wrap cta-band-inner"><div><p className="eyebrow">Your next step starts here</p><h2>{c.ctaBandTitle}</h2><p>{c.ctaBandText}</p></div><Link className="button button-light" href="/contact">Talk to Roopo Visa <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
