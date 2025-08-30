// Integration tests for the main App component
class AppIntegrationTests {
  constructor() {
    this.testResults = [];
    this.app = null;
  }

  async runAllTests() {
    console.log('🧪 Starting App Integration Tests...');
    
    try {
      // Setup test environment
      await this.setupTestEnvironment();
      
      // Run all test suites
      await this.testAppInitialization();
      await this.testComponentRegistration();
      await this.testDataManagement();
      await this.testSmoothScrolling();
      await this.testSectionIntegration();
      await this.testErrorHandling();
      await this.testPublicAPI();
      await this.testEventSystem();
      
      // Generate test report
      this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.addTestResult('Test Suite', false, `Test suite failed: ${error.message}`);
    }
  }

  async setupTestEnvironment() {
    console.log('🔧 Setting up test environment...');
    
    // Ensure DOM is ready
    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        window.addEventListener('load', resolve);
      });
    }
    
    // Wait for app to be available
    let attempts = 0;
    while (!window.portfolioApp && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.portfolioApp) {
      throw new Error('Portfolio app not available after 5 seconds');
    }
    
    this.app = window.portfolioApp;
    console.log('✅ Test environment ready');
  }

  async testAppInitialization() {
    console.log('🧪 Testing App Initialization...');
    
    // Test 1: App instance exists
    this.addTestResult(
      'App Instance Creation',
      this.app instanceof window.App,
      'App should be an instance of the App class'
    );
    
    // Test 2: App is loaded
    this.addTestResult(
      'App Load Status',
      this.app.isLoaded === true,
      'App should be marked as loaded'
    );
    
    // Test 3: Theme is initialized
    this.addTestResult(
      'Theme Initialization',
      typeof this.app.currentTheme === 'string' && this.app.currentTheme.length > 0,
      'App should have a current theme set'
    );
    
    // Test 4: Components map exists
    this.addTestResult(
      'Components Map',
      this.app.components instanceof Map,
      'App should have a components Map'
    );
  }

  async testComponentRegistration() {
    console.log('🧪 Testing Component Registration...');
    
    const expectedComponents = ['hero', 'about', 'summary', 'experience', 'projects', 'skills', 'contact'];
    
    // Test 1: All expected components are registered
    expectedComponents.forEach(componentName => {
      this.addTestResult(
        `Component Registration: ${componentName}`,
        this.app.components.has(componentName),
        `${componentName} component should be registered`
      );
    });
    
    // Test 2: Component count matches expected
    this.addTestResult(
      'Component Count',
      this.app.components.size === expectedComponents.length,
      `Should have ${expectedComponents.length} components registered`
    );
    
    // Test 3: Each component has required properties
    this.app.components.forEach((component, name) => {
      this.addTestResult(
        `Component Structure: ${name}`,
        component.element && typeof component.populateMethod === 'function',
        `${name} component should have element and populateMethod`
      );
    });
  }

  async testDataManagement() {
    console.log('🧪 Testing Data Management...');
    
    // Test 1: Portfolio data is loaded
    this.addTestResult(
      'Portfolio Data Loaded',
      window.portfolioData && window.portfolioData.isLoaded,
      'Portfolio data should be loaded'
    );
    
    // Test 2: Data sections are available
    const dataSections = ['personal', 'experience', 'projects', 'skills'];
    dataSections.forEach(section => {
      const data = window.portfolioData[`get${section.charAt(0).toUpperCase() + section.slice(1)}`]?.();
      this.addTestResult(
        `Data Section: ${section}`,
        data !== null && data !== undefined,
        `${section} data should be available`
      );
    });
    
    // Test 3: Data validation
    if (window.portfolioData.getValidationErrors) {
      const errors = window.portfolioData.getValidationErrors();
      this.addTestResult(
        'Data Validation',
        Array.isArray(errors),
        'Validation errors should be an array'
      );
    }
  }

  async testSmoothScrolling() {
    console.log('🧪 Testing Smooth Scrolling...');
    
    // Test 1: Smooth scroll function exists
    this.addTestResult(
      'Smooth Scroll Function',
      typeof window.scrollToSection === 'function',
      'Global scrollToSection function should exist'
    );
    
    // Test 2: Scroll behavior is set
    this.addTestResult(
      'Scroll Behavior CSS',
      document.documentElement.style.scrollBehavior === 'smooth',
      'Document should have smooth scroll behavior'
    );
    
    // Test 3: Navigation links have proper href attributes
    const navLinks = document.querySelectorAll('.nav-link');
    let validNavLinks = 0;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && document.querySelector(href)) {
        validNavLinks++;
      }
    });
    
    this.addTestResult(
      'Navigation Links',
      validNavLinks === navLinks.length,
      'All navigation links should point to valid sections'
    );
  }

  async testSectionIntegration() {
    console.log('🧪 Testing Section Integration...');
    
    // Test 1: All sections are populated
    let populatedCount = 0;
    this.app.components.forEach((component, name) => {
      if (component.populated) {
        populatedCount++;
      }
    });
    
    this.addTestResult(
      'Section Population',
      populatedCount === this.app.components.size,
      'All sections should be populated'
    );
    
    // Test 2: Sections have consistent spacing
    const sections = document.querySelectorAll('.section');
    let optimizedSections = 0;
    sections.forEach(section => {
      if (section.classList.contains('section-optimized')) {
        optimizedSections++;
      }
    });
    
    this.addTestResult(
      'Section Spacing Optimization',
      optimizedSections > 0,
      'Sections should have spacing optimization applied'
    );
    
    // Test 3: ARIA landmarks are properly set
    let ariaCompliantSections = 0;
    sections.forEach(section => {
      if (section.getAttribute('aria-labelledby') || section.getAttribute('aria-label')) {
        ariaCompliantSections++;
      }
    });
    
    this.addTestResult(
      'ARIA Compliance',
      ariaCompliantSections > 0,
      'Sections should have proper ARIA landmarks'
    );
  }

  async testErrorHandling() {
    console.log('🧪 Testing Error Handling...');
    
    // Test 1: Error handling for invalid component refresh
    const refreshResult = this.app.refreshComponent('nonexistent');
    this.addTestResult(
      'Invalid Component Refresh',
      refreshResult === false,
      'Refreshing nonexistent component should return false'
    );
    
    // Test 2: Error handling for missing elements
    const originalComponent = this.app.components.get('hero');
    if (originalComponent) {
      // Temporarily remove element to test error handling
      const originalElement = originalComponent.element;
      originalComponent.element = null;
      
      const refreshWithoutElement = this.app.refreshComponent('hero');
      
      // Restore original element
      originalComponent.element = originalElement;
      
      this.addTestResult(
        'Missing Element Handling',
        refreshWithoutElement === false,
        'Should handle missing elements gracefully'
      );
    }
  }

  async testPublicAPI() {
    console.log('🧪 Testing Public API...');
    
    // Test 1: getComponent method
    const heroComponent = this.app.getComponent('hero');
    this.addTestResult(
      'getComponent Method',
      heroComponent && heroComponent.element,
      'getComponent should return component with element'
    );
    
    // Test 2: getAllComponents method
    const allComponents = this.app.getAllComponents();
    this.addTestResult(
      'getAllComponents Method',
      Array.isArray(allComponents) && allComponents.length > 0,
      'getAllComponents should return array of components'
    );
    
    // Test 3: Component visibility detection
    const firstComponent = allComponents[0];
    this.addTestResult(
      'Component Visibility Detection',
      typeof firstComponent.isVisible === 'boolean',
      'Components should have visibility status'
    );
    
    // Test 4: refreshAllComponents method
    try {
      this.app.refreshAllComponents();
      this.addTestResult(
        'refreshAllComponents Method',
        true,
        'refreshAllComponents should execute without errors'
      );
    } catch (error) {
      this.addTestResult(
        'refreshAllComponents Method',
        false,
        `refreshAllComponents failed: ${error.message}`
      );
    }
  }

  async testEventSystem() {
    console.log('🧪 Testing Event System...');
    
    // Test 1: Portfolio loaded event
    let eventReceived = false;
    const eventHandler = (event) => {
      eventReceived = true;
      this.addTestResult(
        'Portfolio Loaded Event Data',
        event.detail && event.detail.app && event.detail.components,
        'Portfolio loaded event should contain app and components data'
      );
    };
    
    document.addEventListener('portfolioLoaded', eventHandler);
    
    // Trigger load complete to test event
    this.app.handleLoadComplete();
    
    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.addTestResult(
      'Portfolio Loaded Event',
      eventReceived,
      'Portfolio loaded event should be dispatched'
    );
    
    document.removeEventListener('portfolioLoaded', eventHandler);
  }

  addTestResult(testName, passed, description) {
    this.testResults.push({
      name: testName,
      passed,
      description,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${description}`);
  }

  generateTestReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log('\n📊 APP INTEGRATION TEST REPORT');
    console.log('================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Pass Rate: ${passRate}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.description}`);
        });
    }
    
    console.log('\n🎯 Integration test suite completed');
    
    // Return results for external use
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      passRate: parseFloat(passRate),
      results: this.testResults
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppIntegrationTests;
} else {
  window.AppIntegrationTests = AppIntegrationTests;
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && window.location) {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to be fully loaded before running tests
    setTimeout(async () => {
      if (window.portfolioApp && window.portfolioApp.isLoaded) {
        const testSuite = new AppIntegrationTests();
        await testSuite.runAllTests();
      }
    }, 1000);
  });
}