import { useState } from 'react';
import MetaTags from '../components/SEO/MetaTags';
import BreadcrumbSchema from '../components/SEO/BreadcrumbSchema';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    question: "How do I place an order on IFROF?",
    answer: "To place an order, browse our product catalog, select the items you want, add them to your cart, and proceed to checkout."
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Minimum order quantities vary by manufacturer and product. The specific MOQ is displayed on each product page."
  },
  // ... Add more FAQs to reach 30
];

export default function FAQ() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const seo = {
    title: 'FAQ - Frequently Asked Questions | IFROF',
    description: 'Find answers to common questions about importing from China, ordering, shipping, and payments.',
    keywords: ['faq', 'import help', 'shipping questions'],
    ogImage: 'https://ifrof.com/images/og-default.jpg',
    canonical: 'https://ifrof.com/faq'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <MetaTags seo={seo} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://ifrof.com' },
        { name: 'FAQ', url: 'https://ifrof.com/faq' }
      ]} />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <button 
              className="w-full text-left font-semibold text-lg flex justify-between"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              {faq.question}
              <span>{expanded === index ? '-' : '+'}</span>
            </button>
            {expanded === index && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
