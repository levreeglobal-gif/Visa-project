// Source-controlled defaults. The database overrides these field-by-field; "Reset to defaults" in /admin restores them.
import type { ServicePageContent } from '@/components/pages/ServicePage';

export const SERVICE_DEFAULTS: Record<string, ServicePageContent> = {
  "vfs-global-appointment-services": {
    "eyebrow": "Appointment support / VFS Global",
    "title": "A clearer path to your VFS appointment.",
    "intro": "Appointment support for selected destinations and centres across Bangladesh and India. We help you understand the requested route and organise the next steps.",
    "accent": "navy",
    "highlights": [
      "Clarify the destination, application category and centre relevant to your case.",
      "Review the appointment request details you provide and explain the next practical steps.",
      "Keep communication clear about availability, requirements and what remains outside our control."
    ],
    "scopeTitle": "Selected VFS Global routes",
    "scope": [
      "Bangladesh → Italy — Dhaka Centre (student and family reunion appointment support, subject to current route availability).",
      "Bangladesh → Italy — Sylhet Centre (student and family reunion appointment support, subject to current route availability).",
      "India → Bulgaria — selected centres; category and centre details must be confirmed before proceeding.",
      "India → Latvia — selected centres; category and centre details must be confirmed before proceeding.",
      "India → Portugal — appointment support, subject to current official process."
    ],
    "note": "Appointment availability, rules and final decisions are controlled by the relevant official service provider and authorities. We do not guarantee a slot or visa outcome."
  },
  "gvcw-appointment-support": {
    "eyebrow": "Appointment support / GVCW",
    "title": "Greece appointment support, with clearer next steps.",
    "intro": "Support for India → Greece appointment requests. We help you understand the request and organise the information needed to proceed through the relevant official process.",
    "accent": "teal",
    "highlights": [
      "Confirm that your intended route is India → Greece before starting.",
      "Organise the information needed for the appointment request.",
      "Receive clear updates about the next step and what still needs confirmation."
    ],
    "scopeTitle": "India → Greece",
    "scope": [
      "GVCW appointment support for Greece applications from India.",
      "Initial review of the route and appointment request details.",
      "Guidance on the next step based on the applicable official process."
    ],
    "note": "Appointment availability and any resulting visa decision are not controlled by Roopo Visa and cannot be guaranteed."
  },
  "ivac-appointment-services": {
    "articleTitle": "Indian Medical Visa Processing: preparation and coordination",
    "articleIntro": "Applicants travelling to India for medical care may need to coordinate information from the treating hospital alongside the applicable visa application process. Roopo Visa can help organise preparation steps and clarify what should be confirmed with the hospital or official channel.",
    "articlePoints": [
      "Clarify the purpose of medical travel and identify the relevant application pathway.",
      "Organise available hospital and applicant information for review before submission.",
      "Confirm any hospital letters, appointment details and supporting records directly with the hospital.",
      "Check current official instructions for the applicable mission and submission process before proceeding."
    ],
    "eyebrow": "Appointment support / IVAC",
    "title": "IVAC appointment support for your intended visa category.",
    "intro": "Support for applicants seeking help with IVAC-related appointment requests. We clarify the visa category and help organise the next step without promising appointment availability.",
    "accent": "copper",
    "highlights": [
      "Clarify the intended visa category and requested mission.",
      "Help organise the information relevant to the appointment request.",
      "Explain next steps and communicate what is confirmed versus still pending."
    ],
    "scopeTitle": "Supported categories",
    "scope": [
      "Tourist Visa",
      "Medical Visa",
      "Double Entry Visa",
      "Entry Visa",
      "Student Visa",
      "Business Visa"
    ],
    "note": "Mission, eligibility, appointment availability, documents and official procedures may vary. Confirm current details before paying or submitting an application."
  },
  "korean-visa-processing": {
    "eyebrow": "Complete application support / South Korea",
    "title": "Korean visa processing, carefully prepared.",
    "intro": "Application preparation and process coordination for South Korea Tourist, scholarship Student and Business visa categories. Support is tailored to the purpose of travel and the applicant’s circumstances.",
    "accent": "teal",
    "highlights": [
      "Discuss the purpose of travel, intended visa category and timeline.",
      "Review the information and supporting documents available from the applicant.",
      "Identify gaps and organise the application preparation steps.",
      "Explain submission and follow-up steps based on the current official process."
    ],
    "scopeTitle": "Three Korean visa pathways",
    "scope": [
      "Tourist Visa — preparation support for applicants travelling for tourism or a short visit, subject to eligibility and current rules.",
      "Student Visa (Scholarship) — support organising scholarship-related information and other applicable application materials; requirements depend on the programme and visa type.",
      "Business Visa — preparation support for business-purpose travel, including organising relevant invitation or business documents where applicable."
    ],
    "process": [
      "Tell us whether you need a tourist, scholarship student or business visa and share your intended timeline.",
      "We review the details you provide and identify the information or documents that may need attention.",
      "We help organise the application preparation and explain the next steps against current official requirements.",
      "You submit through the applicable official channel; decisions remain with the relevant Korean authorities."
    ],
    "note": "Roopo Visa provides independent application support and is not an embassy or government office. Eligibility, required documents, processing time and visa decisions are determined by the relevant authorities. No approval is guaranteed."
  },
  "visa-processing-services": {
    "eyebrow": "Visa processing support",
    "title": "Practical support across selected visa categories.",
    "intro": "We help applicants organise information and understand the next steps for selected tourist, business, student, entry and medical visa routes. Exact requirements must be confirmed for each case.",
    "accent": "copper",
    "highlights": [
      "Identify the destination and purpose before preparing an application.",
      "Review available information and organise the required next steps.",
      "Keep the scope clear and flag details that must be confirmed through official guidance."
    ],
    "scopeTitle": "Selected destinations and categories",
    "scope": [
      "India (Dhaka Mission only): Tourist, Medical, Double Entry, Business, Entry and Student.",
      "China: Tourist and Business.",
      "Malaysia: Tourist.",
      "Singapore: Tourist.",
      "Thailand: Tourist.",
      "Indonesia: Tourist.",
      "Maldives: Tourist.",
      "Nepal: Tourist.",
      "South Korea: Tourist, Student (Scholarship) and Business — see the dedicated Korean visa processing page."
    ],
    "note": "This list describes support categories, not eligibility or guaranteed availability. Requirements and submission procedures can change; verify current official guidance before applying."
  },
  "indian-medical-travel-support": {
    "eyebrow": "Medical travel / India",
    "title": "Indian medical travel support, with care at every step.",
    "intro": "Support for applicants planning medical travel to India, including Indian Medical Visa preparation support and coordination around hospital-related paperwork and appointments where available.",
    "accent": "navy",
    "highlights": [
      "Discuss the medical travel purpose and the information already available.",
      "Help organise the Indian Medical Visa preparation steps.",
      "Support coordination for hospital Ayush letters and doctor appointments where applicable.",
      "Explain which details need direct confirmation from the hospital or official authority."
    ],
    "scopeTitle": "Support areas",
    "scope": [
      "Indian Medical Visa application preparation support.",
      "Hospital Ayush Letter coordination support, where applicable.",
      "Doctor appointment coordination support, subject to hospital availability.",
      "Hospital details and lists are shared only when verified."
    ],
    "note": "Medical decisions, hospital acceptance, appointment availability and visa decisions are made by the relevant providers and authorities. Do not send medical records or passport scans through the general enquiry form."
  }
};

export const SEO_DEFAULTS: Record<string, { title: string; description: string }> = {
  "/vfs-global-appointment-services": {
    "title": "A clearer path to your VFS appointment.",
    "description": "Appointment support for selected destinations and centres across Bangladesh and India. We help you understand the requested route and organise the next steps."
  },
  "/gvcw-appointment-support": {
    "title": "Greece appointment support, with clearer next steps.",
    "description": "Support for India → Greece appointment requests. We help you understand the request and organise the information needed to proceed through the relevant official process."
  },
  "/ivac-appointment-services": {
    "title": "IVAC appointment support for your intended visa category.",
    "description": "Support for applicants seeking help with IVAC-related appointment requests. We clarify the visa category and help organise the next step without promising appointment availability."
  },
  "/korean-visa-processing": {
    "title": "Korean visa processing, carefully prepared.",
    "description": "Application preparation and process coordination for South Korea Tourist, scholarship Student and Business visa categories. Support is tailored to the purpose of travel and the applicant’s circumstances."
  },
  "/visa-processing-services": {
    "title": "Practical support across selected visa categories.",
    "description": "We help applicants organise information and understand the next steps for selected tourist, business, student, entry and medical visa routes. Exact requirements must be confirmed for each case."
  },
  "/indian-medical-travel-support": {
    "title": "Indian medical travel support, with care at every step.",
    "description": "Support for applicants planning medical travel to India, including Indian Medical Visa preparation support and coordination around hospital-related paperwork and appointments where available."
  },
  "/": {
    "title": "",
    "description": ""
  },
  "/blog": {
    "title": "Visa Guidance & Updates | Roopo Visa",
    "description": "Practical visa application guidance, preparation checklists and service updates from Roopo Visa."
  },
  "/about": {
    "title": "About Us",
    "description": ""
  },
  "/faq": {
    "title": "Frequently Asked Questions",
    "description": ""
  },
  "/contact": {
    "title": "Contact Roopo Visa",
    "description": ""
  },
  "/privacy-policy": {
    "title": "Privacy Policy",
    "description": ""
  },
  "/terms-of-use": {
    "title": "Terms of Use",
    "description": ""
  }
};

export const FAQ_DEFAULTS: readonly (readonly [string, string])[] = [
  [
    "Does Roopo Visa guarantee an appointment or visa approval?",
    "No. We provide appointment and application support. Appointment availability and visa decisions are controlled by the relevant providers and authorities."
  ],
  [
    "Which services have the highest priority?",
    "IVAC appointment support, VFS Global appointment support and Korean visa processing are presented as the three priority service areas."
  ],
  [
    "Which Korean visa categories can you help with?",
    "We provide preparation and process coordination support for Korean Tourist Visa, Student Visa (Scholarship) and Business Visa. Exact requirements depend on the applicant and current official rules."
  ],
  [
    "What should I share when I first contact you?",
    "Start with your destination, intended visa category, purpose of travel and approximate timeline. Do not send passport scans, bank details or medical records through the general contact form."
  ],
  [
    "Can you confirm current document requirements?",
    "We can help you identify the relevant steps, but requirements can change. Important details should be confirmed against the current instructions of the relevant authority or official service provider."
  ],
  [
    "How do I know the service fee and next step?",
    "Contact the team with your route and category. Ask for the scope, applicable fee, payment terms and what is included in writing before proceeding."
  ],
  [
    "Are you an embassy or government office?",
    "No. Roopo Visa is an independent visa application support service and does not make official visa decisions."
  ]
];

export const HOME_DEFAULTS = {
  heroEyebrow: 'Visa application support', heroLine1: 'Travel Your Next Chapter', heroLine2Prefix: 'With', heroEm: 'Confidence.',
  heroIntro: 'Practical visa application support for your global journey — IVAC, VFS Global and Korean Visa Processing, with clarity, care and a focus on your plans.',
  ctaPrimary: 'Discuss Your Requirements', ctaSecondary: 'Explore Our Services',
  priorityIntro: 'From appointment support to full application preparation, start with the service that fits your destination and visa category.',
  processCopy: 'Visa requirements can vary by destination, applicant and purpose. We help you organise the next steps without overpromising outcomes or obscuring what still needs to be confirmed.',
  faqHighlightQ: 'Will Roopo Visa guarantee my visa or appointment?',
  faqHighlightA: 'No. We provide application and appointment support; availability and final decisions are controlled by the relevant authorities.',
  ctaBandTitle: 'Let’s make the process clearer.',
  ctaBandText: 'Tell us what you need help with. We’ll guide you to the relevant next step.',
};
