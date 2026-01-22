import { Router } from 'express';
import * as dbModule from '../db';
const db = dbModule as any;

const router = Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://ifrof.com';
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      '',
      '/marketplace',
      '/search',
      '/faq',
      '/about',
      '/contact',
      '/privacy',
      '/terms'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add dynamic products
    const allProducts = await db.getAllProducts(100, 0);
    (allProducts || []).forEach((product: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add dynamic blog posts
    const allPosts = await db.getBlogPosts(100, 0);
    (allPosts || []).forEach((post: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
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
