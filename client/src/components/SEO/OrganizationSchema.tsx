import { Helmet } from "react-helmet-async";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IFROF",
    url: "https://ifrof.com",
    logo: "https://ifrof.com/logo.png",
    description:
      "Direct import platform connecting global buyers with verified Chinese manufacturers.",
    contactPoint: {
      "@type": "ContactPoint",
      // telephone: '+86-XXX-XXXX-XXXX',
      contactType: "Customer Service",
      email: "support@ifrof.com",
      availableLanguage: ["English", "Arabic", "Chinese"],
    },
    sameAs: [
      "https://facebook.com/ifrof",
      "https://twitter.com/ifrof",
      "https://linkedin.com/company/ifrof",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
