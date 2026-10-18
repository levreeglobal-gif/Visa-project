import Link from 'next/link';

export type ServiceCardProps = {
  number: string;
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  tone?: string;
  image: string;
  motionImage: string;
  imageAlt: string;
};

export default function ServiceCard({
  number,
  title,
  description,
  href,
  eyebrow = 'Visa support',
  tone = 'copper',
  image,
  motionImage,
  imageAlt,
}: ServiceCardProps) {
  return (
    <Link href={href} className={`service-card tone-${tone}`}>
      <div className="service-card-art">
        <picture>
          <source srcSet={motionImage} type="image/gif" media="(prefers-reduced-motion: no-preference)" />
          <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
        </picture>
        <i />
      </div>
      <div className="service-card-top"><span>{number}</span><span className="service-card-arrow" aria-hidden="true">↗</span></div>
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="service-description">{description}</p>
      <span className="text-link">Explore service <span aria-hidden="true">→</span></span>
    </Link>
  );
}
