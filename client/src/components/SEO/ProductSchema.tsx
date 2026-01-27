import { Helmet } from "react-helmet-async";

interface ProductSchemaProps {
  product: {
    id: string | number;
    name: string;
    description: string;
    images: string[];
    price: number;
    brand?: string;
    rating?: {
      value: number;
      count: number;
    };
  };
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand || "IFROF",
    },
    offers: {
      "@type": "Offer",
      url: `https://ifrof.com/shop/products/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
      },
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
