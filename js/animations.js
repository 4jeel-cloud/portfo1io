// Enhanced Animation utilities and effects
class Animations {
  constructor() {
    this.observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };
    
    this.heroAnimationComplete = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.loadingStates = new Map();
    this.animationQueue = [];
    this.init();
  }

  init() {
    this.setupReducedMotionListener();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupHeroAnimations();
    this.setupScrollIndicator();
    this.setupPageTransitions();
    this.setupSkeletonScreens();
    this.setupMicroInteractions();
  }

  setupReducedMotionListener() {
    // Listen for changes in motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.updateAnimationsForMotionPreference();
    });
  }

  updateAnimationsForMotionPreference() {
    const body = document.body;
    if (this.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }

  setupHeroAnimations() {
    // Enhanced hero animations with staggered reveals
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroContact = document.getElementById('hero-contact');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Reset initial states
    if (heroTitle) {
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(50px)';
    }
    if (heroSubtitle) {
      heroSubtitle.style.opacity = '0';
      heroSubtitle.style.transform = 'translateY(30px)';
    }
    if (heroContact) {
      heroContact.style.opacity = '0';
      heroContact.style.transform = 'translateY(20px)';
    }
    if (scrollIndicator) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
    }

    // Animate elements in sequence
    setTimeout(() => this.animateHeroTitle(heroTitle), 500);
    setTimeout(() => this.animateHeroSubtitle(heroSubtitle), 800);
    setTimeout(() => this.animateHeroContact(heroContact), 1100);
    setTimeout(() => this.animateScrollIndicator(scrollIndicator), 1400);
    setTimeout(() => { this.heroAnimationComplete = true; }, 1500);
  }

  animateHeroTitle(element) {
    if (!element) return;
    
    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Add typewriter effect for the name
    const originalText = element.textContent;
    if (originalText) {
      element.textContent = '';
      this.typeWriter(element, originalText, 80);
    }
  }

  animateHeroSubtitle(element) {
    if (!element) return;
    
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  animateHeroContact(element) {
    if (!element) return;
    
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Stagger contact link animations
    const contactLinks = element.querySelectorAll('.contact-link');
    contactLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
      setTimeout(() => {
        link.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  animateScrollIndicator(element) {
    if (!element) return;
    
    element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '1';
    element.style.transform = 'translateX(-50%) translateY(0)';
  }

  setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    // Add click handler for smooth scroll to next section
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });

    // Hide scroll indicator when scrolling past hero
    window.addEventListener('scroll', () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const scrollPosition = window.pageYOffset + window.innerHeight;

      if (scrollPosition > heroBottom) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    });
  }

  setupScrollAnimations() {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, this.observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
      '.timeline-item, .project-card, .skill-category, .about-content'
    );
    
    animateElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  setupHoverEffects() {
    // Enhanced hover effects for interactive elements
    const hoverElements = document.querySelectorAll(
      '.contact-link, .project-card, .timeline-card, .skill-item'
    );

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        this.addHoverEffect(e.target);
      });

      el.addEventListener('mouseleave', (e) => {
        this.removeHoverEffect(e.target);
      });
    });

    // Special hover effects for hero contact links
    this.setupContactLinkEffects();
  }

  setupContactLinkEffects() {
    // Wait for contact links to be populated
    setTimeout(() => {
      const heroContactLinks = document.querySelectorAll('#hero-contact .contact-link');
      
      heroContactLinks.forEach(link => {
        // Add external link indicators
        if (link.href && (link.href.includes('linkedin') || link.href.includes('github') || link.href.includes('behance'))) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          
          // Add external link icon
          const icon = document.createElement('span');
          icon.innerHTML = '↗';
          icon.style.marginLeft = '4px';
          icon.style.fontSize = '0.8em';
          icon.style.opacity = '0.7';
          link.appendChild(icon);
        }

        // Enhanced hover animations
        link.addEventListener('mouseenter', () => {
          link.style.transform = 'translateY(-3px) scale(1.05)';
          link.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });

        link.addEventListener('mouseleave', () => {
          link.style.transform = 'translateY(0) scale(1)';
          link.style.boxShadow = 'none';
        });

        // Add ripple effect on click
        link.addEventListener('click', (e) => {
          this.createRippleEffect(e, link);
        });
      });
    }, 1000);
  }

  createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupLoadingAnimations() {
    // Stagger animations for lists and grids
    this.staggerAnimation('.timeline-item', 100);
    this.staggerAnimation('.project-card', 150);
    this.staggerAnimation('.skill-category', 100);
  }

  setupSkeletonScreens() {
    // Create skeleton screens for content loading
    this.createSkeletonForSection('hero');
    this.createSkeletonForSection('about');
    this.createSkeletonForSection('summary');
    this.createSkeletonForSection('experience');
    this.createSkeletonForSection('projects');
    this.createSkeletonForSection('skills');
    this.createSkeletonForSection('contact');
  }

  createSkeletonForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const skeletonContainer = document.createElement('div');
    skeletonContainer.className = 'skeleton-container';
    skeletonContainer.setAttribute('aria-hidden', 'true');
    
    let skeletonHTML = '';
    
    switch (sectionId) {
      case 'hero':
        skeletonHTML = `
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-subtitle"></div>
          <div class="skeleton-contact-links">
            <div class="skeleton skeleton-button"></div>
            <div class="skeleton skeleton-button"></div>
            <div class="skeleton skeleton-button"></div>
          </div>
        `;
        break;
      case 'about':
        skeletonHTML = `
          <div class="skeleton skeleton-image-circle"></div>
          <div class="skeleton-text-block">
            <div class="skeleton skeleton-text-line"></div>
            <div class="skeleton skeleton-text-line"></div>
            <div class="skeleton skeleton-text-line short"></div>
          </div>
        `;
        break;
      case 'experience':
        skeletonHTML = `
          <div class="skeleton-timeline">
            ${Array(3).fill().map(() => `
              <div class="skeleton-timeline-item">
                <div class="skeleton skeleton-card-title"></div>
                <div class="skeleton skeleton-text-line"></div>
                <div class="skeleton skeleton-text-line short"></div>
              </div>
            `).join('')}
          </div>
        `;
        break;
      case 'projects':
        skeletonHTML = `
          <div class="skeleton-projects-grid">
            ${Array(6).fill().map(() => `
              <div class="skeleton-project-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-card-title"></div>
                <div class="skeleton skeleton-text-line"></div>
                <div class="skeleton skeleton-text-line short"></div>
              </div>
            `).join('')}
          </div>
        `;
        break;
      case 'skills':
        skeletonHTML = `
          <div class="skeleton-skills-grid">
            ${Array(4).fill().map(() => `
              <div class="skeleton-skill-category">
                <div class="skeleton skeleton-category-title"></div>
                <div class="skeleton-skill-items">
                  ${Array(5).fill().map(() => `<div class="skeleton skeleton-skill-tag"></div>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `;
        break;
      default:
        skeletonHTML = `
          <div class="skeleton skeleton-text-line"></div>
          <div class="skeleton skeleton-text-line"></div>
          <div class="skeleton skeleton-text-line short"></div>
        `;
    }
    
    skeletonContainer.innerHTML = skeletonHTML;
    
    // Insert skeleton before the actual content
    const container = section.querySelector('.container');
    if (container) {
      container.appendChild(skeletonContainer);
    }
    
    // Store reference for later removal
    this.loadingStates.set(sectionId, skeletonContainer);
  }

  hideSkeletonForSection(sectionId) {
    const skeleton = this.loadingStates.get(sectionId);
    if (skeleton) {
      skeleton.style.opacity = '0';
      skeleton.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        skeleton.remove();
        this.loadingStates.delete(sectionId);
      }, 300);
    }
  }

  setupPageTransitions() {
    // Enhanced smooth scrolling with easing
    this.setupSmoothScrolling();
    
    // Page load transition
    this.setupPageLoadTransition();
    
    // Section transition effects
    this.setupSectionTransitions();
  }

  setupSmoothScrolling() {
    // Override default scroll behavior for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.smoothScrollToElement(targetElement);
        }
      });
    });
  }

  smoothScrollToElement(element, options = {}) {
    const defaultOptions = {
      behavior: this.reducedMotion ? 'auto' : 'smooth',
      block: 'start',
      inline: 'nearest'
    };
    
    const scrollOptions = { ...defaultOptions, ...options };
    
    if (!this.reducedMotion) {
      // Add custom easing for smooth scroll
      this.customSmoothScroll(element);
    } else {
      element.scrollIntoView(scrollOptions);
    }
  }

  customSmoothScroll(target) {
    const targetPosition = target.offsetTop - 80; // Account for fixed header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
    let start = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  setupPageLoadTransition() {
    // Create page load overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-load-overlay';
    overlay.innerHTML = `
      <div class="page-load-content">
        <div class="page-load-spinner"></div>
        <div class="page-load-text">Loading Portfolio...</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Remove overlay when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
          overlay.remove();
        }, 500);
      }, 1000);
    });
  }

  setupSectionTransitions() {
    // Enhanced intersection observer for section transitions
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSectionEntry(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '50px'
    });

    // Observe all main sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.add('section-hidden');
      sectionObserver.observe(section);
    });
  }

  animateSectionEntry(section) {
    if (this.reducedMotion) {
      section.classList.add('section-visible');
      return;
    }

    // Staggered animation for section content
    const elements = section.querySelectorAll('.section-title, .about-content, .summary-content, .timeline-item, .project-card, .skill-category, .contact-content');
    
    section.classList.add('section-visible');
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * 100);
    });
  }

  setupMicroInteractions() {
    // Enhanced button interactions
    this.setupButtonInteractions();
    
    // Card hover effects
    this.setupCardInteractions();
    
    // Form interactions
    this.setupFormInteractions();
    
    // Navigation interactions
    this.setupNavigationInteractions();
  }

  setupButtonInteractions() {
    const buttons = document.querySelectorAll('button, .btn, .contact-link');
    
    buttons.forEach(button => {
      // Add ripple effect on click
      button.addEventListener('click', (e) => {
        if (!this.reducedMotion) {
          this.createRippleEffect(e, button);
        }
      });
      
      // Enhanced hover effects
      button.addEventListener('mouseenter', () => {
        if (!this.reducedMotion) {
          button.style.transform = 'translateY(-2px) scale(1.02)';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (!this.reducedMotion) {
          button.style.transform = 'translateY(0) scale(1)';
        }
      });
      
      // Focus effects
      button.addEventListener('focus', () => {
        button.classList.add('focus-visible');
      });
      
      button.addEventListener('blur', () => {
        button.classList.remove('focus-visible');
      });
    });
  }

  setupCardInteractions() {
    const cards = document.querySelectorAll('.card, .timeline-card, .project-card, .skill-category');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.reducedMotion) {
          this.animateCardHover(card, true);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (!this.reducedMotion) {
          this.animateCardHover(card, false);
        }
      });
    });
  }

  animateCardHover(card, isHovering) {
    if (isHovering) {
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    } else {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '';
    }
  }

  setupFormInteractions() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const parent = input.closest('.form-group, .input-group');
        if (parent) {
          parent.classList.add('focused');
        }
      });
      
      input.addEventListener('blur', () => {
        const parent = input.closest('.form-group, .input-group');
        if (parent) {
          parent.classList.remove('focused');
        }
      });
    });
  }

  setupNavigationInteractions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!this.reducedMotion) {
          link.style.transform = 'translateY(-2px)';
        }
      });
      
      link.addEventListener('mouseleave', () => {
        if (!this.reducedMotion) {
          link.style.transform = 'translateY(0)';
        }
      });
    });
  }

  addHoverEffect(element) {
    element.style.transform = element.style.transform || '';
    if (!element.style.transform.includes('scale')) {
      element.style.transform += ' scale(1.02)';
    }
  }

  removeHoverEffect(element) {
    element.style.transform = element.style.transform.replace(' scale(1.02)', '');
  }

  staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * delay}ms`;
    });
  }

  // Utility function to animate number counting
  animateNumber(element, start, end, duration = 2000) {
    const startTime = performance.now();
    const difference = end - start;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (difference * easeOut));
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }

  // Utility function for typewriter effect
  typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  // Parallax effect for hero section
  setupParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }

  // Smooth reveal animation for elements
  revealElement(element, delay = 0) {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s ease-out';
      
      // Trigger animation
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    }, delay);
  }
}

// Enhanced CSS for animations and skeleton screens (added dynamically)
const animationStyles = `
  /* Reduced Motion Support */
  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Page Load Overlay */
  .page-load-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-background);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .page-load-content {
    text-align: center;
    color: var(--color-text-primary);
  }

  .page-load-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-gray-300);
    border-top: 3px solid var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  .page-load-text {
    font-size: var(--font-size-body);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Section Transitions */
  .section-hidden {
    opacity: 0;
    transform: translateY(50px);
  }

  .section-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Skeleton Screens */
  .skeleton-container {
    padding: var(--space-8) 0;
  }

  .skeleton {
    background: linear-gradient(90deg, var(--color-gray-200) 25%, var(--color-gray-100) 50%, var(--color-gray-200) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: var(--space-4);
  }

  .skeleton-title {
    height: 3rem;
    width: 60%;
    margin: 0 auto var(--space-6);
  }

  .skeleton-subtitle {
    height: 1.5rem;
    width: 40%;
    margin: 0 auto var(--space-8);
  }

  .skeleton-contact-links {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .skeleton-button {
    height: 2.5rem;
    width: 120px;
    border-radius: 8px;
  }

  .skeleton-image-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto var(--space-6);
  }

  .skeleton-image {
    height: 200px;
    width: 100%;
    border-radius: 8px;
    margin-bottom: var(--space-4);
  }

  .skeleton-text-block {
    max-width: 600px;
    margin: 0 auto;
  }

  .skeleton-text-line {
    height: 1rem;
    width: 100%;
    margin-bottom: var(--space-3);
  }

  .skeleton-text-line.short {
    width: 70%;
  }

  .skeleton-card-title {
    height: 1.5rem;
    width: 80%;
    margin-bottom: var(--space-3);
  }

  .skeleton-category-title {
    height: 1.25rem;
    width: 60%;
    margin-bottom: var(--space-4);
  }

  .skeleton-timeline {
    max-width: 800px;
    margin: 0 auto;
  }

  .skeleton-timeline-item {
    background: var(--color-secondary);
    padding: var(--space-6);
    border-radius: 12px;
    margin-bottom: var(--space-8);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .skeleton-projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-6);
  }

  .skeleton-project-card {
    background: var(--color-secondary);
    padding: var(--space-6);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .skeleton-skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-6);
  }

  .skeleton-skill-category {
    background: var(--color-secondary);
    padding: var(--space-6);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .skeleton-skill-items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .skeleton-skill-tag {
    height: 1.5rem;
    width: 80px;
    border-radius: 16px;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Enhanced Scroll Animations */
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .timeline-item.animate-on-scroll {
    transform: translateX(-30px);
  }
  
  .timeline-item:nth-child(even).animate-on-scroll {
    transform: translateX(30px);
  }
  
  .timeline-item.animate-in {
    transform: translateX(0);
  }

  /* Micro-interactions */
  .focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
    box-shadow: 0 0 0 1px var(--color-background), 0 0 0 4px var(--color-accent);
  }

  /* Button Interactions */
  button, .btn, .contact-link {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  /* Ripple Effect */
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  /* Enhanced Hover Effects */
  .card, .timeline-card, .project-card, .skill-category {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Navigation Enhancements */
  .nav-link {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Scroll Indicator */
  .scroll-indicator {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .scroll-indicator:hover {
    transform: translateX(-50%) translateY(-5px);
  }

  .scroll-indicator:hover .scroll-arrow {
    border-color: var(--color-accent);
  }

  /* Form Interactions */
  .form-group.focused,
  .input-group.focused {
    transform: scale(1.02);
  }

  .form-group input:focus,
  .input-group input:focus {
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
  }

  /* Dark Theme Skeleton Adjustments */
  [data-theme="dark"] .skeleton {
    background: linear-gradient(90deg, var(--color-gray-700) 25%, var(--color-gray-600) 50%, var(--color-gray-700) 75%);
    background-size: 200% 100%;
  }

  [data-theme="dark"] .skeleton-timeline-item,
  [data-theme="dark"] .skeleton-project-card,
  [data-theme="dark"] .skeleton-skill-category {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  /* Responsive Skeleton Adjustments */
  @media (max-width: 768px) {
    .skeleton-projects-grid {
      grid-template-columns: 1fr;
    }
    
    .skeleton-skills-grid {
      grid-template-columns: 1fr;
    }
    
    .skeleton-contact-links {
      flex-direction: column;
      align-items: center;
    }
  }
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Animations();
});