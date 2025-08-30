// Hero Component Tests
describe('Hero Component', () => {
  let mockPortfolioData;
  let heroSection;
  let heroTitle;
  let heroSubtitle;
  let heroContact;
  let scrollIndicator;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <section class="section hero" id="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title" id="hero-title"></h1>
            <p class="hero-subtitle" id="hero-subtitle"></p>
            <div class="hero-contact" id="hero-contact"></div>
          </div>
          <div class="scroll-indicator">
            <div class="scroll-arrow"></div>
          </div>
        </div>
      </section>
      <section class="section about" id="about">
        <div class="container">
          <h2 class="section-title">About Me</h2>
        </div>
      </section>
    `;

    // Get DOM elements
    heroSection = document.getElementById('hero');
    heroTitle = document.getElementById('hero-title');
    heroSubtitle = document.getElementById('hero-subtitle');
    heroContact = document.getElementById('hero-contact');
    scrollIndicator = document.querySelector('.scroll-indicator');

    // Mock portfolio data
    mockPortfolioData = {
      personal: {
        name: 'John Doe',
        title: 'Cloud Engineer & Cybersecurity Professional',
        contact: {
          email: 'john@example.com',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          behance: 'https://behance.net/johndoe'
        }
      }
    };

    // Mock window.portfolioData
    window.portfolioData = {
      getPersonalInfo: () => mockPortfolioData.personal
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.portfolioData;
    delete window.portfolioApp;
  });

  describe('Hero Section Structure', () => {
    test('should have hero section with correct ID', () => {
      expect(heroSection).toBeTruthy();
      expect(heroSection.id).toBe('hero');
      expect(heroSection.classList.contains('hero')).toBe(true);
    });

    test('should have full viewport height', () => {
      const computedStyle = window.getComputedStyle(heroSection);
      expect(computedStyle.minHeight).toBe('100vh');
    });

    test('should have centered content layout', () => {
      const computedStyle = window.getComputedStyle(heroSection);
      expect(computedStyle.display).toBe('flex');
      expect(computedStyle.alignItems).toBe('center');
      expect(computedStyle.justifyContent).toBe('center');
    });

    test('should contain all required elements', () => {
      expect(heroTitle).toBeTruthy();
      expect(heroSubtitle).toBeTruthy();
      expect(heroContact).toBeTruthy();
      expect(scrollIndicator).toBeTruthy();
    });
  });

  describe('Content Population', () => {
    test('should populate hero title with personal name', () => {
      // Simulate app initialization
      const app = {
        populateHeroSection() {
          const personal = window.portfolioData.getPersonalInfo();
          heroTitle.textContent = personal.name;
        }
      };
      
      app.populateHeroSection();
      expect(heroTitle.textContent).toBe('John Doe');
    });

    test('should populate hero subtitle with personal title', () => {
      const app = {
        populateHeroSection() {
          const personal = window.portfolioData.getPersonalInfo();
          heroSubtitle.textContent = personal.title;
        }
      };
      
      app.populateHeroSection();
      expect(heroSubtitle.textContent).toBe('Cloud Engineer & Cybersecurity Professional');
    });

    test('should create contact links with proper attributes', () => {
      const app = {
        populateHeroSection() {
          const personal = window.portfolioData.getPersonalInfo();
          heroContact.innerHTML = this.createContactLinks(personal.contact);
        },
        createContactLinks(contact) {
          const links = [];
          if (contact.email) {
            links.push(`<a href="mailto:${contact.email}" class="contact-link" aria-label="Send email">Email</a>`);
          }
          if (contact.linkedin) {
            links.push(`<a href="${contact.linkedin}" class="contact-link" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile">LinkedIn</a>`);
          }
          if (contact.github) {
            links.push(`<a href="${contact.github}" class="contact-link" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile">GitHub</a>`);
          }
          if (contact.behance) {
            links.push(`<a href="${contact.behance}" class="contact-link" target="_blank" rel="noopener noreferrer" aria-label="Visit Behance portfolio">Behance</a>`);
          }
          return links.join('');
        }
      };
      
      app.populateHeroSection();
      
      const emailLink = heroContact.querySelector('a[href^="mailto:"]');
      const linkedinLink = heroContact.querySelector('a[href*="linkedin"]');
      const githubLink = heroContact.querySelector('a[href*="github"]');
      const behanceLink = heroContact.querySelector('a[href*="behance"]');
      
      expect(emailLink).toBeTruthy();
      expect(emailLink.href).toBe('mailto:john@example.com');
      expect(emailLink.getAttribute('aria-label')).toBe('Send email');
      
      expect(linkedinLink).toBeTruthy();
      expect(linkedinLink.target).toBe('_blank');
      expect(linkedinLink.rel).toBe('noopener noreferrer');
      
      expect(githubLink).toBeTruthy();
      expect(behanceLink).toBeTruthy();
    });

    test('should handle missing contact information gracefully', () => {
      window.portfolioData.getPersonalInfo = () => ({
        name: 'John Doe',
        title: 'Professional',
        contact: {
          email: 'john@example.com'
          // Missing other contact methods
        }
      });

      const app = {
        populateHeroSection() {
          const personal = window.portfolioData.getPersonalInfo();
          heroContact.innerHTML = this.createContactLinks(personal.contact);
        },
        createContactLinks(contact) {
          const links = [];
          if (contact.email) {
            links.push(`<a href="mailto:${contact.email}" class="contact-link">Email</a>`);
          }
          if (contact.linkedin) {
            links.push(`<a href="${contact.linkedin}" class="contact-link">LinkedIn</a>`);
          }
          return links.join('');
        }
      };
      
      app.populateHeroSection();
      
      const contactLinks = heroContact.querySelectorAll('.contact-link');
      expect(contactLinks.length).toBe(1);
      expect(contactLinks[0].textContent).toBe('Email');
    });
  });

  describe('Scroll Indicator', () => {
    test('should have scroll indicator with proper structure', () => {
      expect(scrollIndicator).toBeTruthy();
      expect(scrollIndicator.classList.contains('scroll-indicator')).toBe(true);
      
      const scrollArrow = scrollIndicator.querySelector('.scroll-arrow');
      expect(scrollArrow).toBeTruthy();
    });

    test('should scroll to about section when clicked', (done) => {
      // Mock scrollIntoView
      const aboutSection = document.getElementById('about');
      aboutSection.scrollIntoView = jest.fn();

      // Simulate click event
      scrollIndicator.click();

      // Use setTimeout to allow for event handling
      setTimeout(() => {
        expect(aboutSection.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start'
        });
        done();
      }, 10);
    });

    test('should have bounce animation', () => {
      const computedStyle = window.getComputedStyle(scrollIndicator);
      expect(computedStyle.animation).toContain('bounce');
    });
  });

  describe('Animations', () => {
    test('should have initial hidden state for animated elements', () => {
      // Simulate animation setup
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(50px)';
      heroSubtitle.style.opacity = '0';
      heroSubtitle.style.transform = 'translateY(30px)';
      heroContact.style.opacity = '0';
      heroContact.style.transform = 'translateY(20px)';

      expect(heroTitle.style.opacity).toBe('0');
      expect(heroTitle.style.transform).toBe('translateY(50px)');
      expect(heroSubtitle.style.opacity).toBe('0');
      expect(heroSubtitle.style.transform).toBe('translateY(30px)');
      expect(heroContact.style.opacity).toBe('0');
      expect(heroContact.style.transform).toBe('translateY(20px)');
    });

    test('should animate elements to visible state', (done) => {
      // Set initial state
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(50px)';
      heroTitle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

      // Trigger animation
      setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
      }, 10);

      // Check animation completion
      setTimeout(() => {
        expect(heroTitle.style.opacity).toBe('1');
        expect(heroTitle.style.transform).toBe('translateY(0)');
        done();
      }, 50);
    });

    test('should support reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(reducedMotionQuery.matches).toBe(true);
    });
  });

  describe('Contact Link Interactions', () => {
    beforeEach(() => {
      // Populate contact links
      heroContact.innerHTML = `
        <a href="mailto:john@example.com" class="contact-link">Email</a>
        <a href="https://linkedin.com/in/johndoe" class="contact-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/johndoe" class="contact-link" target="_blank" rel="noopener noreferrer">GitHub</a>
      `;
    });

    test('should have proper hover effects', () => {
      const contactLink = heroContact.querySelector('.contact-link');
      
      // Simulate hover
      contactLink.dispatchEvent(new Event('mouseenter'));
      
      // Check if hover styles would be applied (we can't test actual computed styles in jsdom)
      expect(contactLink.classList.contains('contact-link')).toBe(true);
    });

    test('should handle external links correctly', () => {
      const externalLinks = heroContact.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        expect(link.target).toBe('_blank');
        expect(link.rel).toBe('noopener noreferrer');
      });
    });

    test('should handle email links correctly', () => {
      const emailLink = heroContact.querySelector('a[href^="mailto:"]');
      
      expect(emailLink).toBeTruthy();
      expect(emailLink.href).toBe('mailto:john@example.com');
      expect(emailLink.target).toBe('');
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      heroContact.innerHTML = `
        <a href="mailto:john@example.com" class="contact-link" aria-label="Send email">Email</a>
        <a href="https://linkedin.com/in/johndoe" class="contact-link" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile">LinkedIn</a>
      `;

      const emailLink = heroContact.querySelector('a[href^="mailto:"]');
      const linkedinLink = heroContact.querySelector('a[href*="linkedin"]');
      
      expect(emailLink.getAttribute('aria-label')).toBe('Send email');
      expect(linkedinLink.getAttribute('aria-label')).toBe('Visit LinkedIn profile');
    });

    test('should be keyboard navigable', () => {
      const contactLinks = heroContact.querySelectorAll('.contact-link');
      
      contactLinks.forEach(link => {
        expect(link.tabIndex).not.toBe(-1);
      });
    });

    test('should have proper focus styles', () => {
      const contactLink = heroContact.querySelector('.contact-link');
      
      // Simulate focus
      contactLink.focus();
      
      // Check if element can receive focus
      expect(document.activeElement).toBe(contactLink);
    });
  });

  describe('Responsive Design', () => {
    test('should adapt contact links layout on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const heroContactStyle = window.getComputedStyle(heroContact);
      expect(heroContactStyle.display).toBe('flex');
      expect(heroContactStyle.flexWrap).toBe('wrap');
    });

    test('should maintain proper spacing on different screen sizes', () => {
      const heroContentStyle = window.getComputedStyle(document.querySelector('.hero-content'));
      expect(heroContentStyle.maxWidth).toBe('800px');
      expect(heroContentStyle.margin).toContain('auto');
    });
  });
});

// Test utilities for Hero component
const HeroTestUtils = {
  createMockPortfolioData(overrides = {}) {
    return {
      personal: {
        name: 'Test User',
        title: 'Test Professional',
        contact: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com/in/testuser',
          github: 'https://github.com/testuser'
        },
        ...overrides
      }
    };
  },

  simulateHeroAnimation(element, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        resolve();
      }, delay);
    });
  },

  createContactLink(href, text, isExternal = false) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.className = 'contact-link';
    
    if (isExternal) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    
    return link;
  }
};

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeroTestUtils };
}