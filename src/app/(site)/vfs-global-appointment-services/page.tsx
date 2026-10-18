import { pageContent, pageMetadata } from '@/lib/server/cms';
import ServicePage from '@/components/pages/ServicePage';
import { SERVICE_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';

export const revalidate = 300;
export async function generateMetadata() { return pageMetadata('/vfs-global-appointment-services', SEO_DEFAULTS['/vfs-global-appointment-services']); }
export default async function Page() { return <ServicePage content={await pageContent('service:vfs-global-appointment-services', SERVICE_DEFAULTS['vfs-global-appointment-services'])} />; }
