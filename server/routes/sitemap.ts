import { Router } from 'express';
import { db } from '../db.js';
import { products, blogPosts, factories } from '../../drizzle/schema.js';

const router = Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://ifrof.com';
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      '',
      '/marketplace',
      '/faq',
      '/about',
      '/contact'
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
    const allProducts = await db.select().from(products);
    allProducts.forEach(product => {
      xml += `
  <url>
    <loc>${baseUrl}/shop/products/${product.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add dynamic blog posts
    const allPosts = await db.select().from(blogPosts);
    allPosts.forEach(post => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Add dynamic factories
    const allFactories = await db.select().from(factories);
    allFactories.forEach(factory => {
      xml += `
  <url>
    <loc>${baseUrl}/factory/${factory.id}</loc>
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
