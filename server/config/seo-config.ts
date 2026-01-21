export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
}

const BASE_URL = 'https://ifrof.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-default.jpg`;

export const staticPagesSEO: Record<string, PageSEO> = {
  '/': {
    title: 'IFROF - Direct Import from Chinese Manufacturers | Wholesale B2B Platform',
    description: 'Connect directly with verified Chinese manufacturers. Import quality products at factory prices. No middlemen, transparent pricing, secure transactions.',
    keywords: ['chinese manufacturers', 'import from china', 'wholesale', 'b2b marketplace', 'factory direct'],
    ogImage: `${BASE_URL}/images/og-homepage.jpg`,
    canonical: BASE_URL
  },
  '/marketplace': {
    title: 'Manufacturer Marketplace - Find Verified Chinese Suppliers | IFROF',
    description: 'Browse our marketplace of verified Chinese manufacturers across all industries. Direct factory connections and competitive pricing.',
    keywords: ['manufacturer marketplace', 'chinese suppliers', 'factory directory', 'verified manufacturers'],
    ogImage: `${BASE_URL}/images/og-marketplace.jpg`,
    canonical: `${BASE_URL}/marketplace`
  },
  '/faq': {
    title: 'FAQ - Frequently Asked Questions About Importing | IFROF',
    description: 'Find answers to common questions about ordering, shipping, payments, and returns when importing from China.',
    keywords: ['import faq', 'china import help', 'shipping faq', 'payment faq'],
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/faq`
  }
};

export const defaultSEO: PageSEO = {
  title: 'IFROF - Direct Import from Chinese Manufacturers',
  description: 'Connect directly with verified Chinese manufacturers. Import quality products at factory prices.',
  keywords: ['import from china', 'chinese manufacturers', 'wholesale', 'factory direct'],
  ogImage: DEFAULT_OG_IMAGE,
  canonical: BASE_URL
};
