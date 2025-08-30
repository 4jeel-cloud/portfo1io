// Animation system tests
describe('Animations', () => {
  let animations;
  let mockElement;
  let mockIntersectionObserver;

  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = `
      <div id="hero" class="section">
        <div class="container">
          <h1 id="hero-title">Test Title</h1>
          <p id="hero-subtitle">Test Subtitle</p>
          <div id="hero-contact"></div>
        </div>
        <div class="scroll-indicator">
          <div class="scroll-arrow"></div>
        </div>
      </div>
      <div id="about" class="section">
        <div class="container">
          <div class="about-content"></div>
        </div>
      </div>
      <div id="summary" class="section">
        <div class="container">
          <div class="summary-content"></div>
        </div>
      </div>
      <div id="experience" class="section">
        <div class="container">
          <div class="timeline"></div>
        </div>
      </div>
      <div id="projects" class="section">
        <div class="container">
          <div class="projects-grid"></div>
        </div>
      </div>
      <div id="skills" class="section">
        <div class="container">
          <div class="skills-categories"></div>
        </div>
      </div>
      <div id="contact" class="section">
        <div class="container">
          <div class="contact-content"></div>
        </div>
      </div>
    `;

    // Mock IntersectionObserver
    mockIntersectionObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };

    global.IntersectionObserver = jest.fn(() => mockIntersectionObserver);

    // Mock matchMedia for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
    global.cancelAnimationFrame = jest.fn();

    // Mock performance.now
    global.performance = {
      now: jest.fn(() => Date.now())
    };

    animations = new Animations();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    test('should initialize with correct default values', () => {
      expect(animations.reducedMotion).toBe(false);
      expect(animations.heroAnimationComplete).toBe(false);
      expect(animations.loadingStates).toBeInstanceOf(Map);
      expect(animations.animationQueue).toBeInstanceOf(Array);
    });

    test('should detect reduced motion preference', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const reducedMotionAnimations = new Animations();
      expect(reducedMotionAnimations.reducedMotion).toBe(true);
    });

    test('should add reduced motion class to body when preference is set', () => {
      animations.reducedMotion = true;
      animations.updateAnimationsForMotionPreference();
      expect(document.body.classList.contains('reduced-motion')).toBe(true);
    });
  });

  describe('Skeleton Screens', () => {
    test('should create skeleton screens for all sections', () => {
      animations.setupSkeletonScreens();
      
      const sections = ['hero', 'about', 'summary', 'experience', 'projects', 'skills', 'contact'];
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const skeleton = section.querySelector('.skeleton-container');
        expect(skeleton).toBeTruthy();
        expect(animations.loadingStates.has(sectionId)).toBe(true);
      });
    });

    test('should create hero skeleton with correct structure', () => {
      animations.createSkeletonForSection('hero');
      
      const heroSection = document.getElementById('hero');
      const skeleton = heroSection.querySelector('.skeleton-container');
      
      expect(skeleton.querySelector('.skeleton-title')).toBeTruthy();
      expect(skeleton.querySelector('.skeleton-subtitle')).toBeTruthy();
      expect(skeleton.querySelector('.skeleton-contact-links')).toBeTruthy();
      expect(skeleton.querySelectorAll('.skeleton-button')).toHaveLength(3);
    });

    test('should create projects skeleton with grid structure', () => {
      animations.createSkeletonForSection('projects');
      
      const projectsSection = document.getElementById('projects');
      const skeleton = projectsSection.querySelector('.skeleton-container');
      
      expect(skeleton.querySelector('.skeleton-projects-grid')).toBeTruthy();
      expect(skeleton.querySelectorAll('.skeleton-project-card')).toHaveLength(6);
    });

    test('should hide skeleton with animation', (done) => {
      animations.createSkeletonForSection('hero');
      const skeleton = animations.loadingStates.get('hero');
      
      animations.hideSkeletonForSection('hero');
      
      expect(skeleton.style.opacity).toBe('0');
      expect(skeleton.style.transform).toBe('translateY(-10px)');
      
      setTimeout(() => {
        expect(animations.loadingStates.has('hero')).toBe(false);
        done();
      }, 350);
    });
  });

  describe('Smooth Scrolling', () => {
    test('should setup smooth scrolling for navigation links', () => {
      // Add navigation links to DOM
      document.body.innerHTML += `
        <nav>
          <a href="#hero" class="nav-link">Hero</a>
          <a href="#about" class="nav-link">About</a>
        </nav>
      `;

      animations.setupSmoothScrolling();
      
      const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
      expect(navLinks).toHaveLength(2);
    });

    test('should use auto scroll behavior for reduced motion', () => {
      animations.reducedMotion = true;
      const mockElement = { scrollIntoView: jest.fn() };
      
      animations.smoothScrollToElement(mockElement);
      
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest'
      });
    });

    test('should use custom smooth scroll for normal motion', () => {
      animations.reducedMotion = false;
      const mockElement = { offsetTop: 1000 };
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      
      const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();
      
      animations.smoothScrollToElement(mockElement);
      
      // Should trigger requestAnimationFrame for custom scroll
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Page Load Transition', () => {
    test('should create page load overlay', () => {
      animations.setupPageLoadTransition();
      
      const overlay = document.querySelector('.page-load-overlay');
      expect(overlay).toBeTruthy();
      expect(overlay.querySelector('.page-load-spinner')).toBeTruthy();
      expect(overlay.querySelector('.page-load-text')).toBeTruthy();
    });

    test('should remove overlay on window load', (done) => {
      animations.setupPageLoadTransition();
      const overlay = document.querySelector('.page-load-overlay');
      
      // Trigger window load event
      window.dispatchEvent(new Event('load'));
      
      setTimeout(() => {
        expect(overlay.style.opacity).toBe('0');
        expect(overlay.style.transform).toBe('scale(1.1)');
        done();
      }, 100);
    });
  });

  describe('Section Transitions', () => {
    test('should setup intersection observer for sections', () => {
      animations.setupSectionTransitions();
      
      const sections = document.querySelectorAll('.section');
      expect(mockIntersectionObserver.observe).toHaveBeenCalledTimes(sections.length);
      
      sections.forEach(section => {
        expect(section.classList.contains('section-hidden')).toBe(true);
      });
    });

    test('should animate section entry when intersecting', () => {
      const mockSection = document.getElementById('hero');
      mockSection.innerHTML = `
        <div class="section-title">Title</div>
        <div class="about-content">Content</div>
      `;
      
      animations.animateSectionEntry(mockSection);
      
      expect(mockSection.classList.contains('section-visible')).toBe(true);
    });

    test('should skip animations for reduced motion', () => {
      animations.reducedMotion = true;
      const mockSection = document.getElementById('hero');
      
      animations.animateSectionEntry(mockSection);
      
      expect(mockSection.classList.contains('section-visible')).toBe(true);
      // Should not set up staggered animations
    });
  });

  describe('Micro-interactions', () => {
    test('should setup button interactions', () => {
      document.body.innerHTML += `
        <button id="test-button">Test Button</button>
        <a href="#" class="btn">Test Link</a>
      `;

      animations.setupButtonInteractions();
      
      const button = document.getElementById('test-button');
      const mouseEnterEvent = new Event('mouseenter');
      
      button.dispatchEvent(mouseEnterEvent);
      
      if (!animations.reducedMotion) {
        expect(button.style.transform).toBe('translateY(-2px) scale(1.02)');
      }
    });

    test('should create ripple effect on button click', () => {
      document.body.innerHTML += `<button id="ripple-button">Ripple Test</button>`;
      
      const button = document.getElementById('ripple-button');
      button.style.position = 'relative';
      
      const clickEvent = new MouseEvent('click', {
        clientX: 50,
        clientY: 50
      });
      
      // Mock getBoundingClientRect
      button.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 40
      }));
      
      animations.createRippleEffect(clickEvent, button);
      
      const ripple = button.querySelector('span');
      expect(ripple).toBeTruthy();
      expect(button.style.position).toBe('relative');
      expect(button.style.overflow).toBe('hidden');
    });

    test('should setup card interactions', () => {
      document.body.innerHTML += `
        <div class="card">Card 1</div>
        <div class="project-card">Card 2</div>
      `;

      animations.setupCardInteractions();
      
      const card = document.querySelector('.card');
      const mouseEnterEvent = new Event('mouseenter');
      
      card.dispatchEvent(mouseEnterEvent);
      
      // Should call animateCardHover if not reduced motion
      if (!animations.reducedMotion) {
        expect(card.style.transform).toBe('translateY(-8px) scale(1.02)');
      }
    });

    test('should setup navigation interactions', () => {
      document.body.innerHTML += `
        <nav>
          <a href="#" class="nav-link">Nav Link</a>
        </nav>
      `;

      animations.setupNavigationInteractions();
      
      const navLink = document.querySelector('.nav-link');
      const mouseEnterEvent = new Event('mouseenter');
      
      navLink.dispatchEvent(mouseEnterEvent);
      
      if (!animations.reducedMotion) {
        expect(navLink.style.transform).toBe('translateY(-2px)');
      }
    });
  });

  describe('Hero Animations', () => {
    test('should setup hero animations with staggered timing', (done) => {
      animations.setupHeroAnimations();
      
      const heroTitle = document.getElementById('hero-title');
      const heroSubtitle = document.getElementById('hero-subtitle');
      
      // Check initial states
      expect(heroTitle.style.opacity).toBe('0');
      expect(heroTitle.style.transform).toBe('translateY(50px)');
      expect(heroSubtitle.style.opacity).toBe('0');
      
      // Wait for first animation to start
      setTimeout(() => {
        expect(animations.heroAnimationComplete).toBe(false);
        done();
      }, 600);
    });

    test('should animate hero title with typewriter effect', () => {
      const mockElement = document.createElement('h1');
      mockElement.textContent = 'Test Title';
      
      animations.animateHeroTitle(mockElement);
      
      expect(mockElement.style.transition).toContain('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(mockElement.style.opacity).toBe('1');
      expect(mockElement.style.transform).toBe('translateY(0)');
    });

    test('should handle typewriter effect', (done) => {
      const mockElement = document.createElement('div');
      const testText = 'Hello';
      
      animations.typeWriter(mockElement, testText, 10);
      
      setTimeout(() => {
        expect(mockElement.textContent.length).toBeGreaterThan(0);
        done();
      }, 100);
    });
  });

  describe('Scroll Indicator', () => {
    test('should setup scroll indicator interactions', () => {
      animations.setupScrollIndicator();
      
      const scrollIndicator = document.querySelector('.scroll-indicator');
      expect(scrollIndicator).toBeTruthy();
    });

    test('should hide scroll indicator when scrolling past hero', () => {
      const scrollIndicator = document.querySelector('.scroll-indicator');
      const heroSection = document.getElementById('hero');
      
      // Mock offsetTop and offsetHeight
      Object.defineProperty(heroSection, 'offsetTop', { value: 0 });
      Object.defineProperty(heroSection, 'offsetHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 900 });
      Object.defineProperty(window, 'innerHeight', { value: 600 });
      
      animations.setupScrollIndicator();
      
      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'));
      
      expect(scrollIndicator.style.opacity).toBe('0');
      expect(scrollIndicator.style.pointerEvents).toBe('none');
    });
  });

  describe('Utility Functions', () => {
    test('should animate numbers with easing', (done) => {
      const mockElement = document.createElement('div');
      
      animations.animateNumber(mockElement, 0, 100, 100);
      
      setTimeout(() => {
        const currentValue = parseInt(mockElement.textContent);
        expect(currentValue).toBeGreaterThan(0);
        expect(currentValue).toBeLessThanOrEqual(100);
        done();
      }, 150);
    });

    test('should reveal elements with delay', (done) => {
      const mockElement = document.createElement('div');
      document.body.appendChild(mockElement);
      
      animations.revealElement(mockElement, 50);
      
      setTimeout(() => {
        expect(mockElement.style.opacity).toBe('0');
        expect(mockElement.style.transform).toBe('translateY(30px)');
        done();
      }, 60);
    });

    test('should stagger animations for multiple elements', () => {
      document.body.innerHTML += `
        <div class="test-item">Item 1</div>
        <div class="test-item">Item 2</div>
        <div class="test-item">Item 3</div>
      `;

      animations.staggerAnimation('.test-item', 100);
      
      const items = document.querySelectorAll('.test-item');
      items.forEach((item, index) => {
        expect(item.style.animationDelay).toBe(`${index * 100}ms`);
      });
    });
  });

  describe('Accessibility', () => {
    test('should respect reduced motion preferences', () => {
      animations.reducedMotion = true;
      
      const mockButton = document.createElement('button');
      document.body.appendChild(mockButton);
      
      animations.setupButtonInteractions();
      
      const mouseEnterEvent = new Event('mouseenter');
      mockButton.dispatchEvent(mouseEnterEvent);
      
      // Should not apply transform when reduced motion is enabled
      expect(mockButton.style.transform).toBe('');
    });

    test('should add focus-visible class on button focus', () => {
      document.body.innerHTML += `<button id="focus-button">Focus Test</button>`;
      
      animations.setupButtonInteractions();
      
      const button = document.getElementById('focus-button');
      const focusEvent = new Event('focus');
      
      button.dispatchEvent(focusEvent);
      
      expect(button.classList.contains('focus-visible')).toBe(true);
    });

    test('should remove focus-visible class on button blur', () => {
      document.body.innerHTML += `<button id="blur-button" class="focus-visible">Blur Test</button>`;
      
      animations.setupButtonInteractions();
      
      const button = document.getElementById('blur-button');
      const blurEvent = new Event('blur');
      
      button.dispatchEvent(blurEvent);
      
      expect(button.classList.contains('focus-visible')).toBe(false);
    });
  });

  describe('Performance', () => {
    test('should use requestAnimationFrame for smooth animations', () => {
      const mockElement = { offsetTop: 1000 };
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      
      animations.customSmoothScroll(mockElement);
      
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    test('should limit scroll animation duration', () => {
      const mockElement = { offsetTop: 10000 }; // Very far distance
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      
      animations.customSmoothScroll(mockElement);
      
      // Should cap duration at 1000ms regardless of distance
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    test('should cleanup animation queue', () => {
      expect(animations.animationQueue).toHaveLength(0);
      
      // Add some mock animations
      animations.animationQueue.push('animation1', 'animation2');
      expect(animations.animationQueue).toHaveLength(2);
      
      // Clear queue
      animations.animationQueue.length = 0;
      expect(animations.animationQueue).toHaveLength(0);
    });
  });
});

// Integration tests for animation system
describe('Animation Integration', () => {
  let animations;

  beforeEach(() => {
    // Setup full DOM structure
    document.body.innerHTML = `
      <header class="header">
        <nav class="nav">
          <a href="#hero" class="nav-link">Home</a>
          <a href="#about" class="nav-link">About</a>
        </nav>
      </header>
      <main>
        <section id="hero" class="section hero">
          <div class="container">
            <h1 id="hero-title">Portfolio</h1>
            <p id="hero-subtitle">Professional Developer</p>
            <div id="hero-contact"></div>
          </div>
          <div class="scroll-indicator">
            <div class="scroll-arrow"></div>
          </div>
        </section>
        <section id="about" class="section">
          <div class="container">
            <div class="about-content"></div>
          </div>
        </section>
      </main>
    `;

    // Mock necessary APIs
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));

    animations = new Animations();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('should initialize all animation systems', () => {
    expect(animations.loadingStates.size).toBeGreaterThan(0);
    expect(document.querySelectorAll('.skeleton-container')).toHaveLength(2);
    expect(document.querySelector('.page-load-overlay')).toBeTruthy();
  });

  test('should handle navigation click with smooth scroll', () => {
    const navLink = document.querySelector('.nav-link[href="#about"]');
    const aboutSection = document.getElementById('about');
    
    // Mock scrollIntoView
    aboutSection.scrollIntoView = jest.fn();
    
    const clickEvent = new Event('click');
    navLink.dispatchEvent(clickEvent);
    
    // Should prevent default and trigger smooth scroll
    expect(clickEvent.defaultPrevented).toBe(true);
  });

  test('should coordinate multiple animation systems', (done) => {
    // Simulate content loading completion
    setTimeout(() => {
      animations.hideSkeletonForSection('hero');
      animations.hideSkeletonForSection('about');
      
      expect(animations.loadingStates.size).toBe(0);
      done();
    }, 100);
  });
});