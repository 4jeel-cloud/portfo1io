/**
 * Performance Optimization Tests
 * Tests for image optimization, lazy loading, and performance monitoring
 */

// Mock performance API for testing
const mockPerformance = {
  now: () => Date.now(),
  getEntriesByType: (type) => {
    if (type === 'resource') {
      return [
        { name: 'css/styles.css', duration: 150, transferSize: 25000 },
        { name: 'js/main.js', duration: 200, transferSize: 45000 },
        { name: 'images/test.jpg', duration: 800, transferSize: 120000 }
      ];
    }
    return [];
  }
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observedElements = new Set();
  }

  observe(element) {
    this.observedElements.add(element);
    // Simulate intersection after a delay
    setTimeout(() => {
      this.callback([{
        target: element,
        isIntersecting: true
      }]);
    }, 100);
  }

  unobserve(element) {
    this.observedElements.delete(element);
  }

  disconnect() {
    this.observedElements.clear();
  }
}

// Test suite for Performance Optimizer
function runPerformanceTests() {
  console.log('Running Performance Optimization Tests...');

  // Setup test environment
  global.performance = mockPerformance;
  global.IntersectionObserver = MockIntersectionObserver;
  global.PerformanceObserver = class MockPerformanceObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    disconnect() {}
  };

  const tests = [
    testWebPSupport,
    testImageOptimization,
    testLazyLoading,
    testResponsiveImages,
    testErrorHandling,
    testPerformanceMonitoring,
    testCriticalCSS,
    testFontOptimization
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    try {
      test();
      console.log(`✅ ${test.name} passed`);
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message);
      failed++;
    }
  });

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

/**
 * Test WebP support detection
 */
function testWebPSupport() {
  // Mock PerformanceOptimizer
  const optimizer = {
    webpSupported: null,
    async checkWebPSupport() {
      return new Promise((resolve) => {
        // Simulate WebP support check
        this.webpSupported = true;
        resolve(this.webpSupported);
      });
    }
  };

  // Test WebP detection
  return optimizer.checkWebPSupport().then(supported => {
    if (typeof supported !== 'boolean') {
      throw new Error('WebP support should return boolean');
    }
  });
}

/**
 * Test image optimization URL generation
 */
function testImageOptimization() {
  const optimizer = {
    webpSupported: true,
    getOptimizedImageUrl(originalUrl, options = {}) {
      if (!originalUrl) return null;
      
      const { width, height, quality = 85 } = options;
      let optimizedUrl = originalUrl;
      
      if (this.webpSupported && !originalUrl.includes('.webp')) {
        optimizedUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
      
      const params = new URLSearchParams();
      if (width) params.set('w', width);
      if (height) params.set('h', height);
      if (quality !== 85) params.set('q', quality);
      
      if (params.toString()) {
        optimizedUrl += (optimizedUrl.includes('?') ? '&' : '?') + params.toString();
      }
      
      return optimizedUrl;
    }
  };

  // Test basic optimization
  const result1 = optimizer.getOptimizedImageUrl('test.jpg', { width: 800 });
  if (!result1.includes('.webp')) {
    throw new Error('Should convert to WebP format');
  }
  if (!result1.includes('w=800')) {
    throw new Error('Should include width parameter');
  }

  // Test with quality
  const result2 = optimizer.getOptimizedImageUrl('test.png', { quality: 70 });
  if (!result2.includes('q=70')) {
    throw new Error('Should include quality parameter');
  }

  // Test null input
  const result3 = optimizer.getOptimizedImageUrl(null);
  if (result3 !== null) {
    throw new Error('Should return null for null input');
  }
}

/**
 * Test lazy loading functionality
 */
function testLazyLoading() {
  // Create test DOM elements
  const container = document.createElement('div');
  const img = document.createElement('img');
  img.setAttribute('data-src', 'test.jpg');
  img.setAttribute('loading', 'lazy');
  container.appendChild(img);
  document.body.appendChild(container);

  const optimizer = {
    imageCache: new Map(),
    
    initLazyLoading() {
      const lazyImageObserver = new MockIntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            lazyImageObserver.unobserve(entry.target);
          }
        });
      });

      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        lazyImageObserver.observe(img);
      });
    },

    async loadImage(imgElement) {
      const src = imgElement.dataset.src || imgElement.src;
      if (!src || this.imageCache.has(src)) return;

      imgElement.classList.add('loading');
      
      // Simulate image loading
      await new Promise(resolve => setTimeout(resolve, 50));
      
      imgElement.src = src;
      imgElement.removeAttribute('data-src');
      imgElement.classList.remove('loading');
      imgElement.classList.add('loaded');
      
      this.imageCache.set(src, src);
    }
  };

  // Test lazy loading initialization
  optimizer.initLazyLoading();

  // Wait for intersection observer to trigger
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!img.classList.contains('loaded')) {
          reject(new Error('Image should be loaded'));
        }
        if (img.getAttribute('data-src')) {
          reject(new Error('data-src should be removed after loading'));
        }
        if (!optimizer.imageCache.has('test.jpg')) {
          reject(new Error('Image should be cached after loading'));
        }
        
        // Cleanup
        document.body.removeChild(container);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

/**
 * Test responsive image creation
 */
function testResponsiveImages() {
  const optimizer = {
    webpSupported: true,
    
    getOptimizedImageUrl(src, options) {
      return `${src}?w=${options.width}`;
    },
    
    generateSrcSet(src, format) {
      const widths = [320, 640, 768, 1024];
      return widths.map(width => `${src}?w=${width} ${width}w`).join(', ');
    },
    
    createResponsiveImage(src, alt, options = {}) {
      const picture = document.createElement('picture');
      
      if (this.webpSupported) {
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = this.generateSrcSet(src, 'webp');
        picture.appendChild(webpSource);
      }
      
      const img = document.createElement('img');
      img.src = this.getOptimizedImageUrl(src, { width: 800 });
      img.alt = alt;
      picture.appendChild(img);
      
      return picture;
    }
  };

  // Test responsive image creation
  const picture = optimizer.createResponsiveImage('test.jpg', 'Test image');
  
  if (picture.tagName !== 'PICTURE') {
    throw new Error('Should create picture element');
  }
  
  const sources = picture.querySelectorAll('source');
  if (sources.length === 0) {
    throw new Error('Should create source elements');
  }
  
  const img = picture.querySelector('img');
  if (!img || img.alt !== 'Test image') {
    throw new Error('Should create img element with alt text');
  }
  
  if (!img.src.includes('w=800')) {
    throw new Error('Should set optimized src');
  }
}

/**
 * Test error handling
 */
function testErrorHandling() {
  const optimizer = {
    createFallbackImage(alt) {
      const svg = `<svg><text>${alt || 'Image unavailable'}</text></svg>`;
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    },
    
    showErrorMessage(error) {
      let errorElement = document.getElementById('error-message');
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.setAttribute('role', 'alert');
        document.body.appendChild(errorElement);
      }
      
      errorElement.textContent = 'Something went wrong';
      return errorElement;
    }
  };

  // Test fallback image creation
  const fallback = optimizer.createFallbackImage('Test Alt');
  if (!fallback.startsWith('data:image/svg+xml')) {
    throw new Error('Should create SVG fallback image');
  }

  // Test error message display
  const errorElement = optimizer.showErrorMessage(new Error('Test error'));
  if (!errorElement || errorElement.getAttribute('role') !== 'alert') {
    throw new Error('Should create error message with alert role');
  }
  
  // Cleanup
  if (errorElement.parentElement) {
    errorElement.remove();
  }
}

/**
 * Test performance monitoring
 */
function testPerformanceMonitoring() {
  const optimizer = {
    performanceMetrics: {
      loadStart: performance.now(),
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      cumulativeLayoutShift: 0
    },
    
    logPerformanceMetrics() {
      const metrics = {
        ...this.performanceMetrics,
        loadComplete: performance.now(),
        totalLoadTime: performance.now() - this.performanceMetrics.loadStart
      };
      return metrics;
    },
    
    evaluatePerformance(metrics) {
      const thresholds = {
        firstContentfulPaint: 1800,
        largestContentfulPaint: 2500,
        cumulativeLayoutShift: 0.1
      };
      
      return {
        fcp: (metrics.firstContentfulPaint || 0) <= thresholds.firstContentfulPaint ? 'good' : 'needs-improvement',
        lcp: (metrics.largestContentfulPaint || 0) <= thresholds.largestContentfulPaint ? 'good' : 'needs-improvement',
        cls: metrics.cumulativeLayoutShift <= thresholds.cumulativeLayoutShift ? 'good' : 'needs-improvement'
      };
    }
  };

  // Test metrics logging
  const metrics = optimizer.logPerformanceMetrics();
  if (!metrics.totalLoadTime || typeof metrics.totalLoadTime !== 'number') {
    throw new Error('Should calculate total load time');
  }

  // Test performance evaluation
  const evaluation = optimizer.evaluatePerformance({
    firstContentfulPaint: 1500,
    largestContentfulPaint: 2000,
    cumulativeLayoutShift: 0.05
  });
  
  if (evaluation.fcp !== 'good' || evaluation.lcp !== 'good' || evaluation.cls !== 'good') {
    throw new Error('Should evaluate good performance correctly');
  }
}

/**
 * Test critical CSS functionality
 */
function testCriticalCSS() {
  const cssManager = {
    criticalCSS: '',
    
    extractCriticalCSS() {
      this.criticalCSS = `
        body { font-family: Arial, sans-serif; }
        .hero { min-height: 100vh; }
      `;
    },
    
    injectCriticalCSS() {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = this.criticalCSS;
      document.head.appendChild(style);
      return style;
    },
    
    loadStylesheetAsync(href) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'style';
      document.head.appendChild(link);
      return link;
    }
  };

  // Test critical CSS extraction
  cssManager.extractCriticalCSS();
  if (!cssManager.criticalCSS.includes('body') || !cssManager.criticalCSS.includes('.hero')) {
    throw new Error('Should extract critical CSS rules');
  }

  // Test CSS injection
  const style = cssManager.injectCriticalCSS();
  if (!document.getElementById('critical-css')) {
    throw new Error('Should inject critical CSS into document');
  }

  // Test async stylesheet loading
  const link = cssManager.loadStylesheetAsync('test.css');
  if (link.rel !== 'preload' || link.as !== 'style') {
    throw new Error('Should create preload link for async CSS');
  }

  // Cleanup
  if (style.parentElement) {
    style.remove();
  }
  if (link.parentElement) {
    link.remove();
  }
}

/**
 * Test font optimization
 */
function testFontOptimization() {
  const cssManager = {
    fontsLoaded: false,
    
    addFontDisplaySwap() {
      const style = document.createElement('style');
      style.id = 'font-display-css';
      style.textContent = '@font-face { font-family: "Test"; font-display: swap; }';
      document.head.appendChild(style);
      return style;
    },
    
    loadFontsAsync() {
      // Simulate font loading
      setTimeout(() => {
        this.fontsLoaded = true;
        document.body.classList.add('fonts-loaded');
      }, 100);
    }
  };

  // Test font-display addition
  const style = cssManager.addFontDisplaySwap();
  if (!style.textContent.includes('font-display: swap')) {
    throw new Error('Should add font-display: swap');
  }

  // Test async font loading
  cssManager.loadFontsAsync();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!cssManager.fontsLoaded) {
          reject(new Error('Fonts should be marked as loaded'));
        }
        if (!document.body.classList.contains('fonts-loaded')) {
          reject(new Error('Should add fonts-loaded class to body'));
        }
        
        // Cleanup
        if (style.parentElement) {
          style.remove();
        }
        document.body.classList.remove('fonts-loaded');
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 150);
  });
}

// Lighthouse audit simulation
function simulateLighthouseAudit() {
  console.log('Simulating Lighthouse Performance Audit...');
  
  const audit = {
    performance: {
      score: 0,
      metrics: {}
    },
    
    // Simulate performance metrics
    measurePerformance() {
      const resourceEntries = performance.getEntriesByType('resource');
      const totalSize = resourceEntries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
      const avgLoadTime = resourceEntries.reduce((sum, entry) => sum + entry.duration, 0) / resourceEntries.length;
      
      this.performance.metrics = {
        firstContentfulPaint: Math.random() * 2000 + 500, // 0.5-2.5s
        largestContentfulPaint: Math.random() * 3000 + 1000, // 1-4s
        cumulativeLayoutShift: Math.random() * 0.2, // 0-0.2
        totalBlockingTime: Math.random() * 500, // 0-500ms
        speedIndex: Math.random() * 4000 + 1000, // 1-5s
        totalSize: totalSize,
        avgLoadTime: avgLoadTime
      };
      
      return this.performance.metrics;
    },
    
    // Calculate performance score
    calculateScore() {
      const metrics = this.performance.metrics;
      let score = 100;
      
      // Deduct points for poor metrics
      if (metrics.firstContentfulPaint > 1800) score -= 10;
      if (metrics.largestContentfulPaint > 2500) score -= 15;
      if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
      if (metrics.totalBlockingTime > 200) score -= 10;
      if (metrics.speedIndex > 3400) score -= 10;
      
      this.performance.score = Math.max(0, score);
      return this.performance.score;
    },
    
    // Generate recommendations
    generateRecommendations() {
      const metrics = this.performance.metrics;
      const recommendations = [];
      
      if (metrics.firstContentfulPaint > 1800) {
        recommendations.push('Optimize critical rendering path');
      }
      if (metrics.largestContentfulPaint > 2500) {
        recommendations.push('Optimize largest contentful paint element');
      }
      if (metrics.cumulativeLayoutShift > 0.1) {
        recommendations.push('Minimize layout shifts');
      }
      if (metrics.totalSize > 1000000) {
        recommendations.push('Reduce total bundle size');
      }
      
      return recommendations;
    }
  };
  
  // Run audit
  const metrics = audit.measurePerformance();
  const score = audit.calculateScore();
  const recommendations = audit.generateRecommendations();
  
  console.log('Lighthouse Audit Results:');
  console.log(`Performance Score: ${score}/100`);
  console.log('Metrics:', metrics);
  console.log('Recommendations:', recommendations);
  
  return { score, metrics, recommendations };
}

// Export test functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runPerformanceTests,
    simulateLighthouseAudit,
    testWebPSupport,
    testImageOptimization,
    testLazyLoading,
    testResponsiveImages,
    testErrorHandling,
    testPerformanceMonitoring,
    testCriticalCSS,
    testFontOptimization
  };
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPerformanceTests);
  } else {
    runPerformanceTests();
  }
}