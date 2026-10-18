export const site = {
  name: 'Roopo Visa',
  legalName: 'Roopo Visa',
  tagline: 'Support with clarity. Process with care.',
  description: 'Visa appointment and application support with clear guidance and careful process coordination.',
  url: 'https://visa.roopo.org',
  location: '100/2 West Shewrapara, Mirpur, Dhaka-1216',
  timeZone: 'Asia/Dhaka',
  phones: [
    { label: '01708-399992', tel: '+8801708399992', whatsapp: '8801708399992' },
    { label: '01780-257204', tel: '+8801780257204', whatsapp: '8801780257204' },
    { label: '01681398877', tel: '+8801681398877', whatsapp: '8801681398877' },
  ],
} as const;

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'IVAC', href: '/ivac-appointment-services' },
  { name: 'VFS Global', href: '/vfs-global-appointment-services' },
  { name: 'Korean Visa', href: '/korean-visa-processing' },
  { name: 'All Services', href: '/visa-processing-services' },
  { name: 'Contact', href: '/contact' },
] as const;

export const servicePillars = [
  {
    number: '01',
    title: 'IVAC Appointment Services',
    description: 'Support for tourist, medical, double-entry, student, entry and business visa appointment requests.',
    href: '/ivac-appointment-services',
    eyebrow: 'Appointment support',
    tone: 'copper',
    image: '/media/service-ivac.webp',
    motionImage: '/media/service-ivac.gif',
    imageAlt: 'Historic Indian architecture representing IVAC appointment support',
  },
  {
    number: '02',
    title: 'VFS Global Appointment Services',
    description: 'Appointment support across selected destinations and centres in Bangladesh and India.',
    href: '/vfs-global-appointment-services',
    eyebrow: 'Appointment support',
    tone: 'navy',
    image: '/media/service-vfs.webp',
    motionImage: '/media/service-vfs.gif',
    imageAlt: 'Modern glass building and European flags representing VFS Global services',
  },
  {
    number: '03',
    title: 'Korean Visa Processing',
    description: 'End-to-end application preparation support for tourist, scholarship student and business visa categories.',
    href: '/korean-visa-processing',
    eyebrow: 'Complete processing support',
    tone: 'teal',
    image: '/media/service-korea.webp',
    motionImage: '/media/service-korea.gif',
    imageAlt: 'Traditional Korean architecture and cherry blossoms representing Korean visa support',
  },
] as const;
