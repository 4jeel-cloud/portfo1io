// Responsive Implementation Validation Script
// Run this in browser console to validate responsive design implementation

class ResponsiveValidator {
  constructor() {
    this.results = [];
    this.breakpoints = {
      mobile: 767,
      tablet: 1023,
      desktop: 1439
    };
  }

  async validateAll() {
    console.log('🔍 Starting Responsive Design Validation...\n');
    
    // Test different viewport sizes
    const viewports = [
      { name: 'Mobile Portrait', width: 375, height: 667 },
      { name: 'Mobile Landscape', width: 667, height: 375 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop', width: 1200, height: 800 },
      { name: 'Large Desktop', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await this.testViewport(viewport);
    }

    this.generateFinalReport();
  }

  async testViewport(viewport) {
    console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    // Simulate viewport resize (for testing purposes)
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    
    try {
      // Test CSS media queries
      this.testMediaQueries(viewport.width);
      
      // Test navigation behavior
      this.testNavigationAtViewport(viewport.width);
      
      // Test grid systems
      this.testGridSystemAtViewport(viewport.width);
      
      // Test typography scaling
      this.testTypographyAtViewport(viewport.width);
      
      // Test touch targets
      this.testTouchTargetsAtViewport(viewport.width);
      
      console.log(`✅ ${viewport.name} tests completed\n`);
      
    } catch (error) {
      console.error(`❌ Error testing ${viewport.name}:`, error);
    }
  }

  testMediaQueries(width) {
    const testQueries = [
      { query: '(max-width: 767px)', expectedMatch: width <= 767 },
      { query: '(max-width: 1023px)', expectedMatch: width <= 1023 },
      { query: '(min-width: 768px)', expectedMatch: width >= 768 },
      { query: '(min-width: 1024px)', expectedMatch: width >= 1024 },
      { query: '(min-width: 1440px)', expectedMatch: width >= 1440 }
    ];

    testQueries.forEach(({ query, expectedMatch }) => {
      const matches = window.matchMedia(query).matches;
      const passed = matches === expectedMatch;
      
      this.results.push({
        test: 'Media Query',
        query,
        width,
        expected: expectedMatch,
        actual: matches,
        passed
      });
      
      if (!passed) {
        console.warn(`❌ Media query failed: ${query} at ${width}px`);
      }
    });
  }

  testNavigationAtViewport(width) {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (!navMenu || !navToggle) {
      console.warn('⚠️ Navigation elements not found');
      return;
    }

    const isMobile = width <= this.breakpoints.mobile;
    const navToggleStyle = window.getComputedStyle(navToggle);
    const navMenuStyle = window.getComputedStyle(navMenu);
    
    // Check hamburger visibility
    const hamburgerVisible = navToggleStyle.display !== 'none';
    const hamburgerTest = isMobile ? hamburgerVisible : !hamburgerVisible;
    
    // Check menu positioning
    const menuPositioned = isMobile ? 
      navMenuStyle.position === 'fixed' : 
      navMenuStyle.position !== 'fixed';
    
    this.results.push({
      test: 'Navigation Behavior',
      width,
      isMobile,
      hamburgerVisible,
      menuPositioned,
      passed: hamburgerTest && menuPositioned
    });
    
    if (!hamburgerTest) {
      console.warn(`❌ Navigation hamburger visibility incorrect at ${width}px`);
    }
    if (!menuPositioned) {
      console.warn(`❌ Navigation menu positioning incorrect at ${width}px`);
    }
  }

  testGridSystemAtViewport(width) {
    const gridTests = [
      { selector: '.grid-cols-4', expectedCols: this.getExpectedColumns(4, width) },
      { selector: '.grid-cols-3', expectedCols: this.getExpectedColumns(3, width) },
      { selector: '.grid-cols-2', expectedCols: this.getExpectedColumns(2, width) }
    ];

    gridTests.forEach(({ selector, expectedCols }) => {
      const element = document.querySelector(selector);
      
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const gridColumns = computedStyle.gridTemplateColumns;
        const actualCols = gridColumns === 'none' ? 1 : gridColumns.split(' ').length;
        
        const passed = actualCols === expectedCols;
        
        this.results.push({
          test: 'Grid System',
          selector,
          width,
          expected: expectedCols,
          actual: actualCols,
          passed
        });
        
        if (!passed) {
          console.warn(`❌ Grid ${selector} has ${actualCols} columns, expected ${expectedCols} at ${width}px`);
        }
      }
    });
  }

  getExpectedColumns(maxCols, width) {
    if (width <= this.breakpoints.mobile) return 1;
    if (width <= this.breakpoints.tablet) return Math.min(maxCols, 2);
    return maxCols;
  }

  testTypographyAtViewport(width) {
    const typographyTests = [
      { selector: '.hero-title, .typography-display', minSize: width <= 767 ? 32 : 48 },
      { selector: 'h1, .typography-h1', minSize: width <= 767 ? 28 : 32 },
      { selector: 'h2, .typography-h2', minSize: width <= 767 ? 24 : 28 },
      { selector: 'h3, .typography-h3', minSize: width <= 767 ? 20 : 24 }
    ];

    typographyTests.forEach(({ selector, minSize }) => {
      const element = document.querySelector(selector);
      
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const passed = fontSize >= minSize;
        
        this.results.push({
          test: 'Typography Scaling',
          selector,
          width,
          minSize,
          actualSize: fontSize,
          passed
        });
        
        if (!passed) {
          console.warn(`❌ Typography ${selector} is ${fontSize}px, minimum ${minSize}px at ${width}px`);
        }
      }
    });
  }

  testTouchTargetsAtViewport(width) {
    if (width > this.breakpoints.mobile) return; // Only test on mobile
    
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    let failures = 0;
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      const minWidth = Math.max(rect.width, parseFloat(computedStyle.minWidth) || 0);
      const minHeight = Math.max(rect.height, parseFloat(computedStyle.minHeight) || 0);
      
      const meetsStandard = minWidth >= 44 && minHeight >= 44;
      
      if (!meetsStandard) {
        failures++;
        console.warn(`❌ Touch target too small: ${element.tagName}.${element.className} (${minWidth}x${minHeight})`);
      }
    });
    
    this.results.push({
      test: 'Touch Targets',
      width,
      totalElements: interactiveElements.length,
      failures,
      passed: failures === 0
    });
  }

  testContainerPadding() {
    const containers = document.querySelectorAll('.container');
    
    containers.forEach(container => {
      const computedStyle = window.getComputedStyle(container);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);
      
      // Check if padding is appropriate for current viewport
      const width = window.innerWidth;
      const expectedPadding = this.getExpectedPadding(width);
      const actualPadding = Math.min(paddingLeft, paddingRight);
      
      const passed = Math.abs(actualPadding - expectedPadding) <= 4; // 4px tolerance
      
      this.results.push({
        test: 'Container Padding',
        width,
        expected: expectedPadding,
        actual: actualPadding,
        passed
      });
      
      if (!passed) {
        console.warn(`❌ Container padding is ${actualPadding}px, expected ~${expectedPadding}px`);
      }
    });
  }

  getExpectedPadding(width) {
    if (width <= 767) return 16; // 1rem
    if (width <= 1023) return 24; // 1.5rem
    return 16; // 1rem for desktop
  }

  testImageResponsiveness() {
    const images = document.querySelectorAll('img');
    let failures = 0;
    
    images.forEach(image => {
      const computedStyle = window.getComputedStyle(image);
      const maxWidth = computedStyle.maxWidth;
      
      // Images should have max-width: 100% or be explicitly sized
      const isResponsive = maxWidth === '100%' || 
                          maxWidth.includes('%') || 
                          image.classList.contains('headshot') ||
                          image.closest('.hero');
      
      if (!isResponsive) {
        failures++;
        console.warn(`❌ Image not responsive: ${image.src || image.className}`);
      }
    });
    
    this.results.push({
      test: 'Image Responsiveness',
      totalImages: images.length,
      failures,
      passed: failures === 0
    });
  }

  generateFinalReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESPONSIVE DESIGN VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${passedTests}/${totalTests} (${passRate}%)`);
    console.log(`❌ Tests Failed: ${totalTests - passedTests}`);
    
    // Group failures by test type
    const failures = this.results.filter(r => !r.passed);
    const failuresByType = failures.reduce((acc, failure) => {
      acc[failure.test] = (acc[failure.test] || 0) + 1;
      return acc;
    }, {});
    
    if (Object.keys(failuresByType).length > 0) {
      console.log('\n❌ FAILURES BY TYPE:');
      Object.entries(failuresByType).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} failures`);
      });
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (failuresByType['Touch Targets']) {
      console.log('   • Increase touch target sizes to minimum 44x44px on mobile');
    }
    
    if (failuresByType['Grid System']) {
      console.log('   • Review CSS grid responsive breakpoints');
    }
    
    if (failuresByType['Typography Scaling']) {
      console.log('   • Adjust font sizes for better mobile readability');
    }
    
    if (failuresByType['Navigation Behavior']) {
      console.log('   • Fix mobile navigation menu behavior');
    }
    
    if (passRate >= 90) {
      console.log('🎉 Excellent responsive design implementation!');
    } else if (passRate >= 75) {
      console.log('👍 Good responsive design with room for improvement');
    } else {
      console.log('⚠️ Responsive design needs significant improvements');
    }
    
    console.log('='.repeat(60));
    
    return {
      totalTests,
      passedTests,
      passRate: parseFloat(passRate),
      failures: failuresByType,
      results: this.results
    };
  }
}

// Auto-run validation
console.log('🚀 Initializing Responsive Design Validator...');
const validator = new ResponsiveValidator();

// Add current viewport tests
validator.testContainerPadding();
validator.testImageResponsiveness();
validator.testNavigationAtViewport(window.innerWidth);
validator.testGridSystemAtViewport(window.innerWidth);
validator.testTypographyAtViewport(window.innerWidth);
validator.testTouchTargetsAtViewport(window.innerWidth);

// Generate report for current viewport
const report = validator.generateFinalReport();

// Make validator available globally
window.responsiveValidator = validator;

console.log('\n💡 Run validator.validateAll() to test all viewport sizes');
console.log('💡 Run validator.testViewport({name: "Custom", width: 800, height: 600}) for custom sizes');