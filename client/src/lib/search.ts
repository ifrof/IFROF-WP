export interface SearchResult {
  id: number;
  title: string;
  description?: string;
  type: "product" | "factory" | "blog";
  url: string;
}

export const searchProducts = (query: string, products: any[]): SearchResult[] => {
  const lowerQuery = query.toLowerCase();
  return products
    .filter(
      (p) =>
        p.nameEn?.toLowerCase().includes(lowerQuery) ||
        p.nameAr?.toLowerCase().includes(lowerQuery) ||
        p.descriptionEn?.toLowerCase().includes(lowerQuery)
    )
    .map((p) => ({
      id: p.id,
      title: p.nameEn || p.nameAr,
      description: p.descriptionEn,
      type: "product" as const,
      url: `/products/${p.id}`,
    }));
};

export const searchFactories = (query: string, factories: any[]): SearchResult[] => {
  const lowerQuery = query.toLowerCase();
  return factories
    .filter((f) => f.name?.toLowerCase().includes(lowerQuery) || f.description?.toLowerCase().includes(lowerQuery))
    .map((f) => ({
      id: f.id,
      title: f.name,
      description: f.description,
      type: "factory" as const,
      url: `/factories/${f.id}`,
    }));
};

export const performSearch = (query: string, data: any): SearchResult[] => {
  const results: SearchResult[] = [];
  results.push(...searchProducts(query, data.products || []));
  results.push(...searchFactories(query, data.factories || []));
  return results;
};
