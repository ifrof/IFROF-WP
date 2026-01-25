import { Router } from 'express';
import * as dbModule from '../db';
const db = dbModule as any;

const router = Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://ifrof.com';
    const today = new Date().toISOString().split('T')[0];
    const langs = ['ar', 'en', 'zh'];

    // Static pages
    const staticPages = [
      '',
      '/marketplace',
      '/find-factory',
      '/faq',
      '/about',
      '/contact',
      '/privacy',
      '/terms'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Add static pages for each language
    staticPages.forEach(page => {
      langs.forEach(lang => {
        const url = `${baseUrl}${page}${page.includes('?') ? '&' : '?'}lang=${lang}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
    ${langs.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}${page}${page.includes('?') ? '&' : '?'}lang=${l}"/>`).join('\n    ')}
  </url>`;
      });
    });

    // Add dynamic products
    const allProducts = await db.getAllProducts(100, 0);
    (allProducts || []).forEach((product: any) => {
      langs.forEach(lang => {
        const url = `${baseUrl}/products/${product.id}?lang=${lang}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${langs.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/products/${product.id}?lang=${l}"/>`).join('\n    ')}
  </url>`;
      });
    });

    // Add dynamic blog posts
    const allPosts = await db.getBlogPosts(100, 0);
    (allPosts || []).forEach((post: any) => {
      langs.forEach(lang => {
        const url = `${baseUrl}/blog/${post.slug}?lang=${lang}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    ${langs.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/blog/${post.slug}?lang=${l}"/>`).join('\n    ')}
  </url>`;
      });
    });

    // Add dynamic factories
    const allFactories = await db.getAllFactories(100, 0);
    (allFactories || []).forEach((factory: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/factories/${factory.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    xml += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
