import { redirect } from 'next/navigation';

/** Legacy URL retained only to route existing links to the canonical IVAC guidance. */
export default function LegacyIndianMedicalSupportPage(): never {
  redirect('/ivac-appointment-services#indian-medical-guidance');
}
