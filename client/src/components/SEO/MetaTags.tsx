import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  titleAr?: string;
  descriptionAr?: string;
  keywordsAr?: string[];
  structuredData?: any;
}

interface MetaTagsProps {
  seo: PageSEO;
  type?: 'website' | 'article' | 'product';
}

export default function MetaTags({ seo, type = 'website' }: MetaTagsProps) {
  const { language } = useLanguage();
  
  const title = language === 'ar' && seo.titleAr ? seo.titleAr : seo.title;
  const description = language === 'ar' && seo.descriptionAr ? seo.descriptionAr : seo.description;
  const keywords = language === 'ar' && seo.keywordsAr ? seo.keywordsAr : seo.keywords;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={seo.canonical} />
      
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seo.ogImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seo.ogImage} />
      
      <link rel="alternate" href={`${seo.canonical}?lang=ar`} hrefLang="ar" />
      <link rel="alternate" href={`${seo.canonical}?lang=en`} hrefLang="en" />
      <link rel="alternate" href={`${seo.canonical}?lang=zh`} hrefLang="zh" />
      <link rel="alternate" href={seo.canonical} hrefLang="x-default" />
      
      {seo.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seo.structuredData)}
        </script>
      )}
    </Helmet>
  );
}
