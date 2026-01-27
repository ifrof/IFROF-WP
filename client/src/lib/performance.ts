/**
 * Performance Optimization Utilities
 */

/**
 * Image optimization configuration
 */
export const imageOptimization = {
  // Lazy loading configuration
  lazyLoad: {
    enabled: true,
    threshold: 0.1, // Start loading when 10% visible
    rootMargin: "50px", // Start loading 50px before entering viewport
  },

  // Image compression settings
  compression: {
    quality: 0.8, // 80% quality for JPEG
    webp: true, // Use WebP format when available
    sizes: {
      thumbnail: 150,
      small: 300,
      medium: 600,
      large: 1200,
      xlarge: 1920,
    },
  },

  // Responsive image breakpoints
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
};

/**
 * Core Web Vitals thresholds
 */
export const webVitalsThresholds = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 600, // Time to First Byte (ms)
};

/**
 * Performance monitoring function
 */
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return;

  // Web Vitals monitoring
  if ("web-vital" in window) {
    // LCP - Largest Contentful Paint
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log(
            "LCP:",
            (entry as any).renderTime || (entry as any).loadTime
          );
        }
      }
    });
    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  }

  // Navigation Timing API
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (perfData) {
      const pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - (perfData as any).domLoading;

      console.log("Page Load Time:", pageLoadTime);
      console.log("Connect Time:", connectTime);
      console.log("Render Time:", renderTime);
    }
  });
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images using Intersection Observer
 */
export function lazyLoadImages() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return;
  }

  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: imageOptimization.lazyLoad.rootMargin,
      threshold: imageOptimization.lazyLoad.threshold,
    }
  );

  images.forEach(img => imageObserver.observe(img));
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof document === "undefined") return;

  const criticalFonts = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  ];

  criticalFonts.forEach(font => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = font;
    document.head.appendChild(link);
  });
}

/**
 * Cache strategy for API responses
 */
export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number; // Time to live in milliseconds

  constructor(ttl: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.ttl = ttl;
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string) {
    return this.get(key) !== null;
  }
}

/**
 * Request batching for API calls
 */
export class RequestBatcher {
  private queue: Array<{ url: string; resolve: Function; reject: Function }> =
    [];
  private timer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private batchDelay: number;

  constructor(batchSize: number = 10, batchDelay: number = 50) {
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
  }

  async batch(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const batch = this.queue.splice(0, this.batchSize);
    if (batch.length === 0) return;

    try {
      const responses = await Promise.all(
        batch.map(item =>
          fetch(item.url)
            .then(res => res.json())
            .catch(err => ({ error: err }))
        )
      );

      batch.forEach((item, index) => {
        if (responses[index].error) {
          item.reject(responses[index].error);
        } else {
          item.resolve(responses[index]);
        }
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
  }
}

/**
 * Service Worker registration for offline support
 */
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(registration => {
        console.log("Service Worker registered:", registration);
      })
      .catch(error => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
