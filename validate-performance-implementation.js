/**
 * Performance Implementation Validation Script
 * Validates that all performance optimizations are working correctly
 */

function validatePerformanceImplementation() {
  console.log('🚀 Validating Performance Implementation...');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };

  // Test 1: Check if performance optimizer is loaded
  if (window.performanceOptimizer) {
    results.passed++;
    results.details.push('✅ Performance Optimizer loaded');
    
    // Test WebP support detection
    if (typeof window.performanceOptimizer.checkWebPSupport === 'function') {
      results.passed++;
      results.details.push('✅ WebP support detection available');
    } else {
      results.failed++;
      results.details.push('❌ WebP support detection missing');
    }
    
    // Test image optimization
    if (typeof window.performanceOptimizer.getOptimizedImageUrl === 'function') {
      const testUrl = window.performanceOptimizer.getOptimizedImageUrl('test.jpg', { width: 800 });
      if (testUrl && testUrl.includes('w=800')) {
        results.passed++;
        results.details.push('✅ Image optimization working');
      } else {
        results.failed++;
        results.details.push('❌ Image optimization not working');
      }
    } else {
      results.failed++;
      results.details.push('❌ Image optimization missing');
    }
    
    // Test lazy loading
    if (typeof window.performanceOptimizer.initLazyLoading === 'function') {
      results.passed++;
      results.details.push('✅ Lazy loading available');
    } else {
      results.failed++;
      results.details.push('❌ Lazy loading missing');
    }
    
    // Test error handling
    if (typeof window.performanceOptimizer.showErrorMessage === 'function') {
      results.passed++;
      results.details.push('✅ Error handling available');
    } else {
      results.failed++;
      results.details.push('❌ Error handling missing');
    }
    
  } else {
    results.failed++;
    results.details.push('❌ Performance Optimizer not loaded');
  }

  // Test 2: Check if critical CSS manager is loaded
  if (window.criticalCSSManager) {
    results.passed++;
    results.details.push('✅ Critical CSS Manager loaded');
    
    // Check if critical CSS is inlined
    const criticalCSS = document.getElementById('critical-css');
    if (criticalCSS) {
      results.passed++;
      results.details.push('✅ Critical CSS inlined');
    } else {
      results.warnings++;
      results.details.push('⚠️ Critical CSS not found in DOM');
    }
    
    // Test font optimization
    if (typeof window.criticalCSSManager.loadFontsAsync === 'function') {
      results.passed++;
      results.details.push('✅ Font optimization available');
    } else {
      results.failed++;
      results.details.push('❌ Font optimization missing');
    }
    
  } else {
    results.failed++;
    results.details.push('❌ Critical CSS Manager not loaded');
  }

  // Test 3: Check performance monitoring
  if (window.PerformanceObserver) {
    results.passed++;
    results.details.push('✅ Performance Observer supported');
  } else {
    results.warnings++;
    results.details.push('⚠️ Performance Observer not supported');
  }

  // Test 4: Check Intersection Observer (for lazy loading)
  if (window.IntersectionObserver) {
    results.passed++;
    results.details.push('✅ Intersection Observer supported');
  } else {
    results.failed++;
    results.details.push('❌ Intersection Observer not supported');
  }

  // Test 5: Check if images have lazy loading attributes
  const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
  if (lazyImages.length > 0) {
    results.passed++;
    results.details.push(`✅ Found ${lazyImages.length} lazy-loaded images`);
  } else {
    results.warnings++;
    results.details.push('⚠️ No lazy-loaded images found');
  }

  // Test 6: Check CSS optimization
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  const preloadedCSS = document.querySelectorAll('link[rel="preload"][as="style"]');
  
  results.details.push(`📊 Stylesheets: ${stylesheets.length}, Preloaded: ${preloadedCSS.length}`);
  
  if (preloadedCSS.length > 0) {
    results.passed++;
    results.details.push('✅ CSS preloading implemented');
  } else {
    results.warnings++;
    results.details.push('⚠️ No CSS preloading detected');
  }

  // Test 7: Check error boundaries
  const errorMessages = document.querySelectorAll('.error-message');
  results.details.push(`📊 Error messages in DOM: ${errorMessages.length}`);

  // Test 8: Performance metrics
  if (performance && performance.getEntriesByType) {
    const resourceEntries = performance.getEntriesByType('resource');
    const navigationEntries = performance.getEntriesByType('navigation');
    
    results.details.push(`📊 Resource entries: ${resourceEntries.length}`);
    results.details.push(`📊 Navigation entries: ${navigationEntries.length}`);
    
    if (resourceEntries.length > 0) {
      results.passed++;
      results.details.push('✅ Performance API working');
      
      // Check for large resources
      const largeResources = resourceEntries.filter(entry => entry.transferSize > 100000);
      if (largeResources.length > 0) {
        results.warnings++;
        results.details.push(`⚠️ ${largeResources.length} large resources detected (>100KB)`);
      }
    }
  }

  // Test 9: Check WebP support in browser
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    results.passed++;
    results.details.push('✅ Browser supports WebP');
  } else {
    results.warnings++;
    results.details.push('⚠️ Browser does not support WebP');
  }

  // Test 10: Check reduced motion support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion) {
    results.passed++;
    results.details.push(`✅ Reduced motion preference: ${prefersReducedMotion.matches ? 'enabled' : 'disabled'}`);
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.passed + results.failed + results.warnings,
      passed: results.passed,
      failed: results.failed,
      warnings: results.warnings,
      score: Math.round((results.passed / (results.passed + results.failed)) * 100)
    },
    details: results.details
  };

  // Display results
  console.log('\n📋 Performance Implementation Validation Report');
  console.log('='.repeat(50));
  console.log(`Score: ${report.summary.score}%`);
  console.log(`Passed: ${report.summary.passed}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`Warnings: ${report.summary.warnings}`);
  console.log('\nDetails:');
  report.details.forEach(detail => console.log(detail));

  // Show in DOM if available
  displayReportInDOM(report);

  return report;
}

function displayReportInDOM(report) {
  // Create or update report display
  let reportElement = document.getElementById('performance-validation-report');
  
  if (!reportElement) {
    reportElement = document.createElement('div');
    reportElement.id = 'performance-validation-report';
    reportElement.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(reportElement);
  }

  const scoreColor = report.summary.score >= 80 ? '#28a745' : 
                    report.summary.score >= 60 ? '#ffc107' : '#dc3545';

  reportElement.innerHTML = `
    <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
      <h3 style="margin: 0; color: #333;">Performance Validation</h3>
      <div style="font-size: 18px; font-weight: bold; color: ${scoreColor};">
        Score: ${report.summary.score}%
      </div>
    </div>
    
    <div style="margin-bottom: 10px;">
      <div style="color: #28a745;">✅ Passed: ${report.summary.passed}</div>
      <div style="color: #dc3545;">❌ Failed: ${report.summary.failed}</div>
      <div style="color: #ffc107;">⚠️ Warnings: ${report.summary.warnings}</div>
    </div>
    
    <div style="max-height: 300px; overflow-y: auto;">
      ${report.details.map(detail => `<div style="margin: 2px 0;">${detail}</div>`).join('')}
    </div>
    
    <button onclick="this.parentElement.remove()" style="
      position: absolute;
      top: 5px;
      right: 5px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 12px;
    ">×</button>
  `;
}

// Auto-run validation when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(validatePerformanceImplementation, 1000);
  });
} else {
  setTimeout(validatePerformanceImplementation, 1000);
}

// Export for manual testing
window.validatePerformanceImplementation = validatePerformanceImplementation;