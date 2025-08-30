/**
 * Performance Optimization Utilities
 * Handles image optimization, lazy loading, and performance monitoring
 */

class PerformanceOptimizer {
  constructor() {
    this.imageCache = new Map();
    this.webpSupported = null;
    this.criticalResourcesLoaded = false;
    this.performanceMetrics = {
      loadStart: performance.now(),
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      cumulativeLayoutShift: 0
    };
    
    this.init();
  }

  async init() {
    // Check WebP support
    await this.checkWebPSupport();
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Initialize lazy loading
    this.initLazyLoading();
    
    // Setup error boundaries
    this.setupErrorHandling();
  }

  /**
   * Check if browser supports WebP format
   */
  async checkWebPSupport() {
    if (this.webpSupported !== null) return this.webpSupported;

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.webpSupported = (webP.height === 2);
        resolve(this.webpSupported);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get optimized image URL with WebP fallback
   */
  getOptimizedImageUrl(originalUrl, options = {}) {
    if (!originalUrl) return null;

    const { width, height, quality = 85, format } = options;
    
    // If WebP is supported and no specific format requested, use WebP
    const useWebP = this.webpSupported && !format;
    
    // For demo purposes, we'll simulate WebP conversion
    // In a real implementation, this would connect to an image optimization service
    let optimizedUrl = originalUrl;
    
    if (useWebP && !originalUrl.includes('.webp')) {
      // Convert extension to .webp
      optimizedUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    // Add query parameters for resizing (would be handled by CDN/image service)
    const params = new URLSearchParams();
    if (width) params.set('w', width);
    if (height) params.set('h', height);
    if (quality !== 85) params.set('q', quality);
    
    if (params.toString()) {
      optimizedUrl += (optimizedUrl.includes('?') ? '&' : '?') + params.toString();
    }
    
    return optimizedUrl;
  }

  /**
   * Create responsive image with multiple sources
   */
  createResponsiveImage(src, alt, options = {}) {
    const { 
      sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      loading = 'lazy',
      className = '',
      fallback = true
    } = options;

    // Create picture element for WebP support with fallback
    const picture = document.createElement('picture');
    
    if (this.webpSupported) {
      // WebP source
      const webpSource = document.createElement('source');
      webpSource.type = 'image/webp';
      webpSource.srcset = this.generateSrcSet(src, 'webp');
      webpSource.sizes = sizes;
      picture.appendChild(webpSource);
    }
    
    // Fallback source
    const fallbackSource = document.createElement('source');
    fallbackSource.srcset = this.generateSrcSet(src, 'original');
    fallbackSource.sizes = sizes;
    picture.appendChild(fallbackSource);
    
    // Image element
    const img = document.createElement('img');
    img.src = this.getOptimizedImageUrl(src, { width: 800 });
    img.alt = alt;
    img.loading = loading;
    img.className = className;
    
    // Add error handling
    img.onerror = () => {
      if (fallback) {
        img.src = this.createFallbackImage(alt);
      }
    };
    
    picture.appendChild(img);
    return picture;
  }

  /**
   * Generate srcset for responsive images
   */
  generateSrcSet(src, format) {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    const srcsetEntries = widths.map(width => {
      const url = format === 'webp' 
        ? this.getOptimizedImageUrl(src, { width, format: 'webp' })
        : this.getOptimizedImageUrl(src, { width });
      return `${url} ${width}w`;
    });
    
    return srcsetEntries.join(', ');
  }

  /**
   * Create fallback image for failed loads
   */
  createFallbackImage(alt) {
    // Create a simple SVG placeholder
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">
          ${alt || 'Image unavailable'}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Initialize lazy loading with Intersection Observer
   */
  initLazyLoading() {
    // Enhanced lazy loading with better performance
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          lazyImageObserver.unobserve(img);
        }
      });
    }, {
      // Load images when they're 100px away from viewport
      rootMargin: '100px',
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
      lazyImageObserver.observe(img);
    });

    // Also observe dynamically added images
    this.observeNewImages(lazyImageObserver);
  }

  /**
   * Load image with optimization and error handling
   */
  async loadImage(imgElement) {
    const src = imgElement.dataset.src || imgElement.src;
    if (!src || this.imageCache.has(src)) return;

    try {
      // Show loading state
      imgElement.classList.add('loading');
      
      // Preload the image
      const optimizedSrc = this.getOptimizedImageUrl(src, {
        width: imgElement.offsetWidth || 800,
        quality: 85
      });
      
      await this.preloadImage(optimizedSrc);
      
      // Update image source
      if (imgElement.dataset.src) {
        imgElement.src = optimizedSrc;
        imgElement.removeAttribute('data-src');
      }
      
      // Cache the loaded image
      this.imageCache.set(src, optimizedSrc);
      
      // Remove loading state and add loaded class
      imgElement.classList.remove('loading');
      imgElement.classList.add('loaded');
      
      // Trigger fade-in animation
      this.animateImageLoad(imgElement);
      
    } catch (error) {
      console.warn('Failed to load image:', src, error);
      imgElement.classList.remove('loading');
      imgElement.classList.add('error');
      
      // Set fallback image
      imgElement.src = this.createFallbackImage(imgElement.alt);
    }
  }

  /**
   * Preload image and return promise
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Animate image load with fade-in effect
   */
  animateImageLoad(imgElement) {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    imgElement.style.opacity = '0';
    imgElement.style.transform = 'scale(0.95)';
    imgElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      imgElement.style.opacity = '1';
      imgElement.style.transform = 'scale(1)';
    });
  }

  /**
   * Observe dynamically added images
   */
  observeNewImages(observer) {
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the node itself is a lazy image
            if (node.matches && node.matches('img[data-src], img[loading="lazy"]')) {
              observer.observe(node);
            }
            
            // Check for lazy images within the added node
            const lazyImages = node.querySelectorAll && node.querySelectorAll('img[data-src], img[loading="lazy"]');
            if (lazyImages) {
              lazyImages.forEach(img => observer.observe(img));
            }
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    const criticalResources = [
      { href: 'css/styles.css', as: 'style' },
      { href: 'css/components.css', as: 'style' },
      { href: 'data/portfolio.json', as: 'fetch', crossorigin: 'anonymous' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      
      document.head.appendChild(link);
    });

    this.criticalResourcesLoaded = true;
  }

  /**
   * Initialize performance monitoring
   */
  initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.observePerformanceMetrics();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor JavaScript errors
    this.monitorJavaScriptErrors();
  }

  /**
   * Observe Core Web Vitals
   */
  observePerformanceMetrics() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.performanceMetrics.firstContentfulPaint = entry.startTime;
        }
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.performanceMetrics.cumulativeLayoutShift += clsValue;
    }).observe({ entryTypes: ['layout-shift'] });

    // Log metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.logPerformanceMetrics();
      }, 1000);
    });
  }

  /**
   * Monitor resource loading performance
   */
  monitorResourceLoading() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        // Log slow resources (>1s)
        if (entry.duration > 1000) {
          console.warn(`Slow resource detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  /**
   * Monitor JavaScript errors
   */
  monitorJavaScriptErrors() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    });
  }

  /**
   * Log performance metrics
   */
  logPerformanceMetrics() {
    const metrics = {
      ...this.performanceMetrics,
      loadComplete: performance.now(),
      totalLoadTime: performance.now() - this.performanceMetrics.loadStart
    };

    console.log('Performance Metrics:', metrics);

    // Check against Core Web Vitals thresholds
    this.evaluatePerformance(metrics);
  }

  /**
   * Evaluate performance against Core Web Vitals
   */
  evaluatePerformance(metrics) {
    const thresholds = {
      firstContentfulPaint: 1800, // 1.8s
      largestContentfulPaint: 2500, // 2.5s
      cumulativeLayoutShift: 0.1 // 0.1
    };

    const results = {
      fcp: metrics.firstContentfulPaint <= thresholds.firstContentfulPaint ? 'good' : 'needs-improvement',
      lcp: metrics.largestContentfulPaint <= thresholds.largestContentfulPaint ? 'good' : 'needs-improvement',
      cls: metrics.cumulativeLayoutShift <= thresholds.cumulativeLayoutShift ? 'good' : 'needs-improvement'
    };

    console.log('Core Web Vitals Assessment:', results);
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Create error boundary for the application
    this.createErrorBoundary();
    
    // Handle network errors gracefully
    this.setupNetworkErrorHandling();
  }

  /**
   * Create error boundary functionality
   */
  createErrorBoundary() {
    const errorBoundary = {
      hasError: false,
      error: null,
      
      componentDidCatch: (error, errorInfo) => {
        this.hasError = true;
        this.error = error;
        
        console.error('Error Boundary caught an error:', error, errorInfo);
        
        // Show user-friendly error message
        this.showErrorMessage(error);
        
        // Log error for monitoring
        this.logError(error, errorInfo);
      }
    };

    // Attach to window for global access
    window.errorBoundary = errorBoundary;
  }

  /**
   * Show user-friendly error message
   */
  showErrorMessage(error) {
    // Create or update error message element
    let errorElement = document.getElementById('error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'error-message';
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'assertive');
      
      // Style the error message
      errorElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        color: #991b1b;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #fecaca;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      `;
      
      document.body.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `
      <strong>Something went wrong</strong><br>
      <small>We're working to fix this issue. Please try refreshing the page.</small>
      <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
    `;
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (errorElement.parentElement) {
        errorElement.remove();
      }
    }, 10000);
  }

  /**
   * Setup network error handling
   */
  setupNetworkErrorHandling() {
    // Override fetch to add retry logic
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const maxRetries = 3;
      let retries = 0;
      
      while (retries < maxRetries) {
        try {
          const response = await originalFetch(...args);
          
          if (!response.ok && response.status >= 500) {
            throw new Error(`Server error: ${response.status}`);
          }
          
          return response;
        } catch (error) {
          retries++;
          
          if (retries === maxRetries) {
            console.error('Network request failed after retries:', error);
            throw error;
          }
          
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        }
      }
    };
  }

  /**
   * Log error for monitoring
   */
  logError(error, errorInfo) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorInfo
    };
    
    // In a real application, send to error monitoring service
    console.error('Error logged:', errorData);
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      metrics: this.performanceMetrics,
      imageCache: this.imageCache.size,
      webpSupported: this.webpSupported,
      criticalResourcesLoaded: this.criticalResourcesLoaded
    };
  }
}

// Initialize performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}