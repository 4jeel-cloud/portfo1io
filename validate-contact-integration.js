/**
 * Contact Section Integration Validation
 * Validates that the contact section meets all requirements
 */

// Validation function to check contact section implementation
function validateContactSection() {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Check if contact section exists
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    results.passed.push('Contact section element exists');
  } else {
    results.failed.push('Contact section element not found');
    return results;
  }

  // Check for section title
  const sectionTitle = contactSection.querySelector('.section-title');
  if (sectionTitle && sectionTitle.textContent.trim()) {
    results.passed.push('Section title exists and has content');
  } else {
    results.failed.push('Section title missing or empty');
  }

  // Check for contact message
  const contactMessage = contactSection.querySelector('.contact-message');
  if (contactMessage && contactMessage.textContent.trim()) {
    results.passed.push('Contact message exists and has content');
  } else {
    results.failed.push('Contact message missing or empty');
  }

  // Check for contact links
  const contactLinks = contactSection.querySelectorAll('.contact-link');
  if (contactLinks.length > 0) {
    results.passed.push(`Found ${contactLinks.length} contact links`);
    
    // Validate each contact link
    contactLinks.forEach((link, index) => {
      const href = link.getAttribute('href');
      const ariaLabel = link.getAttribute('aria-label');
      const contactType = link.getAttribute('data-contact-type');
      
      if (href) {
        results.passed.push(`Link ${index + 1}: Has valid href attribute`);
      } else {
        results.failed.push(`Link ${index + 1}: Missing href attribute`);
      }
      
      if (ariaLabel) {
        results.passed.push(`Link ${index + 1}: Has aria-label for accessibility`);
      } else {
        results.failed.push(`Link ${index + 1}: Missing aria-label`);
      }
      
      if (contactType) {
        results.passed.push(`Link ${index + 1}: Has contact type data attribute`);
      } else {
        results.failed.push(`Link ${index + 1}: Missing contact type`);
      }
      
      // Check external links
      if (link.getAttribute('target') === '_blank') {
        const rel = link.getAttribute('rel');
        if (rel && rel.includes('noopener') && rel.includes('noreferrer')) {
          results.passed.push(`Link ${index + 1}: External link has proper security attributes`);
        } else {
          results.warnings.push(`Link ${index + 1}: External link should have rel="noopener noreferrer"`);
        }
      }
    });
  } else {
    results.failed.push('No contact links found');
  }

  // Check for CTA section
  const ctaSection = contactSection.querySelector('.contact-cta');
  if (ctaSection) {
    results.passed.push('Call-to-action section exists');
  } else {
    results.warnings.push('Call-to-action section not found');
  }

  // Check for footer
  const footer = contactSection.querySelector('.contact-footer');
  if (footer) {
    results.passed.push('Contact footer exists');
  } else {
    results.warnings.push('Contact footer not found');
  }

  return results;
}

// Run validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const results = validateContactSection();
    
    console.log('=== Contact Section Validation Results ===');
    console.log(`✓ Passed: ${results.passed.length}`);
    console.log(`✗ Failed: ${results.failed.length}`);
    console.log(`⚠ Warnings: ${results.warnings.length}`);
    
    if (results.passed.length > 0) {
      console.log('\n✓ PASSED:');
      results.passed.forEach(item => console.log(`  - ${item}`));
    }
    
    if (results.failed.length > 0) {
      console.log('\n✗ FAILED:');
      results.failed.forEach(item => console.log(`  - ${item}`));
    }
    
    if (results.warnings.length > 0) {
      console.log('\n⚠ WARNINGS:');
      results.warnings.forEach(item => console.log(`  - ${item}`));
    }
    
    const isValid = results.failed.length === 0;
    console.log(`\n=== Overall Status: ${isValid ? 'VALID ✓' : 'INVALID ✗'} ===`);
  }, 2000); // Wait for portfolio to load
});