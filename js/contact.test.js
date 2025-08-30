/**
 * Contact Section Component Tests
 * Tests for contact section functionality, accessibility, and interactions
 */

// Test suite for Contact Section
describe('Contact Section Component', () => {
  let mockPortfolioData;
  let contactTester;
  let testContainer;

  // Setup before each test
  beforeEach(() => {
    // Create test container
    testContainer = document.createElement('div');
    testContainer.innerHTML = `
      <section class="section contact" id="contact">
        <div class="container">
          <h2 class="section-title">Contact</h2>
          <div class="contact-content">
            <p class="contact-message">Loading...</p>
            <div class="contact-links" id="contact-links"></div>
          </div>
        </div>
      </section>
    `;
    document.body.appendChild(testContainer);

    // Mock portfolio data
    mockPortfolioData = {
      personal: {
        name: "Test User",
        title: "Cloud Engineer & Cybersecurity Professional",
        contact: {
          email: "test@example.com",
          linkedin: "https://linkedin.com/in/testuser",
          github: "https://github.com/testuser",
          behance: "https://behance.net/testuser"
        }
      }
    };

    // Mock window.portfolioData
    window.portfolioData = {
      getPersonalInfo: () => mockPortfolioData.personal,
      loadData: () => Promise.resolve(mockPortfolioData)
    };

    // Create contact tester instance
    contactTester = new ContactTester();
  });

  // Cleanup after each test
  afterEach(() => {
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }
    delete window.portfolioData;
  });

  // Test 1: Contact Section Creation
  test('should create contact section with proper structure', () => {
    contactTester.populateContactSection();
    
    const contactSection = document.getElementById('contact');
    expect(contactSection).toBeTruthy();
    
    const sectionTitle = contactSection.querySelector('.section-title');
    expect(sectionTitle).toBeTruthy();
    expect(sectionTitle.textContent).toBe('Let\'s Connect');
    
    const contactMessage = contactSection.querySelector('.contact-message');
    expect(contactMessage).toBeTruthy();
    expect(contactMessage.textContent).toBe('Thank you for visiting my portfolio!');
    
    const contactSubtitle = contactSection.querySelector('.contact-subtitle');
    expect(contactSubtitle).toBeTruthy();
    
    const contactCta = contactSection.querySelector('.contact-cta');
    expect(contactCta).toBeTruthy();
    
    const contactFooter = contactSection.querySelector('.contact-footer');
    expect(contactFooter).toBeTruthy();
  });

  // Test 2: Contact Links Generation
  test('should generate all contact links with proper attributes', () => {
    contactTester.populateContactSection();
    
    const contactLinks = document.querySelectorAll('.contact-link');
    expect(contactLinks.length).toBe(4); // email, linkedin, github, behance
    
    // Test email link
    const emailLink = document.querySelector('[data-contact-type="email"]');
    expect(emailLink).toBeTruthy();
    expect(emailLink.getAttribute('href')).toBe('mailto:test@example.com');
    expect(emailLink.getAttribute('aria-label')).toContain('test@example.com');
    
    // Test LinkedIn link
    const linkedinLink = document.querySelector('[data-contact-type="linkedin"]');
    expect(linkedinLink).toBeTruthy();
    expect(linkedinLink.getAttribute('href')).toBe('https://linkedin.com/in/testuser');
    expect(linkedinLink.getAttribute('target')).toBe('_blank');
    expect(linkedinLink.getAttribute('rel')).toBe('noopener noreferrer');
    
    // Test GitHub link
    const githubLink = document.querySelector('[data-contact-type="github"]');
    expect(githubLink).toBeTruthy();
    expect(githubLink.getAttribute('href')).toBe('https://github.com/testuser');
    
    // Test Behance link
    const behanceLink = document.querySelector('[data-contact-type="behance"]');
    expect(behanceLink).toBeTruthy();
    expect(behanceLink.getAttribute('href')).toBe('https://behance.net/testuser');
  });

  // Test 3: Contact Links with Missing Data
  test('should handle missing contact information gracefully', () => {
    // Test with partial contact data
    window.portfolioData.getPersonalInfo = () => ({
      name: "Test User",
      contact: {
        email: "test@example.com",
        github: "https://github.com/testuser"
        // Missing linkedin and behance
      }
    });
    
    contactTester.populateContactSection();
    
    const contactLinks = document.querySelectorAll('.contact-link');
    expect(contactLinks.length).toBe(2); // Only email and github
    
    const emailLink = document.querySelector('[data-contact-type="email"]');
    expect(emailLink).toBeTruthy();
    
    const githubLink = document.querySelector('[data-contact-type="github"]');
    expect(githubLink).toBeTruthy();
    
    const linkedinLink = document.querySelector('[data-contact-type="linkedin"]');
    expect(linkedinLink).toBeFalsy();
    
    const behanceLink = document.querySelector('[data-contact-type="behance"]');
    expect(behanceLink).toBeFalsy();
  });

  // Test 4: Contact Link Interactions
  test('should handle contact link interactions properly', () => {
    contactTester.populateContactSection();
    
    const emailLink = document.querySelector('[data-contact-type="email"]');
    expect(emailLink).toBeTruthy();
    
    // Test hover effects
    const icon = emailLink.querySelector('.contact-icon');
    const text = emailLink.querySelector('.contact-text');
    
    // Simulate mouseenter
    emailLink.dispatchEvent(new Event('mouseenter'));
    expect(emailLink.classList.contains('hovered')).toBe(true);
    
    // Simulate mouseleave
    emailLink.dispatchEvent(new Event('mouseleave'));
    expect(emailLink.classList.contains('hovered')).toBe(false);
  });

  // Test 5: Keyboard Accessibility
  test('should support keyboard navigation', () => {
    contactTester.populateContactSection();
    
    const emailLink = document.querySelector('[data-contact-type="email"]');
    let clickTriggered = false;
    
    // Mock click method
    emailLink.click = () => {
      clickTriggered = true;
    };
    
    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    emailLink.dispatchEvent(enterEvent);
    expect(clickTriggered).toBe(true);
    
    // Reset and test Space key
    clickTriggered = false;
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    emailLink.dispatchEvent(spaceEvent);
    expect(clickTriggered).toBe(true);
  });

  // Test 6: Analytics Tracking
  test('should track contact interactions', () => {
    contactTester.populateContactSection();
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const emailLink = document.querySelector('[data-contact-type="email"]');
    emailLink.click();
    
    expect(consoleSpy).toHaveBeenCalledWith('Contact interaction: email');
    
    consoleSpy.mockRestore();
  });

  // Test 7: Accessibility Compliance
  test('should meet accessibility requirements', () => {
    contactTester.populateContactSection();
    
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      // Check for aria-label
      expect(link.getAttribute('aria-label')).toBeTruthy();
      
      // Check for proper href
      expect(link.getAttribute('href')).toBeTruthy();
      
      // Check external links have proper rel attribute
      if (link.getAttribute('target') === '_blank') {
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      }
      
      // Check for contact type data attribute
      expect(link.getAttribute('data-contact-type')).toBeTruthy();
    });
  });

  // Test 8: Responsive Design Elements
  test('should include responsive design classes', () => {
    contactTester.populateContactSection();
    
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      expect(link.classList.contains('contact-link')).toBe(true);
      expect(link.classList.contains('contact-link-animate')).toBe(true);
    });
    
    const contactContent = document.querySelector('.contact-content');
    expect(contactContent).toBeTruthy();
    
    const contactCta = document.querySelector('.contact-cta');
    expect(contactCta).toBeTruthy();
  });

  // Test 9: Animation Initialization
  test('should initialize animations properly', () => {
    // Mock IntersectionObserver
    const mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };
    
    global.IntersectionObserver = jest.fn(() => mockObserver);
    
    contactTester.populateContactSection();
    
    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserver.observe).toHaveBeenCalled();
  });

  // Test 10: Error Handling
  test('should handle errors gracefully', () => {
    // Test with invalid contact section
    const invalidContainer = document.createElement('div');
    
    expect(() => {
      contactTester.createContactComponent(invalidContainer, mockPortfolioData.personal);
    }).not.toThrow();
  });

  // Test 11: Content Validation
  test('should display correct content and formatting', () => {
    contactTester.populateContactSection();
    
    // Check CTA content
    const ctaTitle = document.querySelector('.cta-title');
    expect(ctaTitle.textContent).toBe('Ready to work together?');
    
    const ctaHighlights = document.querySelectorAll('.cta-highlight');
    expect(ctaHighlights.length).toBe(3); // cloud engineering, cybersecurity, API development
    
    // Check footer content
    const footer = document.querySelector('.contact-footer');
    const currentYear = new Date().getFullYear();
    expect(footer.textContent).toContain(currentYear.toString());
    expect(footer.textContent).toContain('Test User');
  });

  // Test 12: Link Icon and Text Structure
  test('should have proper icon and text structure for each link', () => {
    contactTester.populateContactSection();
    
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      const icon = link.querySelector('.contact-icon');
      const text = link.querySelector('.contact-text');
      
      expect(icon).toBeTruthy();
      expect(text).toBeTruthy();
      expect(icon.textContent).toBeTruthy(); // Should have emoji icon
      expect(text.textContent).toBeTruthy(); // Should have text content
    });
  });
});

// Mock ContactTester class for testing (simplified version of the actual implementation)
class ContactTester {
  constructor() {
    this.init();
  }

  init() {
    // Initialize
  }

  populateContactSection() {
    const personal = window.portfolioData.getPersonalInfo();
    const contactSection = document.getElementById('contact');
    
    if (!contactSection) return;
    
    this.createContactComponent(contactSection, personal);
  }

  createContactComponent(container, personal) {
    const contactHTML = `
      <div class="container">
        <h2 class="section-title">Let's Connect</h2>
        
        <div class="contact-content">
          <p class="contact-message">Thank you for visiting my portfolio!</p>
          <p class="contact-subtitle">
            I'm always interested in discussing new opportunities, 
            collaborating on exciting projects, or simply connecting with fellow professionals.
          </p>
          
          <div class="contact-links" id="contact-links">
            ${this.createContactLinks(personal.contact)}
          </div>
          
          <div class="contact-cta">
            <h3 class="cta-title">Ready to work together?</h3>
            <p class="cta-text">
              Whether you're looking for expertise in <span class="cta-highlight">cloud engineering</span>, 
              <span class="cta-highlight">cybersecurity</span>, or <span class="cta-highlight">API development</span>, 
              I'd love to hear about your project and explore how we can create something amazing together.
            </p>
          </div>
          
          <div class="contact-footer">
            <p>© ${new Date().getFullYear()} ${personal.name || 'Professional Portfolio'}. Built with passion for technology and innovation.</p>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = contactHTML;
    this.initializeContactInteractions();
  }

  createContactLinks(contact) {
    const links = [];
    
    if (contact.email) {
      links.push(`
        <a href="mailto:${contact.email}" 
           class="contact-link contact-email contact-link-animate" 
           aria-label="Send email to ${contact.email}"
           data-contact-type="email">
          <span class="contact-icon">📧</span>
          <span class="contact-text">Email Me</span>
        </a>
      `);
    }
    
    if (contact.linkedin) {
      links.push(`
        <a href="${contact.linkedin}" 
           class="contact-link contact-linkedin contact-link-animate" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Visit LinkedIn profile"
           data-contact-type="linkedin">
          <span class="contact-icon">💼</span>
          <span class="contact-text">LinkedIn</span>
        </a>
      `);
    }
    
    if (contact.github) {
      links.push(`
        <a href="${contact.github}" 
           class="contact-link contact-github contact-link-animate" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Visit GitHub profile"
           data-contact-type="github">
          <span class="contact-icon">💻</span>
          <span class="contact-text">GitHub</span>
        </a>
      `);
    }
    
    if (contact.behance) {
      links.push(`
        <a href="${contact.behance}" 
           class="contact-link contact-behance contact-link-animate" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Visit Behance portfolio"
           data-contact-type="behance">
          <span class="contact-icon">🎨</span>
          <span class="contact-text">Behance</span>
        </a>
      `);
    }
    
    return links.join('');
  }

  initializeContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.handleContactLinkHover(link, true);
      });
      
      link.addEventListener('mouseleave', () => {
        this.handleContactLinkHover(link, false);
      });
      
      link.addEventListener('click', (e) => {
        const contactType = link.getAttribute('data-contact-type');
        this.trackContactInteraction(contactType);
      });
      
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
    
    this.initializeContactAnimations();
  }

  handleContactLinkHover(link, isHovering) {
    if (isHovering) {
      link.classList.add('hovered');
    } else {
      link.classList.remove('hovered');
    }
  }

  trackContactInteraction(contactType) {
    console.log(`Contact interaction: ${contactType}`);
  }

  initializeContactAnimations() {
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateContactElements();
          contactObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '50px'
    });
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactObserver.observe(contactSection);
    }
  }

  animateContactElements() {
    // Animation implementation would go here
  }
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContactTester };
}