/**
 * SEO Configuration and Meta Tags Management
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  robots?: string;
  author?: string;
}

export const defaultSEO: SEOConfig = {
  title: "IFROF - Verified Chinese Manufacturers & Suppliers",
  description:
    "Connect with verified Chinese manufacturers and suppliers. Find factories, products, and services with confidence. IFROF provides comprehensive supplier verification and risk assessment.",
  keywords: [
    "Chinese manufacturers",
    "verified suppliers",
    "factory verification",
    "B2B marketplace",
    "supplier network",
    "manufacturing",
    "wholesale",
    "import export",
  ],
  ogImage: "https://ifrof.com/og-image.png",
  ogType: "website",
  robots: "index, follow",
  author: "IFROF",
};

export const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: "IFROF - Verified Chinese Manufacturers & Suppliers",
    description:
      "Discover verified Chinese manufacturers and suppliers on IFROF. Access comprehensive factory profiles, product catalogs, and supplier verification services.",
    keywords: ["manufacturers", "suppliers", "China", "verified", "B2B"],
  },
  manufacturers: {
    title: "Browse Verified Manufacturers | IFROF",
    description:
      "Explore thousands of verified Chinese manufacturers and factories. Filter by industry, location, and certification status.",
    keywords: ["manufacturers", "factories", "verified", "directory"],
  },
  products: {
    title: "Products & Services | IFROF Marketplace",
    description:
      "Browse products and services from verified manufacturers. Compare prices, specifications, and manufacturer ratings.",
    keywords: ["products", "services", "marketplace", "wholesale"],
  },
  blog: {
    title: "Blog & Resources | IFROF",
    description:
      "Learn about supplier verification, manufacturing best practices, and supply chain management from IFROF experts.",
    keywords: ["blog", "resources", "guides", "tips"],
  },
  forum: {
    title: "Community Forum | IFROF",
    description:
      "Connect with buyers and suppliers. Ask questions, share experiences, and get advice from the IFROF community.",
    keywords: ["forum", "community", "Q&A", "discussions"],
  },
};

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(config: SEOConfig): Record<string, string> {
  return {
    "og:title": config.title,
    "og:description": config.description,
    "og:image": config.ogImage || defaultSEO.ogImage!,
    "og:type": config.ogType || "website",
    "twitter:title": config.title,
    "twitter:description": config.description,
    "twitter:image": config.ogImage || defaultSEO.ogImage!,
    "twitter:card": "summary_large_image",
  };
}

/**
 * Structured data for JSON-LD
 */
export function generateStructuredData(
  type: "Organization" | "LocalBusiness" | "Product",
  data: any
) {
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "Organization":
      return {
        ...baseStructure,
        name: "IFROF",
        url: "https://ifrof.com",
        logo: "https://ifrof.com/logo.png",
        description: "Verified Chinese Manufacturers & Suppliers Network",
        sameAs: [
          "https://www.linkedin.com/company/ifrof",
          "https://twitter.com/ifrof",
        ],
      };

    case "LocalBusiness":
      return {
        ...baseStructure,
        name: data.name,
        description: data.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: data.address,
          addressCountry: "CN",
        },
        telephone: data.phone,
        url: data.website,
        image: data.image,
        priceRange: data.priceRange,
      };

    case "Product":
      return {
        ...baseStructure,
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          "@type": "Brand",
          name: data.brand,
        },
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: data.rating,
          reviewCount: data.reviewCount,
        },
      };

    default:
      return baseStructure;
  }
}

/**
 * Sitemap generation helper
 */
export function generateSitemapEntry(
  url: string,
  lastmod?: string,
  changefreq?: string,
  priority?: number
) {
  return {
    url,
    lastmod: lastmod || new Date().toISOString(),
    changefreq: changefreq || "weekly",
    priority: priority || 0.8,
  };
}

/**
 * Robots.txt content
 */
export const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://ifrof.com/sitemap.xml

# Crawl delay (in seconds)
Crawl-delay: 1

# User-agent specific rules
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
`;
