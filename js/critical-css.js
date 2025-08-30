/**
 * Critical CSS Management
 * Handles critical CSS inlining and font loading optimization
 */

class CriticalCSSManager {
  constructor() {
    this.criticalCSS = '';
    this.nonCriticalCSS = [];
    this.fontsLoaded = false;
    this.init();
  }

  init() {
    // Extract and inline critical CSS
    this.extractCriticalCSS();
    
    // Optimize font loading
    this.optimizeFontLoading();
    
    // Load non-critical CSS asynchronously
    this.loadNonCriticalCSS();
  }

  /**
   * Extract critical CSS for above-the-fold content
   */
  extractCriticalCSS() {
    // Define critical CSS for above-the-fold content
    this.criticalCSS = `
      /* Critical CSS - Above the fold */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :root {
        --color-primary: #ff6b35;
        --color-secondary: #ffffff;
        --color-dark: #000000;
        --color-background: #ffffff;
        --color-surface: #fafafa;
        --color-text-primary: #171717;
        --color-text-secondary: #525252;
        --color-text-muted: #737373;
        --color-border: #e5e5e5;
        --color-accent: #ff6b35;
        --font-family-display: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
        --font-family-base: 'Helvetica Neue', Arial, sans-serif;
        --font-size-display: 6rem;
        --font-size-h1: 4rem;
        --font-size-h2: 2.5rem;
        --font-size-body: 1rem;
        --space-4: 1rem;
        --space-8: 2rem;
        --space-16: 4rem;
        --space-24: 6rem;
        --container-max-width: 1200px;
        --header-height: 4rem;
        --transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1);
        --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      [data-theme="dark"] {
        --color-background: #0a0a0a;
        --color-surface: #1a1a1a;
        --color-text-primary: #ffffff;
        --color-text-secondary: #d4d4d4;
        --color-text-muted: #a3a3a3;
        --color-border: #404040;
        --color-secondary: #0a0a0a;
        --color-dark: #ffffff;
      }

      html {
        scroll-behavior: smooth;
        font-size: 16px;
        scroll-padding-top: var(--header-height);
      }

      body {
        font-family: var(--font-family-base);
        font-size: var(--font-size-body);
        line-height: 1.6;
        color: var(--color-text-primary);
        background-color: var(--color-background);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Header - Critical for first paint */
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--header-height);
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--color-border);
        z-index: 1000;
        transition: all var(--transition-normal);
      }

      [data-theme="dark"] .header {
        background-color: rgba(10, 10, 10, 0.95);
      }

      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        max-width: var(--container-max-width);
        margin: 0 auto;
        padding: 0 var(--space-4);
      }

      .nav-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      /* Hero Section - Critical for LCP */
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding-top: var(--header-height);
        background: linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%);
      }

      .hero-content {
        max-width: 800px;
        padding: 0 var(--space-4);
      }

      .hero-title {
        font-size: clamp(2.5rem, 8vw, var(--font-size-display));
        font-weight: 900;
        margin-bottom: var(--space-4);
        background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-subtitle {
        font-size: clamp(1.125rem, 3vw, 1.5rem);
        color: var(--color-text-secondary);
        margin-bottom: var(--space-8);
      }

      /* Container - Critical layout */
      .container {
        max-width: var(--container-max-width);
        margin: 0 auto;
        padding: 0 var(--space-4);
      }

      /* Loading states */
      .loading {
        opacity: 0.6;
        position: relative;
      }

      .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid var(--color-border);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Skip link for accessibility */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-accent);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        font-weight: bold;
      }

      .skip-link:focus {
        top: 6px;
      }

      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
        
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;

    // Inject critical CSS
    this.injectCriticalCSS();
  }

  /**
   * Inject critical CSS into the document head
   */
  injectCriticalCSS() {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = this.criticalCSS;
    
    // Insert before any existing stylesheets
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      document.head.insertBefore(style, firstLink);
    } else {
      document.head.appendChild(style);
    }
  }

  /**
   * Optimize font loading with font-display and preloading
   */
  optimizeFontLoading() {
    // Add font-display: swap to existing fonts
    this.addFontDisplaySwap();
    
    // Preload critical fonts
    this.preloadCriticalFonts();
    
    // Load fonts asynchronously
    this.loadFontsAsync();
  }

  /**
   * Add font-display: swap to improve loading performance
   */
  addFontDisplaySwap() {
    const fontFaceCSS = `
      @font-face {
        font-family: 'Helvetica Neue';
        font-display: swap;
        src: local('Helvetica Neue'), local('HelveticaNeue');
      }
      
      @font-face {
        font-family: 'Arial Black';
        font-display: swap;
        src: local('Arial Black'), local('ArialBlack');
      }
      
      @font-face {
        font-family: 'SF Mono';
        font-display: swap;
        src: local('SF Mono'), local('SFMono-Regular');
      }
    `;

    const style = document.createElement('style');
    style.id = 'font-display-css';
    style.textContent = fontFaceCSS;
    document.head.appendChild(style);
  }

  /**
   * Preload critical fonts
   */
  preloadCriticalFonts() {
    const criticalFonts = [
      // System fonts don't need preloading, but we can prepare for web fonts
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.url;
      link.as = 'font';
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Load fonts asynchronously to prevent render blocking
   */
  loadFontsAsync() {
    // Use Font Loading API if available
    if ('fonts' in document) {
      // Load fonts and track when they're ready
      document.fonts.ready.then(() => {
        this.fontsLoaded = true;
        document.body.classList.add('fonts-loaded');
        console.log('Fonts loaded successfully');
      });

      // Set a timeout to prevent indefinite waiting
      setTimeout(() => {
        if (!this.fontsLoaded) {
          this.fontsLoaded = true;
          document.body.classList.add('fonts-loaded');
          console.log('Font loading timeout - using fallback fonts');
        }
      }, 3000);
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => {
        this.fontsLoaded = true;
        document.body.classList.add('fonts-loaded');
      }, 100);
    }
  }

  /**
   * Load non-critical CSS asynchronously
   */
  loadNonCriticalCSS() {
    // Wait for critical content to load first
    requestIdleCallback(() => {
      this.loadStylesheetAsync('css/components.css');
      this.loadStylesheetAsync('css/responsive.css');
    }, { timeout: 2000 });
  }

  /**
   * Load stylesheet asynchronously without blocking render
   */
  loadStylesheetAsync(href) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    
    link.onload = () => {
      // Convert to stylesheet after loading
      link.rel = 'stylesheet';
      link.onload = null;
    };
    
    // Fallback for browsers that don't support preload
    setTimeout(() => {
      if (link.rel !== 'stylesheet') {
        link.rel = 'stylesheet';
      }
    }, 1000);
    
    document.head.appendChild(link);
  }

  /**
   * Optimize CSS delivery based on viewport
   */
  optimizeCSSDelivery() {
    // Load mobile-specific CSS only on mobile devices
    if (window.innerWidth <= 768) {
      this.loadStylesheetAsync('css/mobile.css');
    }
    
    // Load print CSS only when needed
    const printLink = document.createElement('link');
    printLink.rel = 'stylesheet';
    printLink.href = 'css/print.css';
    printLink.media = 'print';
    document.head.appendChild(printLink);
  }

  /**
   * Remove unused CSS (simplified version)
   */
  removeUnusedCSS() {
    // This would typically be done at build time
    // For runtime, we can remove specific unused rules
    const unusedSelectors = [
      '.unused-class',
      '.development-only'
    ];

    unusedSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          // Remove from stylesheets if no elements match
          this.removeCSSRule(selector);
        }
      } catch (e) {
        // Ignore invalid selectors
      }
    });
  }

  /**
   * Remove specific CSS rule from stylesheets
   */
  removeCSSRule(selector) {
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let i = rules.length - 1; i >= 0; i--) {
          const rule = rules[i];
          if (rule.selectorText && rule.selectorText.includes(selector)) {
            sheet.deleteRule(i);
          }
        }
      } catch (e) {
        // Can't access cross-origin stylesheets
      }
    });
  }

  /**
   * Get CSS loading performance metrics
   */
  getCSSMetrics() {
    const stylesheets = Array.from(document.styleSheets);
    const metrics = {
      totalStylesheets: stylesheets.length,
      criticalCSSInlined: !!document.getElementById('critical-css'),
      fontsLoaded: this.fontsLoaded,
      loadTimes: []
    };

    // Get load times from performance API
    const resourceEntries = performance.getEntriesByType('resource');
    resourceEntries.forEach(entry => {
      if (entry.name.includes('.css')) {
        metrics.loadTimes.push({
          url: entry.name,
          duration: entry.duration,
          size: entry.transferSize
        });
      }
    });

    return metrics;
  }
}

// Initialize critical CSS manager
window.criticalCSSManager = new CriticalCSSManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CriticalCSSManager;
}