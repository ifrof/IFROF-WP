import { Request } from "express";
import * as db from "../db";
import { translations, DEFAULT_LANGUAGE, Language } from "../../shared/i18n";

/**
 * Generates static HTML content for critical pages to support SEO and AI crawlers
 * without requiring JavaScript execution.
 */
export async function generateStaticContent(req: Request): Promise<string> {
  const url = req.originalUrl;
  const lang = (req.query.lang as Language) || DEFAULT_LANGUAGE;
  const t = (key: string) => {
    const keys = key.split(".");
    let obj = translations[lang] as any;
    for (const k of keys) {
      if (obj && obj[k]) obj = obj[k];
      else return key;
    }
    return typeof obj === "string" ? obj : key;
  };

  // Home Page
  if (url === "/" || url.startsWith("/?")) {
    return `
      <div class="ssr-content">
        <h1>${t("hero.title")} ${t("hero.titleHighlight")}</h1>
        <p>${t("hero.subtitle")}</p>
        <section>
          <h2>${t("howItWorks.title")}</h2>
          <ul>
            <li><strong>${t("howItWorks.steps.step1.title")}</strong>: ${t("howItWorks.steps.step1.desc")}</li>
            <li><strong>${t("howItWorks.steps.step2.title")}</strong>: ${t("howItWorks.steps.step2.desc")}</li>
            <li><strong>${t("howItWorks.steps.step3.title")}</strong>: ${t("howItWorks.steps.step3.desc")}</li>
            <li><strong>${t("howItWorks.steps.step4.title")}</strong>: ${t("howItWorks.steps.step4.desc")}</li>
          </ul>
        </section>
      </div>
    `;
  }

  // Product Detail Page
  if (url.startsWith("/products/")) {
    const id = parseInt(url.split("/")[2]);
    if (!isNaN(id)) {
      const product = await db.getProductById(id);
      if (product) {
        const name =
          lang === "ar"
            ? product.nameAr
            : lang === "zh"
              ? product.nameZh
              : product.nameEn;
        const desc =
          lang === "ar"
            ? product.descriptionAr
            : lang === "zh"
              ? product.descriptionZh
              : product.descriptionEn;
        return `
          <div class="ssr-content">
            <h1>${name}</h1>
            <p>${desc}</p>
            <div class="product-meta">
              <span>Price: ${product.minPrice} ${product.currency}</span>
              <span>MOQ: ${product.minimumOrderQuantity}</span>
            </div>
          </div>
        `;
      }
    }
  }

  // Blog Post Detail Page
  if (url.startsWith("/blog/")) {
    const slug = url.split("/")[2];
    if (slug) {
      const post = await db.getBlogPostBySlug(slug);
      if (post) {
        const title = lang === "ar" ? post.titleAr : post.titleEn;
        const content = lang === "ar" ? post.contentAr : post.contentEn;
        return `
          <div class="ssr-content">
            <h1>${title}</h1>
            <div class="blog-content">${content}</div>
          </div>
        `;
      }
    }
  }

  // Marketplace / Search
  if (url.startsWith("/marketplace") || url.startsWith("/products")) {
    const products = await db.getAllProducts(20, 0);
    return `
      <div class="ssr-content">
        <h1>${t("nav.marketplace")}</h1>
        <div class="product-grid">
          ${products
            .map(
              (p: any) => `
            <div class="product-card">
              <h3>${lang === "ar" ? p.nameAr : p.nameEn}</h3>
              <p>Price: ${p.minPrice} ${p.currency}</p>
              <a href="/products/${p.id}">View Details</a>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  return "";
}
