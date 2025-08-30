// Responsive Design Test Suite
class ResponsiveDesignTester {
  constructor() {
    this.breakpoints = {
      mobile: 767,
      tablet: 1023,
      desktop: 1439
    };
    
    this.testResults = [];
    this.currentBreakpoint = this.getCurrentBreakpoint();
    
    this.init();
  }

  init() {
    this.setupResizeListener();
    this.runAllTests();
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width <= this.breakpoints.mobile) return 'mobile';
    if (width <= this.breakpoints.tablet) return 'tablet';
    if (width <= this.breakpoints.desktop) return 'desktop';
    return 'large-desktop';
  }

  setupResizeListener() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
          this.currentBreakpoint = newBreakpoint;
          this.runAllTests();
          this.logBreakpointChange(newBreakpoint);
        }
      }, 250);
    });
  }

  runAllTests() {
    this.testResults = [];
    
    // Core responsive tests
    this.testGridSystem();
    this.testTypographyScaling();
    this.testNavigationBehavior();
    this.testTouchTargets();
    this.testContainerPadding();
    this.testImageResponsiveness();
    this.testButtonBehavior();
    this.testCardLayout();
    
    this.generateReport();
  }

  testGridSystem() {
    const gridElements = document.querySelectorAll('.grid-cols-4, .grid-cols-3, .grid-cols-2');
    
    gridElements.forEach(grid => {
      const computedStyle = window.getComputedStyle(grid);
      const gridColumns = computedStyle.gridTemplateColumns;
      const expectedColumns = this.getExpectedGridColumns(grid.className);
      
      this.testResults.push({
        test: 'Grid System',
        element: grid.className,
        breakpoint: this.currentBreakpoint,
        expected: expectedColumns,
        actual: gridColumns.split(' ').length,
        passed: this.validateGridColumns(grid.className, gridColumns)
      });
    });
  }

  getExpectedGridColumns(className) {
    const breakpoint = this.currentBreakpoint;
    
    if (className.includes('grid-cols-4')) {
      if (breakpoint === 'mobile') return 1;
      if (breakpoint === 'tablet') return 2;
      return 4;
    }
    
    if (className.includes('grid-cols-3')) {
      if (breakpoint === 'mobile') return 1;
      if (breakpoint === 'tablet') return 2;
      return 3;
    }
    
    if (className.includes('grid-cols-2')) {
      if (breakpoint === 'mobile') return 1;
      return 2;
    }
    
    return 1;
  }

  validateGridColumns(className, gridColumns) {
    const actualColumns = gridColumns.split(' ').length;
    const expectedColumns = this.getExpectedGridColumns(className);
    
    return actualColumns === expectedColumns;
  }

  testTypographyScaling() {
    const typographyElements = [
      { selector: '.typography-display, .hero-title', property: 'fontSize' },
      { selector: '.typography-h1, h1', property: 'fontSize' },
      { selector: '.typography-h2, h2', property: 'fontSize' },
      { selector: '.typography-h3, h3', property: 'fontSize' }
    ];

    typographyElements.forEach(({ selector, property }) => {
      const element = document.querySelector(selector);
      
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle[property]);
        const isAppropriateSize = this.validateTypographySize(fontSize, selector);
        
        this.testResults.push({
          test: 'Typography Scaling',
          element: selector,
          breakpoint: this.currentBreakpoint,
          fontSize: `${fontSize}px`,
          passed: isAppropriateSize
        });
      }
    });
  }

  validateTypographySize(fontSize, selector) {
    const breakpoint = this.currentBreakpoint;
    
    // Minimum readable sizes for mobile
    if (breakpoint === 'mobile') {
      if (selector.includes('display') || selector.includes('hero-title')) {
        return fontSize >= 32; // 2rem minimum
      }
      if (selector.includes('h1')) {
        return fontSize >= 28; // 1.75rem minimum
      }
      if (selector.includes('h2')) {
        return fontSize >= 24; // 1.5rem minimum
      }
      if (selector.includes('h3')) {
        return fontSize >= 20; // 1.25rem minimum
      }
    }
    
    return fontSize >= 16; // Base minimum
  }

  testNavigationBehavior() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navToggle) {
      const navMenuStyle = window.getComputedStyle(navMenu);
      const navToggleStyle = window.getComputedStyle(navToggle);
      
      const isMobile = this.currentBreakpoint === 'mobile';
      const menuHidden = navMenuStyle.transform.includes('translateX');
      const toggleVisible = navToggleStyle.display !== 'none';
      
      this.testResults.push({
        test: 'Navigation Behavior',
        breakpoint: this.currentBreakpoint,
        mobileMenuHidden: menuHidden,
        hamburgerVisible: toggleVisible,
        passed: isMobile ? (menuHidden && toggleVisible) : (!toggleVisible)
      });
    }
  }

  testTouchTargets() {
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    let touchTargetFailures = 0;
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      // Check if element meets minimum touch target size (44px)
      const minSize = 44;
      const width = Math.max(rect.width, parseFloat(computedStyle.minWidth) || 0);
      const height = Math.max(rect.height, parseFloat(computedStyle.minHeight) || 0);
      
      if (this.currentBreakpoint === 'mobile' && (width < minSize || height < minSize)) {
        touchTargetFailures++;
      }
    });
    
    this.testResults.push({
      test: 'Touch Targets',
      breakpoint: this.currentBreakpoint,
      totalElements: interactiveElements.length,
      failures: touchTargetFailures,
      passed: touchTargetFailures === 0 || this.currentBreakpoint !== 'mobile'
    });
  }

  testContainerPadding() {
    const containers = document.querySelectorAll('.container');
    
    containers.forEach(container => {
      const computedStyle = window.getComputedStyle(container);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);
      
      const expectedPadding = this.getExpectedContainerPadding();
      const actualPadding = Math.min(paddingLeft, paddingRight);
      
      this.testResults.push({
        test: 'Container Padding',
        breakpoint: this.currentBreakpoint,
        expected: `${expectedPadding}px`,
        actual: `${actualPadding}px`,
        passed: Math.abs(actualPadding - expectedPadding) <= 2 // Allow 2px tolerance
      });
    });
  }

  getExpectedContainerPadding() {
    switch (this.currentBreakpoint) {
      case 'mobile': return 16; // 1rem
      case 'tablet': return 24; // 1.5rem
      case 'desktop': return 16; // 1rem
      case 'large-desktop': return 32; // 2rem
      default: return 16;
    }
  }

  testImageResponsiveness() {
    const images = document.querySelectorAll('img');
    let responsiveFailures = 0;
    
    images.forEach(image => {
      const computedStyle = window.getComputedStyle(image);
      const maxWidth = computedStyle.maxWidth;
      const height = computedStyle.height;
      
      // Check if image is responsive
      if (maxWidth !== '100%' && !maxWidth.includes('%')) {
        responsiveFailures++;
      }
      
      // Check if height is auto for aspect ratio preservation
      if (height !== 'auto' && !height.includes('auto')) {
        // Allow specific heights for certain image types (avatars, etc.)
        const isAvatarOrFixed = image.classList.contains('headshot') || 
                               image.classList.contains('avatar') ||
                               image.closest('.hero');
        
        if (!isAvatarOrFixed) {
          responsiveFailures++;
        }
      }
    });
    
    this.testResults.push({
      test: 'Image Responsiveness',
      totalImages: images.length,
      failures: responsiveFailures,
      passed: responsiveFailures === 0
    });
  }

  testButtonBehavior() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      const computedStyle = window.getComputedStyle(button);
      const width = computedStyle.width;
      
      // On mobile, buttons should be full-width or have appropriate sizing
      const isMobile = this.currentBreakpoint === 'mobile';
      const isFullWidth = width === '100%' || parseFloat(width) >= window.innerWidth * 0.8;
      const hasMinWidth = parseFloat(computedStyle.minWidth) >= 44;
      
      this.testResults.push({
        test: 'Button Behavior',
        element: button.className,
        breakpoint: this.currentBreakpoint,
        width: width,
        passed: !isMobile || isFullWidth || hasMinWidth
      });
    });
  }

  testCardLayout() {
    const cardContainers = document.querySelectorAll('.grid');
    
    cardContainers.forEach(container => {
      const cards = container.querySelectorAll('.card, .timeline-card, .project-card');
      
      if (cards.length > 0) {
        const containerRect = container.getBoundingClientRect();
        const firstCardRect = cards[0].getBoundingClientRect();
        
        // Check if cards stack properly on mobile
        const isMobile = this.currentBreakpoint === 'mobile';
        const cardsStack = this.checkCardsStack(cards);
        
        this.testResults.push({
          test: 'Card Layout',
          breakpoint: this.currentBreakpoint,
          cardCount: cards.length,
          stacksOnMobile: cardsStack,
          passed: !isMobile || cardsStack
        });
      }
    });
  }

  checkCardsStack(cards) {
    if (cards.length < 2) return true;
    
    const firstCard = cards[0].getBoundingClientRect();
    const secondCard = cards[1].getBoundingClientRect();
    
    // Cards stack if the second card is below the first (allowing for small overlap)
    return secondCard.top >= firstCard.bottom - 10;
  }

  generateReport() {
    const passedTests = this.testResults.filter(result => result.passed).length;
    const totalTests = this.testResults.length;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.group(`🔍 Responsive Design Test Report - ${this.currentBreakpoint.toUpperCase()}`);
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${passRate}%)`);
    console.log(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`🎯 Breakpoint: ${this.currentBreakpoint}`);
    
    // Group results by test type
    const groupedResults = this.groupResultsByTest();
    
    Object.entries(groupedResults).forEach(([testName, results]) => {
      const testPassed = results.every(r => r.passed);
      const icon = testPassed ? '✅' : '❌';
      
      console.group(`${icon} ${testName}`);
      
      results.forEach(result => {
        if (!result.passed) {
          console.warn('Failed:', result);
        } else {
          console.log('Passed:', result);
        }
      });
      
      console.groupEnd();
    });
    
    console.groupEnd();
    
    // Dispatch custom event with results
    window.dispatchEvent(new CustomEvent('responsiveTestComplete', {
      detail: {
        breakpoint: this.currentBreakpoint,
        results: this.testResults,
        passRate: passRate,
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }
    }));
  }

  groupResultsByTest() {
    return this.testResults.reduce((groups, result) => {
      const testName = result.test;
      if (!groups[testName]) {
        groups[testName] = [];
      }
      groups[testName].push(result);
      return groups;
    }, {});
  }

  logBreakpointChange(newBreakpoint) {
    console.log(`📱 Breakpoint changed to: ${newBreakpoint.toUpperCase()} (${window.innerWidth}px)`);
  }

  // Public method to manually run tests
  runTests() {
    this.runAllTests();
  }

  // Public method to get current results
  getResults() {
    return {
      breakpoint: this.currentBreakpoint,
      results: this.testResults,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only run tests if we're in a test environment or explicitly requested
  if (window.location.pathname.includes('test') || 
      window.location.search.includes('test=responsive') ||
      localStorage.getItem('enableResponsiveTests') === 'true') {
    
    window.responsiveTester = new ResponsiveDesignTester();
    
    // Add global method for manual testing
    window.testResponsive = () => {
      window.responsiveTester.runTests();
    };
    
    console.log('🔧 Responsive Design Tester initialized');
    console.log('💡 Run window.testResponsive() to manually test current viewport');
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveDesignTester;
}