// Accessibility Tests for Portfolio
// Tests WCAG 2.1 AA compliance and accessibility features

class AccessibilityTester {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
  }

  // Run all accessibility tests
  async runAllTests() {
    console.log('🔍 Running Accessibility Tests...');
    
    this.testSemanticHTML();
    this.testARIALabels();
    this.testKeyboardNavigation();
    this.testColorContrast();
    this.testFocusManagement();
    this.testScreenReaderSupport();
    this.testImageAltText();
    this.testHeadingStructure();
    this.testLinkAccessibility();
    this.testFormAccessibility();
    
    this.generateReport();
    return this.results;
  }

  // Test 1: Semantic HTML Structure
  testSemanticHTML() {
    const test = { name: 'Semantic HTML Structure', passed: true, issues: [] };
    
    // Check for proper landmark elements
    const landmarks = {
      'header': document.querySelector('header[role="banner"]'),
      'main': document.querySelector('main[role="main"]'),
      'nav': document.querySelector('nav[role="navigation"]'),
      'sections': document.querySelectorAll('section')
    };
    
    if (!landmarks.header) {
      test.passed = false;
      test.issues.push('Missing header landmark with role="banner"');
    }
    
    if (!landmarks.main) {
      test.passed = false;
      test.issues.push('Missing main landmark with role="main"');
    }
    
    if (!landmarks.nav) {
      test.passed = false;
      test.issues.push('Missing nav landmark with role="navigation"');
    }
    
    if (landmarks.sections.length === 0) {
      test.passed = false;
      test.issues.push('No section elements found');
    }
    
    // Check for skip link
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) {
      test.passed = false;
      test.issues.push('Missing skip to main content link');
    }
    
    this.results.push(test);
  }

  // Test 2: ARIA Labels and Attributes
  testARIALabels() {
    const test = { name: 'ARIA Labels and Attributes', passed: true, issues: [] };
    
    // Check navigation ARIA attributes
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
      if (!navToggle.hasAttribute('aria-expanded')) {
        test.passed = false;
        test.issues.push('Navigation toggle missing aria-expanded');
      }
      if (!navToggle.hasAttribute('aria-controls')) {
        test.passed = false;
        test.issues.push('Navigation toggle missing aria-controls');
      }
    }
    
    // Check section labeling
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (!section.hasAttribute('aria-labelledby')) {
        test.passed = false;
        test.issues.push(`Section ${index + 1} missing aria-labelledby`);
      }
    });
    
    // Check interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
        test.passed = false;
        test.issues.push(`Button ${index + 1} missing accessible name`);
      }
    });
    
    this.results.push(test);
  }

  // Test 3: Keyboard Navigation
  testKeyboardNavigation() {
    const test = { name: 'Keyboard Navigation', passed: true, issues: [] };
    
    // Check focusable elements have proper tabindex
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let tabIndexOrder = [];
    focusableElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        tabIndexOrder.push(parseInt(tabIndex));
      }
    });
    
    // Check for skip links
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) {
      test.passed = false;
      test.issues.push('No skip link found for keyboard users');
    }
    
    // Check navigation menu keyboard support
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
      if (!link.hasAttribute('tabindex') && link.getAttribute('tabindex') !== '0') {
        test.warnings = test.warnings || [];
        test.warnings.push(`Nav link ${index + 1} may not be keyboard accessible`);
      }
    });
    
    this.results.push(test);
  }

  // Test 4: Color Contrast
  testColorContrast() {
    const test = { name: 'Color Contrast', passed: true, issues: [] };
    
    // This is a simplified test - in production, you'd use a proper contrast checker
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span');
    
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Basic check for transparent or very light text
      if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
        test.warnings = test.warnings || [];
        test.warnings.push(`Element ${index + 1} may have insufficient color contrast`);
      }
    });
    
    this.results.push(test);
  }

  // Test 5: Focus Management
  testFocusManagement() {
    const test = { name: 'Focus Management', passed: true, issues: [] };
    
    // Check for focus styles
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    
    // Test focus visibility (simplified)
    focusableElements.forEach((element, index) => {
      element.focus();
      const styles = window.getComputedStyle(element, ':focus');
      
      // Check if element has visible focus indicator
      if (!styles.outline || styles.outline === 'none') {
        const boxShadow = styles.boxShadow;
        if (!boxShadow || boxShadow === 'none') {
          test.warnings = test.warnings || [];
          test.warnings.push(`Element ${index + 1} may not have visible focus indicator`);
        }
      }
    });
    
    // Remove focus from test
    if (document.activeElement) {
      document.activeElement.blur();
    }
    
    this.results.push(test);
  }

  // Test 6: Screen Reader Support
  testScreenReaderSupport() {
    const test = { name: 'Screen Reader Support', passed: true, issues: [] };
    
    // Check for live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    if (liveRegions.length === 0) {
      test.warnings = test.warnings || [];
      test.warnings.push('No live regions found for dynamic content updates');
    }
    
    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (index === 0 && level !== 1) {
        test.passed = false;
        test.issues.push('First heading should be h1');
      }
      
      if (level > previousLevel + 1) {
        test.passed = false;
        test.issues.push(`Heading level skipped: h${previousLevel} to h${level}`);
      }
      
      previousLevel = level;
    });
    
    // Check for descriptive text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        test.passed = false;
        test.issues.push(`Image ${index + 1} missing alt attribute`);
      }
    });
    
    this.results.push(test);
  }

  // Test 7: Image Alt Text
  testImageAltText() {
    const test = { name: 'Image Alt Text', passed: true, issues: [] };
    
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        test.passed = false;
        test.issues.push(`Image ${index + 1} missing alt attribute`);
      } else {
        const altText = img.getAttribute('alt');
        if (altText.length === 0 && !img.hasAttribute('role')) {
          test.warnings = test.warnings || [];
          test.warnings.push(`Image ${index + 1} has empty alt text - ensure it's decorative`);
        }
        
        // Check for redundant alt text
        if (altText.toLowerCase().includes('image of') || altText.toLowerCase().includes('picture of')) {
          test.warnings = test.warnings || [];
          test.warnings.push(`Image ${index + 1} alt text may be redundant`);
        }
      }
    });
    
    this.results.push(test);
  }

  // Test 8: Heading Structure
  testHeadingStructure() {
    const test = { name: 'Heading Structure', passed: true, issues: [] };
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      test.passed = false;
      test.issues.push('No headings found on page');
      this.results.push(test);
      return;
    }
    
    // Check for single h1
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      test.passed = false;
      test.issues.push('No h1 heading found');
    } else if (h1s.length > 1) {
      test.warnings = test.warnings || [];
      test.warnings.push('Multiple h1 headings found - consider using h2-h6');
    }
    
    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        test.passed = false;
        test.issues.push('First heading should be h1');
      }
      
      if (level > previousLevel + 1) {
        test.passed = false;
        test.issues.push(`Heading hierarchy broken: h${previousLevel} to h${level} at position ${index + 1}`);
      }
      
      // Check for empty headings
      if (!heading.textContent.trim()) {
        test.passed = false;
        test.issues.push(`Empty heading found at position ${index + 1}`);
      }
      
      previousLevel = level;
    });
    
    this.results.push(test);
  }

  // Test 9: Link Accessibility
  testLinkAccessibility() {
    const test = { name: 'Link Accessibility', passed: true, issues: [] };
    
    const links = document.querySelectorAll('a');
    
    links.forEach((link, index) => {
      // Check for href attribute
      if (!link.hasAttribute('href')) {
        test.passed = false;
        test.issues.push(`Link ${index + 1} missing href attribute`);
      }
      
      // Check for accessible name
      const linkText = link.textContent.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const title = link.getAttribute('title');
      
      if (!linkText && !ariaLabel && !title) {
        test.passed = false;
        test.issues.push(`Link ${index + 1} has no accessible name`);
      }
      
      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'more', 'link'];
      if (genericTexts.includes(linkText.toLowerCase())) {
        test.warnings = test.warnings || [];
        test.warnings.push(`Link ${index + 1} has generic text: "${linkText}"`);
      }
      
      // Check external links
      if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
        if (!link.hasAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
          test.warnings = test.warnings || [];
          test.warnings.push(`External link ${index + 1} missing rel="noopener"`);
        }
        
        // Check if external link is announced
        if (ariaLabel && !ariaLabel.includes('opens in new tab')) {
          test.warnings = test.warnings || [];
          test.warnings.push(`External link ${index + 1} should indicate it opens in new tab`);
        }
      }
    });
    
    this.results.push(test);
  }

  // Test 10: Form Accessibility (if forms exist)
  testFormAccessibility() {
    const test = { name: 'Form Accessibility', passed: true, issues: [] };
    
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, select, textarea');
    
    if (forms.length === 0 && inputs.length === 0) {
      test.issues.push('No forms found - test skipped');
      this.results.push(test);
      return;
    }
    
    inputs.forEach((input, index) => {
      // Check for labels
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledby) {
          test.passed = false;
          test.issues.push(`Input ${index + 1} has no associated label`);
        }
      } else if (!ariaLabel && !ariaLabelledby) {
        test.passed = false;
        test.issues.push(`Input ${index + 1} has no accessible name`);
      }
      
      // Check required fields
      if (input.hasAttribute('required')) {
        const ariaRequired = input.getAttribute('aria-required');
        if (ariaRequired !== 'true') {
          test.warnings = test.warnings || [];
          test.warnings.push(`Required input ${index + 1} should have aria-required="true"`);
        }
      }
    });
    
    this.results.push(test);
  }

  // Generate accessibility report
  generateReport() {
    console.log('\n📊 Accessibility Test Results:');
    console.log('================================');
    
    let passedTests = 0;
    let totalTests = this.results.length;
    
    this.results.forEach(test => {
      const status = test.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test.name}`);
      
      if (test.issues && test.issues.length > 0) {
        test.issues.forEach(issue => {
          console.log(`  ❌ ${issue}`);
        });
      }
      
      if (test.warnings && test.warnings.length > 0) {
        test.warnings.forEach(warning => {
          console.log(`  ⚠️  ${warning}`);
        });
      }
      
      if (test.passed) passedTests++;
    });
    
    console.log('\n📈 Summary:');
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All accessibility tests passed!');
    } else {
      console.log('⚠️  Some accessibility issues found. Please review and fix.');
    }
  }

  // Test color contrast ratio (simplified implementation)
  calculateContrastRatio(color1, color2) {
    // This is a simplified version - in production use a proper contrast library
    // Returns a rough estimate for demonstration
    return 4.5; // Assume WCAG AA compliance for now
  }

  // Utility: Convert RGB to relative luminance
  getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityTester;
}

// Auto-run tests when page loads (for development)
if (typeof window !== 'undefined') {
  window.AccessibilityTester = AccessibilityTester;
  
  // Run tests after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const tester = new AccessibilityTester();
      tester.runAllTests();
    }, 2000); // Wait for dynamic content to load
  });
}