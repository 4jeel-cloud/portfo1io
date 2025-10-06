// Navigation functionality with enhanced scroll behavior and accessibility
class Navigation {
  constructor() {
    this.header = document.getElementById('header');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    
    // State management
    this.isMenuOpen = false;
    this.currentActiveSection = null;
    this.scrollTimeout = null;
    this.lastScrollY = window.scrollY;
    
    // Scroll spy observer
    this.scrollSpyObserver = null;
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupScrollSpy();
    this.setupHeaderScroll();
    this.setupKeyboardNavigation();
    this.setupResizeHandler();
    
    // Initialize ARIA attributes
    this.updateAriaAttributes();
  }

  setupMobileMenu() {
    if (this.navToggle && this.navMenu) {
      // Toggle button click handler
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });

      // Touch-friendly toggle handling
      this.navToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.navToggle.style.transform = 'scale(0.95)';
      }, { passive: false });

      this.navToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.navToggle.style.transform = 'scale(1)';
        this.toggleMobileMenu();
      }, { passive: false });

      // Close mobile menu when clicking on a link
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Add touch feedback
          if (this.isMenuOpen) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            setTimeout(() => {
              link.style.backgroundColor = '';
              this.closeMobileMenu();
            }, 150);
          }
        });

        // Touch feedback for menu links
        link.addEventListener('touchstart', () => {
          if (this.isMenuOpen) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }
        }, { passive: true });

        link.addEventListener('touchend', () => {
          if (this.isMenuOpen) {
            setTimeout(() => {
              link.style.backgroundColor = '';
            }, 150);
          }
        }, { passive: true });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen && 
            !this.navToggle.contains(e.target) && 
            !this.navMenu.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Handle touch outside menu
      document.addEventListener('touchstart', (e) => {
        if (this.isMenuOpen && 
            !this.navToggle.contains(e.target) && 
            !this.navMenu.contains(e.target)) {
          this.closeMobileMenu();
        }
      }, { passive: true });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.closeMobileMenu();
          this.navToggle.focus();
        }
      });

      // Prevent scroll when menu is open on mobile
      this.setupScrollLock();
    }
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    this.navToggle.classList.toggle('active', this.isMenuOpen);
    this.navMenu.classList.toggle('active', this.isMenuOpen);
    
    // Update ARIA attributes
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
    this.navMenu.setAttribute('aria-hidden', (!this.isMenuOpen).toString());
    
    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      this.lockScroll();
      // Focus first menu item for keyboard navigation
      const firstLink = this.navMenu.querySelector('.nav-link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
      
      // Add haptic feedback on supported devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else {
      this.unlockScroll();
    }
  }

  closeMobileMenu() {
    if (!this.isMenuOpen) return;
    
    this.isMenuOpen = false;
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    
    // Update ARIA attributes
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navMenu.setAttribute('aria-hidden', 'true');
    
    this.unlockScroll();
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            this.scrollToSection(targetSection);
            
            // Update URL without triggering scroll
            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
          }
        }
      });
    });
  }

  scrollToSection(targetSection) {
    const headerHeight = this.header.offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight - 20; // Extra padding
    
    // Use requestAnimationFrame for smoother scrolling on older browsers
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback smooth scroll for older browsers
      this.smoothScrollTo(targetPosition, 500);
    }
  }

  smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  setupScrollSpy() {
    // Enhanced scroll spy with better intersection detection
    const observerOptions = {
      root: null,
      rootMargin: `-${this.header.offsetHeight + 50}px 0px -50% 0px`,
      threshold: [0, 0.1, 0.5]
    };

    this.scrollSpyObserver = new IntersectionObserver((entries) => {
      let mostVisibleEntry = null;
      let maxIntersectionRatio = 0;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
          maxIntersectionRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry) {
        const id = mostVisibleEntry.target.getAttribute('id');
        this.updateActiveNavLink(id);
      }
    }, observerOptions);

    this.sections.forEach(section => {
      this.scrollSpyObserver.observe(section);
    });

    // Fallback scroll spy for better accuracy
    this.setupScrollSpyFallback();
  }

  setupScrollSpyFallback() {
    let ticking = false;

    const updateScrollSpy = () => {
      const scrollPosition = window.scrollY + this.header.offsetHeight + 100;
      let activeSection = null;

      this.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeSection = section.getAttribute('id');
        }
      });

      if (activeSection && activeSection !== this.currentActiveSection) {
        this.updateActiveNavLink(activeSection);
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollSpy);
        ticking = true;
      }
    });
  }

  updateActiveNavLink(activeId) {
    if (this.currentActiveSection === activeId) return;
    
    this.currentActiveSection = activeId;
    
    this.navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
      
      // Announce section change to screen readers
      if (isActive) {
        this.announceToScreenReader(`Navigated to ${activeId} section`);
      }
    });
  }

  announceToScreenReader(message) {
    // Create or update live region for screen reader announcements
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sr-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  setupHeaderScroll() {
    let ticking = false;
    
    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > this.lastScrollY;
      const scrollingUp = currentScrollY < this.lastScrollY;
      
      // Add/remove scrolled class for styling
      this.header.classList.toggle('scrolled', currentScrollY > 50);
      
      // Hide/show header on scroll with improved logic
      if (scrollingDown && currentScrollY > 100 && !this.isMenuOpen) {
        this.header.style.transform = 'translateY(-100%)';
        this.header.setAttribute('aria-hidden', 'true');
      } else if (scrollingUp || currentScrollY <= 100) {
        this.header.style.transform = 'translateY(0)';
        this.header.setAttribute('aria-hidden', 'false');
      }
      
      this.lastScrollY = currentScrollY;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for menu items
    this.navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % this.navLinks.length;
          this.navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + this.navLinks.length) % this.navLinks.length;
          this.navLinks[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.navLinks[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          this.navLinks[this.navLinks.length - 1].focus();
        }
      });
    });
  }

  setupScrollLock() {
    this.scrollPosition = 0;
  }

  lockScroll() {
    this.scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
  }

  unlockScroll() {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, this.scrollPosition);
  }

  setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 768 && this.isMenuOpen) {
          this.closeMobileMenu();
        }
        
        // Update scroll spy observer margins
        if (this.scrollSpyObserver) {
          this.scrollSpyObserver.disconnect();
          this.setupScrollSpy();
        }
      }, 250);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (this.isMenuOpen) {
          // Recalculate menu positioning after orientation change
          this.closeMobileMenu();
        }
      }, 100);
    });
  }

  updateAriaAttributes() {
    // Initialize ARIA attributes for accessibility
    if (this.navToggle) {
      this.navToggle.setAttribute('aria-expanded', 'false');
      this.navToggle.setAttribute('aria-controls', 'nav-menu');
      this.navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      this.navToggle.setAttribute('aria-haspopup', 'true');
    }
    
    if (this.navMenu) {
      this.navMenu.setAttribute('aria-hidden', 'true');
      this.navMenu.setAttribute('role', 'menubar');
      this.navMenu.setAttribute('aria-label', 'Main navigation');
    }
    
    this.navLinks.forEach((link, index) => {
      link.setAttribute('aria-current', 'false');
      link.setAttribute('tabindex', '0');
      
      // Add keyboard navigation hints
      const sectionName = link.textContent.trim();
      link.setAttribute('aria-label', `Navigate to ${sectionName} section`);
    });
  }

  // Public methods for testing and external use
  getCurrentActiveSection() {
    return this.currentActiveSection;
  }

  isMenuOpen() {
    return this.isMenuOpen;
  }

  destroy() {
    // Cleanup method for testing
    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});