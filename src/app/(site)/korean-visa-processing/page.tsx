import { pageContent, pageMetadata } from '@/lib/server/cms';
import ServicePage from '@/components/pages/ServicePage';
import { SERVICE_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';

export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/korean-visa-processing', SEO_DEFAULTS['/korean-visa-processing']); }
export default async function Page() { return <ServicePage content={await pageContent('service:korean-visa-processing', SERVICE_DEFAULTS['korean-visa-processing'])} />; }
