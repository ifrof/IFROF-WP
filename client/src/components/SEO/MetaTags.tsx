import { Helmet } from 'react-helmet-async';

interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
}

interface MetaTagsProps {
  seo: PageSEO;
  type?: 'website' | 'article' | 'product';
}

export default function MetaTags({ seo, type = 'website' }: MetaTagsProps) {
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <link rel="canonical" href={seo.canonical} />
      
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.ogImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />
    </Helmet>
  );
}
