import { Request, Response, NextFunction } from 'express';

// Simple in-memory redirects for now, can be extended to use DB
const redirects: Record<string, string> = {
  '/old-products': '/shop/products',
  '/manufacturers': '/marketplace',
  '/factory-investigator': '/find-factory',
  '/ai-search': '/find-factory',
  '/factory': '/find-factory'
};

export function redirectMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  if (redirects[path]) {
    return res.redirect(301, redirects[path]);
  }
  next();
}
