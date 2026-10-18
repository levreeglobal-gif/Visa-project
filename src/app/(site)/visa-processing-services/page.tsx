import { pageContent, pageMetadata } from '@/lib/server/cms';
import ServicePage from '@/components/pages/ServicePage';
import { SERVICE_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';

export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/visa-processing-services', SEO_DEFAULTS['/visa-processing-services']); }
export default async function Page() { return <ServicePage content={await pageContent('service:visa-processing-services', SERVICE_DEFAULTS['visa-processing-services'])} />; }
