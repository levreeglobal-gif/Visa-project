import { pageContent, pageMetadata } from '@/lib/server/cms';
import ServicePage from '@/components/pages/ServicePage';
import { SERVICE_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';

export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/gvcw-appointment-support', SEO_DEFAULTS['/gvcw-appointment-support']); }
export default async function Page() { return <ServicePage content={await pageContent('service:gvcw-appointment-support', SERVICE_DEFAULTS['gvcw-appointment-support'])} />; }
