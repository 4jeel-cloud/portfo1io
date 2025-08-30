// Validation script for App integration
console.log('🔍 Validating App Integration...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runValidation);
} else {
  runValidation();
}

function runValidation() {
  console.log('📋 Starting App Integration Validation');
  
  // Wait for app to be loaded
  setTimeout(() => {
    validateAppStructure();
    validateComponentIntegration();
    validateSmoothScrolling();
    validateDataManagement();
    validatePublicAPI();
    
    console.log('✅ App Integration Validation Complete');
  }, 2000);
}

function validateAppStructure() {
  console.log('\n🏗️ Validating App Structure...');
  
  // Check if App class exists
  if (typeof window.App === 'function') {
    console.log('✅ App class is available globally');
  } else {
    console.error('❌ App class not found');
    return;
  }
  
  // Check if app instance exists
  if (window.portfolioApp && window.portfolioApp instanceof window.App) {
    console.log('✅ App instance created successfully');
  } else {
    console.error('❌ App instance not found or invalid');
    return;
  }
  
  // Check app properties
  const app = window.portfolioApp;
  
  if (typeof app.isLoaded === 'boolean') {
    console.log(`✅ App load status: ${app.isLoaded}`);
  } else {
    console.error('❌ App load status not available');
  }
  
  if (app.components instanceof Map) {
    console.log(`✅ Components registry: ${app.components.size} components`);
  } else {
    console.error('❌ Components registry not found');
  }
  
  if (typeof app.currentTheme === 'string') {
    console.log(`✅ Theme system: ${app.currentTheme} theme active`);
  } else {
    console.error('❌ Theme system not initialized');
  }
}

function validateComponentIntegration() {
  console.log('\n🧩 Validating Component Integration...');
  
  const app = window.portfolioApp;
  if (!app) return;
  
  const expectedComponents = ['hero', 'about', 'summary', 'experience', 'projects', 'skills', 'contact'];
  
  expectedComponents.forEach(componentName => {
    const component = app.getComponent(componentName);
    
    if (component) {
      console.log(`✅ ${componentName} component registered`);
      
      if (component.element) {
        console.log(`  ✅ DOM element found`);
        
        if (component.populated) {
          console.log(`  ✅ Content populated`);
        } else {
          console.warn(`  ⚠️ Content not populated`);
        }
        
        // Check for optimization classes
        if (component.element.classList.contains('section-optimized')) {
          console.log(`  ✅ Section optimization applied`);
        } else {
          console.warn(`  ⚠️ Section optimization not applied`);
        }
        
      } else {
        console.error(`  ❌ DOM element not found`);
      }
    } else {
      console.error(`❌ ${componentName} component not registered`);
    }
  });
}

function validateSmoothScrolling() {
  console.log('\n🎯 Validating Smooth Scrolling...');
  
  // Check if smooth scroll function exists
  if (typeof window.scrollToSection === 'function') {
    console.log('✅ Global scrollToSection function available');
  } else {
    console.error('❌ Global scrollToSection function not found');
  }
  
  // Check CSS scroll behavior
  const scrollBehavior = document.documentElement.style.scrollBehavior;
  if (scrollBehavior === 'smooth') {
    console.log('✅ CSS smooth scroll behavior set');
  } else {
    console.warn('⚠️ CSS smooth scroll behavior not set');
  }
  
  // Check navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  let validLinks = 0;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetSection = document.querySelector(href);
      if (targetSection) {
        validLinks++;
      }
    }
  });
  
  if (validLinks === navLinks.length && navLinks.length > 0) {
    console.log(`✅ All ${navLinks.length} navigation links are valid`);
  } else {
    console.warn(`⚠️ ${validLinks}/${navLinks.length} navigation links are valid`);
  }
}

function validateDataManagement() {
  console.log('\n📊 Validating Data Management...');
  
  // Check portfolio data
  if (window.portfolioData) {
    console.log('✅ Portfolio data manager available');
    
    if (window.portfolioData.isLoaded) {
      console.log('✅ Portfolio data loaded');
      
      // Check data sections
      const sections = ['personal', 'experience', 'projects', 'skills'];
      sections.forEach(section => {
        const methodName = `get${section.charAt(0).toUpperCase() + section.slice(1)}`;
        if (typeof window.portfolioData[methodName] === 'function') {
          const data = window.portfolioData[methodName]();
          if (data) {
            console.log(`  ✅ ${section} data available`);
          } else {
            console.warn(`  ⚠️ ${section} data empty`);
          }
        } else {
          console.error(`  ❌ ${methodName} method not found`);
        }
      });
      
    } else {
      console.error('❌ Portfolio data not loaded');
    }
  } else {
    console.error('❌ Portfolio data manager not found');
  }
}

function validatePublicAPI() {
  console.log('\n🔌 Validating Public API...');
  
  const app = window.portfolioApp;
  if (!app) return;
  
  // Test getComponent method
  const heroComponent = app.getComponent('hero');
  if (heroComponent) {
    console.log('✅ getComponent() method works');
  } else {
    console.error('❌ getComponent() method failed');
  }
  
  // Test getAllComponents method
  const allComponents = app.getAllComponents();
  if (Array.isArray(allComponents) && allComponents.length > 0) {
    console.log(`✅ getAllComponents() returns ${allComponents.length} components`);
    
    // Check component structure
    const firstComponent = allComponents[0];
    if (firstComponent.name && typeof firstComponent.populated === 'boolean' && typeof firstComponent.isVisible === 'boolean') {
      console.log('✅ Component structure is correct');
    } else {
      console.error('❌ Component structure is invalid');
    }
  } else {
    console.error('❌ getAllComponents() method failed');
  }
  
  // Test refresh methods
  try {
    const refreshResult = app.refreshComponent('hero');
    if (typeof refreshResult === 'boolean') {
      console.log('✅ refreshComponent() method works');
    } else {
      console.error('❌ refreshComponent() method failed');
    }
  } catch (error) {
    console.error('❌ refreshComponent() method error:', error.message);
  }
  
  try {
    app.refreshAllComponents();
    console.log('✅ refreshAllComponents() method works');
  } catch (error) {
    console.error('❌ refreshAllComponents() method error:', error.message);
  }
  
  // Test visibility detection
  const visibleComponents = allComponents.filter(comp => comp.isVisible);
  console.log(`✅ Visibility detection: ${visibleComponents.length}/${allComponents.length} components visible`);
}

// Test event system
document.addEventListener('portfolioLoaded', (event) => {
  console.log('\n🎉 Portfolio Loaded Event Received');
  
  if (event.detail && event.detail.app && event.detail.components) {
    console.log('✅ Event contains app and components data');
    console.log(`  📦 Components: ${event.detail.components.join(', ')}`);
  } else {
    console.error('❌ Event data is incomplete');
  }
});

// Export validation functions for manual testing
window.validateAppIntegration = {
  runValidation,
  validateAppStructure,
  validateComponentIntegration,
  validateSmoothScrolling,
  validateDataManagement,
  validatePublicAPI
};