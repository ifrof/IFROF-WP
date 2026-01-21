import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to set cache headers for static assets
 * Implements aggressive caching for immutable assets (1 year)
 * and shorter cache for HTML (no-cache with revalidation)
 */
export function cacheHeaders(req: Request, res: Response, next: NextFunction) {
  const path = req.path;

  // Immutable assets with hash in filename - cache for 1 year
  if (
    path.match(/\.(js|css|woff2?|ttf|eot|otf)$/) &&
    path.includes('-') // Contains hash
  ) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Images - cache for 1 year with revalidation
  else if (path.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|avif)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, must-revalidate');
  }
  // Fonts - cache for 1 year
  else if (path.match(/\.(woff2?|ttf|eot|otf)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // HTML - no cache, always revalidate
  else if (path.match(/\.html$/) || path === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  // JSON and API responses - no cache
  else if (path.startsWith('/api/') || path.match(/\.json$/)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  // Default - cache for 1 hour
  else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }

  next();
}

/**
 * Middleware to enable compression
 */
export function compressionHeaders(req: Request, res: Response, next: NextFunction) {
  // Enable Brotli compression if supported
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
  } else if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
  }

  next();
}

/**
 * Middleware to add performance headers
 */
export function performanceHeaders(req: Request, res: Response, next: NextFunction) {
  // Add timing header
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    res.setHeader('Server-Timing', `total;dur=${duration}`);
  });

  // Add resource hints
  res.setHeader('Link', [
    '</assets/react-vendor.js>; rel=preload; as=script',
    '</assets/ui-vendor.js>; rel=preload; as=script',
    '</assets/query-vendor.js>; rel=preload; as=script',
  ].join(', '));

  next();
}
