import { pageContent, pageMetadata } from '@/lib/server/cms';
import ServicePage from '@/components/pages/ServicePage';
import { SERVICE_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';

export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/ivac-appointment-services', SEO_DEFAULTS['/ivac-appointment-services']); }
export default async function Page() { return <ServicePage content={await pageContent('service:ivac-appointment-services', SERVICE_DEFAULTS['ivac-appointment-services'])} />; }
