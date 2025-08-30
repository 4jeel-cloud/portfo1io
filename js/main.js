// Main App component that orchestrates all portfolio sections
class App {
  constructor() {
    this.isLoaded = false;
    this.currentTheme = 'dark'; // Default to dark theme
    this.navigation = null;
    this.animations = null;
    this.performance = null;
    
    // Component registry for managing all sections
    this.components = new Map();
    
    // Initialize the application
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Initializing Portfolio App...');
      
      // Initialize core systems first
      this.initializeTheme();
      this.initializeComponents();
      
      // Load portfolio data with error handling
      await this.loadPortfolioDataWithRetry();
      
      // Initialize navigation and smooth scrolling
      this.initializeNavigation();
      
      // Populate all sections with error boundaries
      this.populateAllSections();
      
      // Initialize theme toggle functionality
      this.initializeThemeToggle();
      
      // Initialize animations and performance optimizations
      this.initializeEnhancements();
      
      // Initialize SEO optimization
      this.initializeSEO();
      
      // Mark as loaded
      this.isLoaded = true;
      
      // Trigger any post-load animations
      this.handleLoadComplete();
      
      console.log('✅ Portfolio App initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing portfolio:', error);
      
      // Try to continue with partial initialization
      try {
        // Ensure components are still registered
        if (this.components.size === 0) {
          this.initializeComponents();
        }
        
        // Try to populate sections with fallback data
        this.populateAllSections();
        
        // Mark as loaded even with errors
        this.isLoaded = true;
        
        console.warn('⚠️ Portfolio initialized with limited functionality');
      } catch (fallbackError) {
        console.error('❌ Critical initialization failure:', fallbackError);
      }
      
      this.handleLoadError(error);
    }
  }

  initializeComponents() {
    // Register all section components for centralized management
    this.components.set('hero', {
      element: document.getElementById('hero'),
      populated: false,
      populateMethod: () => this.populateHeroSection()
    });
    
    this.components.set('about', {
      element: document.getElementById('about'),
      populated: false,
      populateMethod: () => this.populateAboutSection()
    });
    
    this.components.set('education', {
      element: document.getElementById('education'),
      populated: false,
      populateMethod: () => this.populateEducationSection()
    });
    
    this.components.set('summary', {
      element: document.getElementById('summary'),
      populated: false,
      populateMethod: () => this.populateSummarySection()
    });
    
    this.components.set('experience', {
      element: document.getElementById('experience'),
      populated: false,
      populateMethod: () => this.populateExperienceSection()
    });
    
    this.components.set('projects', {
      element: document.getElementById('projects'),
      populated: false,
      populateMethod: () => this.populateProjectsSection()
    });
    
    this.components.set('skills', {
      element: document.getElementById('skills'),
      populated: false,
      populateMethod: () => this.populateSkillsSection()
    });
    
    this.components.set('contact', {
      element: document.getElementById('contact'),
      populated: false,
      populateMethod: () => this.populateContactSection()
    });
    
    console.log(`📦 Registered ${this.components.size} components`);
  }

  initializeNavigation() {
    // Navigation is initialized separately in navigation.js
    // We just need to ensure smooth scrolling works with our sections
    this.setupSmoothScrolling();
    console.log('🧭 Navigation system initialized');
  }

  initializeEnhancements() {
    // Initialize animations if available
    if (window.PortfolioAnimations) {
      this.animations = new window.PortfolioAnimations();
      console.log('✨ Animations initialized');
    }
    
    // Initialize performance optimizations if available
    if (window.performanceOptimizer) {
      this.performance = window.performanceOptimizer;
      console.log('⚡ Performance optimizations initialized');
    }
  }

  initializeSEO() {
    // Initialize SEO optimization if available
    if (window.SEOManager) {
      try {
        const portfolioData = window.portfolioData.getData();
        window.SEOManager.initialize(portfolioData);
        console.log('🔍 SEO optimization initialized');
      } catch (error) {
        console.error('❌ SEO initialization failed:', error);
      }
    } else {
      console.warn('⚠️ SEO Manager not available');
      // Try to initialize SEO after a short delay in case script is still loading
      setTimeout(() => {
        if (window.SEOManager) {
          console.log('🔍 SEO Manager found after delay, initializing...');
          try {
            const portfolioData = window.portfolioData.getData();
            window.SEOManager.initialize(portfolioData);
            console.log('🔍 SEO optimization initialized (delayed)');
          } catch (error) {
            console.error('❌ Delayed SEO initialization failed:', error);
          }
        } else {
          console.warn('⚠️ SEO Manager still not available after delay');
        }
      }, 500);
    }
  }

  async loadPortfolioDataWithRetry(maxRetries = 3) {
    // Check if portfolioData is available
    if (!window.portfolioData) {
      console.warn('⚠️ Portfolio data module not available, using fallback');
      this.initializeFallbackData();
      return;
    }
    
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        await window.portfolioData.loadData();
        console.log('✅ Portfolio data loaded successfully');
        return;
      } catch (error) {
        retries++;
        console.warn(`⚠️ Data loading attempt ${retries} failed:`, error.message);
        
        if (retries === maxRetries) {
          console.warn('⚠️ Using fallback data due to network issues');
          this.initializeFallbackData();
          return;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }
  }

  initializeFallbackData() {
    // Create a minimal fallback data structure
    window.portfolioData = {
      getData: () => ({
        personal: {
          name: 'Professional Portfolio',
          title: 'Cloud Engineer & Cybersecurity Professional',
          bio: 'Experienced professional specializing in cloud infrastructure, cybersecurity, and API development.',
          summary: 'Passionate about building secure, scalable cloud solutions and protecting digital assets.',
          contact: {
            email: 'contact@example.com',
            linkedin: 'https://linkedin.com/in/example',
            github: 'https://github.com/example'
          }
        },
        experience: [
          {
            id: 1,
            company: 'Tech Company',
            title: 'Senior Cloud Engineer',
            duration: '2020 - Present',
            achievements: [
              'Designed and implemented cloud infrastructure solutions',
              'Improved system security and performance',
              'Led cross-functional development teams'
            ]
          }
        ],
        projects: [
          {
            id: 1,
            title: 'Cloud Security Platform',
            description: 'Comprehensive security monitoring and threat detection system.',
            tools: ['AWS', 'Python', 'Docker', 'Kubernetes'],
            outcomes: ['Reduced security incidents by 60%', 'Improved response time by 40%']
          }
        ],
        skills: [
          {
            category: 'Cloud Platforms',
            skills: [
              { name: 'AWS', level: 'Expert' },
              { name: 'Azure', level: 'Advanced' },
              { name: 'Google Cloud', level: 'Intermediate' }
            ]
          },
          {
            category: 'Security',
            skills: [
              { name: 'Penetration Testing', level: 'Advanced' },
              { name: 'Threat Analysis', level: 'Expert' },
              { name: 'Compliance', level: 'Advanced' }
            ]
          }
        ]
      }),
      getPersonalInfo: function() { return this.getData().personal; },
      getExperience: function() { return this.getData().experience; },
      getProjects: function() { return this.getData().projects; },
      getSkills: function() { return this.getData().skills; },
      loadData: function() { return Promise.resolve(); }
    };
    
    console.log('📦 Fallback data initialized');
  }

  setupSmoothScrolling() {
    // Ensure smooth scrolling behavior is consistent across the app
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add custom smooth scrolling for better control
    const scrollToSection = (sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    };
    
    // Make scroll function globally available
    window.scrollToSection = scrollToSection;
  }

  populateAllSections() {
    console.log('📄 Populating all sections...');
    
    let successCount = 0;
    let errorCount = 0;
    
    this.components.forEach((component, name) => {
      try {
        if (!component.element) {
          console.warn(`⚠️ Element not found for ${name} section`);
          return;
        }
        
        component.populateMethod();
        component.populated = true;
        successCount++;
        
        console.log(`✅ ${name} section populated successfully`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error populating ${name} section:`, error);
        
        // Show error message using performance optimizer if available
        if (window.performanceOptimizer) {
          window.performanceOptimizer.showErrorMessage(
            new Error(`Failed to load ${name} section`)
          );
        }
        
        // Add error state to component
        if (component.element) {
          component.element.classList.add('section-error');
          component.element.innerHTML = `
            <div class="container">
              <div class="error-message">
                <h2>Unable to load ${name} section</h2>
                <p>Please refresh the page to try again.</p>
              </div>
            </div>
          `;
        }
      }
    });
    
    console.log(`📊 Section population complete: ${successCount} successful, ${errorCount} errors`);
  }

  initializeTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    this.setTheme(savedTheme);
  }

  initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Set initial icon
    this.updateThemeToggleIcon(themeToggle);

    // Add click event listener
    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add keyboard support
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Save preference
    localStorage.setItem('portfolio-theme', theme);
    
    // Update toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      this.updateThemeToggleIcon(themeToggle);
    }
    
    // Trigger theme change event for other components
    this.handleThemeChange(theme);
  }

  updateThemeToggleIcon(toggleButton) {
    const icon = toggleButton.querySelector('.theme-toggle-icon');
    if (!icon) return;

    if (this.currentTheme === 'dark') {
      icon.textContent = '☀️';
      toggleButton.setAttribute('aria-label', 'Switch to light mode');
      toggleButton.setAttribute('title', 'Switch to light mode');
      toggleButton.setAttribute('aria-pressed', 'true');
    } else {
      icon.textContent = '🌙';
      toggleButton.setAttribute('aria-label', 'Switch to dark mode');
      toggleButton.setAttribute('title', 'Switch to dark mode');
      toggleButton.setAttribute('aria-pressed', 'false');
    }
  }

  handleThemeChange(theme) {
    // Add smooth transition for theme changes
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Remove transition after animation completes
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
    
    // Update any theme-dependent components
    this.updateComponentsForTheme(theme);
  }

  updateComponentsForTheme(theme) {
    // Update navigation menu background for mobile
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      if (theme === 'dark') {
        navMenu.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
      } else {
        navMenu.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      }
    }
    
    // Update any other theme-dependent elements
    this.updateScrollIndicator(theme);
  }

  updateScrollIndicator(theme) {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      // Ensure scroll indicator is visible in both themes
      scrollIndicator.style.opacity = '0.7';
    }
  }

  populateHeroSection() {
    const personal = window.portfolioData.getPersonalInfo();
    
    const titleElement = document.getElementById('hero-title');
    const subtitleElement = document.getElementById('hero-subtitle');
    const contactElement = document.getElementById('hero-contact');
    
    if (titleElement) titleElement.textContent = personal.name || 'Your Name';
    if (subtitleElement) subtitleElement.textContent = personal.title || 'Professional Title';
    
    if (contactElement && personal.contact) {
      contactElement.innerHTML = this.createContactLinks(personal.contact);
    }
  }

  populateAboutSection() {
    const personal = window.portfolioData.getPersonalInfo();
    
    const headshotElement = document.getElementById('about-headshot');
    const bioElement = document.getElementById('about-bio');
    
    // Handle headshot with lazy loading and error handling
    if (headshotElement) {
      if (personal.headshot) {
        this.loadHeadshotImage(headshotElement, personal.headshot, personal.name);
      } else {
        // Hide image container if no headshot provided
        const imageContainer = headshotElement.closest('.about-image');
        if (imageContainer) {
          imageContainer.style.display = 'none';
        }
        // Adjust grid layout for text-only
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent) {
          aboutContent.style.gridTemplateColumns = '1fr';
        }
      }
    }
    
    // Handle bio text with proper formatting
    if (bioElement) {
      const bioText = personal.bio || 'Professional bio will be displayed here.';
      // Split bio into paragraphs if it contains line breaks
      const paragraphs = bioText.split('\n').filter(p => p.trim());
      
      if (paragraphs.length > 1) {
        bioElement.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
      } else {
        bioElement.innerHTML = `<p>${bioText}</p>`;
      }
    }
  }

  populateEducationSection() {
    const data = window.portfolioData.getData();
    const timelineElement = document.getElementById('education-timeline');
    
    if (!timelineElement) return;
    
    // Generate education timeline HTML
    if (data.education && data.education.length > 0) {
      timelineElement.innerHTML = data.education.map((edu, index) => `
        <div class="education-item animate-on-scroll">
          <div class="education-year">${this.escapeHtml(edu.duration)}</div>
          <div class="education-content">
            <h3 class="education-degree">${this.escapeHtml(edu.degree)}</h3>
            <div class="education-school">${this.escapeHtml(edu.institution)}</div>
            <div class="education-details">
              ${edu.specialization ? `<p>Specialization: ${this.escapeHtml(edu.specialization)}</p>` : ''}
              ${edu.cgpa ? `<p>CGPA: ${this.escapeHtml(edu.cgpa)}</p>` : ''}
              ${edu.status ? `<p>Status: ${this.escapeHtml(edu.status)}</p>` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }
    
    // Add certifications section after education
    if (data.certifications && data.certifications.length > 0) {
      const certificationsHTML = `
        <div class="certifications-section">
          <h3 class="certifications-title">Certifications</h3>
          <div class="certifications-grid">
            ${data.certifications.map(cert => `
              <div class="certification-item">
                <h4 class="certification-name">${this.escapeHtml(cert.name)}</h4>
                <p class="certification-issuer">${this.escapeHtml(cert.issuer)}</p>
                <p class="certification-year">${this.escapeHtml(cert.year)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      timelineElement.insertAdjacentHTML('afterend', certificationsHTML);
    }
  }

  loadHeadshotImage(imgElement, src, altName) {
    // Use performance optimizer if available
    if (window.performanceOptimizer) {
      // Get optimized image URL
      const optimizedSrc = window.performanceOptimizer.getOptimizedImageUrl(src, {
        width: imgElement.offsetWidth || 400,
        quality: 90
      });
      
      // Set data-src for lazy loading
      imgElement.setAttribute('data-src', optimizedSrc);
      imgElement.alt = `${altName} - Professional headshot`;
      
      // Let performance optimizer handle the loading
      window.performanceOptimizer.loadImage(imgElement);
      return;
    }
    
    // Fallback to original implementation
    imgElement.classList.add('loading');
    imgElement.alt = `Loading ${altName}'s professional headshot`;
    
    const testImg = new Image();
    
    testImg.onload = () => {
      imgElement.src = src;
      imgElement.alt = `${altName} - Professional headshot`;
      imgElement.classList.remove('loading');
      this.observeImageLoad(imgElement);
    };
    
    testImg.onerror = () => {
      imgElement.classList.remove('loading');
      imgElement.classList.add('error');
      imgElement.alt = `${altName} - Professional headshot (image unavailable)`;
      
      // Use fallback image if performance optimizer is available
      if (window.performanceOptimizer) {
        imgElement.src = window.performanceOptimizer.createFallbackImage(altName);
      } else {
        imgElement.removeAttribute('src');
      }
      console.warn(`Failed to load headshot image: ${src}`);
    };
    
    testImg.src = src;
  }

  observeImageLoad(imgElement) {
    // Create intersection observer for fade-in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'scale(0.95)';
          
          // Animate in
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    observer.observe(imgElement);
  }

  populateSummarySection() {
    const personal = window.portfolioData.getPersonalInfo();
    const summaryElement = document.getElementById('summary-text');
    
    if (summaryElement) {
      const summaryText = personal.summary || 'Professional summary will be displayed here.';
      
      // Apply keyword highlighting and formatting
      const formattedSummary = this.formatSummaryWithKeywords(summaryText);
      summaryElement.innerHTML = formattedSummary;
    }
  }

  formatSummaryWithKeywords(text) {
    // Define technical keywords to highlight (longer phrases first to avoid conflicts)
    const keywords = [
      'API development', 'threat analysis', 'business success',
      'Cloud', 'Cybersecurity', 'AI', 'API',
      'infrastructure', 'automation', 'security', 'scalable',
      'optimization'
    ];
    
    // Split text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    // Process each paragraph
    const formattedParagraphs = paragraphs.map(paragraph => {
      let formattedText = paragraph.trim();
      
      // Track already highlighted positions to avoid overlaps
      const highlightedRanges = [];
      
      // Highlight keywords (case-insensitive, longer phrases first)
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
        let match;
        
        // Find all matches for this keyword
        while ((match = regex.exec(formattedText)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          
          // Check if this range overlaps with any existing highlights
          const overlaps = highlightedRanges.some(range => 
            (start >= range.start && start < range.end) || 
            (end > range.start && end <= range.end) ||
            (start <= range.start && end >= range.end)
          );
          
          if (!overlaps) {
            highlightedRanges.push({ start, end, keyword: match[0] });
          }
          
          // Reset regex lastIndex to avoid infinite loop
          if (regex.lastIndex === match.index) {
            regex.lastIndex++;
          }
        }
      });
      
      // Sort ranges by start position (descending) to replace from end to beginning
      highlightedRanges.sort((a, b) => b.start - a.start);
      
      // Apply highlights
      highlightedRanges.forEach(range => {
        const before = formattedText.substring(0, range.start);
        const highlighted = `<span class="keyword-highlight">${range.keyword}</span>`;
        const after = formattedText.substring(range.end);
        formattedText = before + highlighted + after;
      });
      
      return `<p class="summary-paragraph">${formattedText}</p>`;
    });
    
    return formattedParagraphs.join('');
  }

  populateExperienceSection() {
    const experience = window.portfolioData.getExperience();
    const timelineElement = document.getElementById('experience-timeline');
    
    if (!timelineElement) return;
    
    // Generate timeline HTML with enhanced features
    timelineElement.innerHTML = experience.map((exp, index) => `
      <div class="timeline-item" data-experience-id="${exp.id}">
        <div class="timeline-card">
          <h3 class="timeline-company">${this.escapeHtml(exp.company)}</h3>
          <h4 class="timeline-title">${this.escapeHtml(exp.title)}</h4>
          <p class="timeline-duration">${this.escapeHtml(exp.duration)}</p>
          
          ${exp.achievements && exp.achievements.length > 0 ? `
            <button class="timeline-achievements-toggle" 
                    data-target="achievements-${exp.id}" 
                    aria-expanded="true"
                    aria-label="Toggle achievement details">
              View Achievements
            </button>
            <ul class="timeline-achievements" id="achievements-${exp.id}">
              ${exp.achievements.map(achievement => `<li>${this.escapeHtml(achievement)}</li>`).join('')}
            </ul>
          ` : ''}
          
          ${exp.technologies && exp.technologies.length > 0 ? `
            <div class="timeline-technologies">
              ${exp.technologies.map(tech => `<span class="timeline-tech-tag">${this.escapeHtml(tech)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
    
    // Initialize timeline interactions
    this.initializeTimelineInteractions();
    
    // Initialize scroll animations
    this.initializeTimelineAnimations();
  }

  initializeTimelineInteractions() {
    // Handle achievement toggle functionality
    const toggleButtons = document.querySelectorAll('.timeline-achievements-toggle');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('data-target');
        const achievementsList = document.getElementById(targetId);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        if (achievementsList) {
          // Toggle collapsed state
          if (isExpanded) {
            achievementsList.classList.add('collapsed');
            button.classList.add('collapsed');
            button.setAttribute('aria-expanded', 'false');
            button.textContent = 'Show Achievements';
            
            // Announce to screen readers
            this.announceToScreenReader('Achievements collapsed');
          } else {
            achievementsList.classList.remove('collapsed');
            button.classList.remove('collapsed');
            button.setAttribute('aria-expanded', 'true');
            button.textContent = 'Hide Achievements';
            
            // Announce to screen readers
            this.announceToScreenReader('Achievements expanded');
          }
          
          // Smooth animation
          this.animateAchievementsToggle(achievementsList, !isExpanded);
        }
      });
      
      // Add comprehensive keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
  }

  // Screen reader announcement utility
  announceToScreenReader(message) {
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

  animateAchievementsToggle(element, show) {
    if (show) {
      // Show achievements with stagger animation
      const items = element.querySelectorAll('li');
      items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          item.style.transition = 'all 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, index * 100);
      });
    } else {
      // Hide achievements
      const items = element.querySelectorAll('li');
      items.forEach((item) => {
        item.style.transition = 'all 0.2s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
      });
    }
  }

  initializeTimelineAnimations() {
    // Create intersection observer for timeline items
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered animation delay
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 200);
          
          // Unobserve after animation
          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '50px'
    });
    
    // Observe all timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });
  }

  // Utility method for HTML escaping
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  populateProjectsSection() {
    const projects = window.portfolioData.getProjects();
    const projectsSection = document.getElementById('projects');
    
    if (!projectsSection) return;
    
    // Create projects component with filter functionality
    this.createProjectsComponent(projectsSection, projects);
  }

  createProjectsComponent(container, projects) {
    // Get all unique technologies for filter
    const allTechnologies = [...new Set(projects.flatMap(project => project.tools))].sort();
    
    // Create the projects HTML structure
    const projectsHTML = `
      <div class="container">
        <h2 class="section-title">Projects</h2>
        
        <!-- Filter Controls -->
        <div class="projects-filter">
          <button class="filter-btn active" data-filter="all">All Projects</button>
          ${allTechnologies.map(tech => 
            `<button class="filter-btn" data-filter="${this.escapeHtml(tech)}">${this.escapeHtml(tech)}</button>`
          ).join('')}
        </div>
        
        <!-- Projects Grid -->
        <div class="projects-grid" id="projects-grid">
          ${projects.map(project => this.createProjectCard(project)).join('')}
        </div>
      </div>
    `;
    
    container.innerHTML = projectsHTML;
    
    // Initialize project interactions
    this.initializeProjectsInteractions();
    this.initializeProjectImageLazyLoading();
  }

  createProjectCard(project) {
    return `
      <article class="project-card" 
               data-technologies="${project.tools.join(',').toLowerCase()}"
               role="article"
               aria-labelledby="project-title-${project.id}"
               tabindex="0">
        <div class="project-image-container">
          ${project.images && project.images[0] ? `
            <img 
              data-src="${project.images[0]}" 
              alt="Screenshot of ${this.escapeHtml(project.title)} project showing the main interface" 
              class="project-image lazy-load"
              loading="lazy"
            >
            <div class="project-image-placeholder" aria-hidden="true">
              <div class="placeholder-icon">📁</div>
              <div class="placeholder-text">Loading...</div>
            </div>
          ` : `
            <div class="project-image project-image-fallback" role="img" aria-label="Project placeholder image">
              <div class="fallback-icon" aria-hidden="true">💻</div>
              <div class="fallback-text" aria-hidden="true">Project</div>
            </div>
          `}
          <div class="project-overlay" aria-hidden="true">
            <div class="project-overlay-content">
              <h4>View Details</h4>
              <p>Click to explore</p>
            </div>
          </div>
        </div>
        
        <div class="project-content">
          <h3 class="project-title" id="project-title-${project.id}">${this.escapeHtml(project.title)}</h3>
          <p class="project-description">${this.escapeHtml(project.description)}</p>
          
          <div class="project-tools" role="list" aria-label="Technologies used">
            ${project.tools.map(tool => 
              `<span class="tool-tag" 
                     role="listitem"
                     data-tech="${this.escapeHtml(tool).toLowerCase()}"
                     aria-label="Technology: ${this.escapeHtml(tool)}">${this.escapeHtml(tool)}</span>`
            ).join('')}
          </div>
          
          ${project.outcomes && project.outcomes.length > 0 ? `
            <div class="project-outcomes">
              <h4 class="outcomes-title">Key Outcomes</h4>
              <ul class="outcomes-list" role="list">
                ${project.outcomes.map(outcome => `<li role="listitem">${this.escapeHtml(outcome)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${project.links && project.links.length > 0 ? `
            <div class="project-links" role="list" aria-label="Project links">
              ${project.links.map(link => `
                <a href="${link.url}" 
                   class="project-link" 
                   role="listitem"
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Open ${this.escapeHtml(link.name)} for ${this.escapeHtml(project.title)} (opens in new tab)">
                  ${this.escapeHtml(link.name)}
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  initializeProjectsInteractions() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        this.filterProjects(filterValue, projectCards);
      });
    });
    
    // Project card interactions
    projectCards.forEach(card => {
      // Add hover effects and click handling
      card.addEventListener('mouseenter', () => {
        this.handleProjectCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.handleProjectCardHover(card, false);
      });
      
      // Technology tag click filtering
      const techTags = card.querySelectorAll('.tool-tag');
      techTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
          e.stopPropagation();
          const tech = tag.getAttribute('data-tech');
          this.filterProjectsByTechnology(tech, filterButtons, projectCards);
        });
      });
    });
    
    // Initialize scroll animations
    this.initializeProjectScrollAnimations();
  }

  filterProjects(filterValue, projectCards) {
    projectCards.forEach((card, index) => {
      const technologies = card.getAttribute('data-technologies');
      const shouldShow = filterValue === 'all' || 
                        technologies.includes(filterValue.toLowerCase());
      
      if (shouldShow) {
        card.style.display = 'block';
        // Staggered animation for showing cards
        setTimeout(() => {
          card.classList.add('filter-show');
          card.classList.remove('filter-hide');
        }, index * 100);
      } else {
        card.classList.add('filter-hide');
        card.classList.remove('filter-show');
        // Hide after animation
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Update results count
    this.updateProjectsCount(filterValue, projectCards);
  }

  filterProjectsByTechnology(tech, filterButtons, projectCards) {
    // Find and activate the corresponding filter button
    const targetButton = Array.from(filterButtons).find(btn => 
      btn.getAttribute('data-filter').toLowerCase() === tech
    );
    
    if (targetButton) {
      targetButton.click();
    }
  }

  updateProjectsCount(filterValue, projectCards) {
    const visibleCount = Array.from(projectCards).filter(card => 
      card.style.display !== 'none'
    ).length;
    
    // Update or create count display
    let countElement = document.querySelector('.projects-count');
    if (!countElement) {
      countElement = document.createElement('div');
      countElement.className = 'projects-count';
      const filterContainer = document.querySelector('.projects-filter');
      if (filterContainer) {
        filterContainer.appendChild(countElement);
      }
    }
    
    const filterText = filterValue === 'all' ? 'All Projects' : filterValue;
    countElement.textContent = `${visibleCount} project${visibleCount !== 1 ? 's' : ''} ${filterValue !== 'all' ? `with ${filterText}` : ''}`;
  }

  handleProjectCardHover(card, isHovering) {
    const overlay = card.querySelector('.project-overlay');
    const image = card.querySelector('.project-image');
    
    if (overlay) {
      if (isHovering) {
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateY(0)';
      } else {
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateY(20px)';
      }
    }
    
    if (image && !image.classList.contains('project-image-fallback')) {
      if (isHovering) {
        image.style.transform = 'scale(1.05)';
      } else {
        image.style.transform = 'scale(1)';
      }
    }
  }

  initializeProjectImageLazyLoading() {
    // Create intersection observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadProjectImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    // Observe all lazy load images
    const lazyImages = document.querySelectorAll('.project-image.lazy-load');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadProjectImage(imgElement) {
    // Use performance optimizer if available
    if (window.performanceOptimizer) {
      window.performanceOptimizer.loadImage(imgElement);
      return;
    }
    
    // Fallback to original implementation
    const src = imgElement.getAttribute('data-src');
    const placeholder = imgElement.parentElement.querySelector('.project-image-placeholder');
    
    if (!src) return;
    
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
    
    const testImg = new Image();
    
    testImg.onload = () => {
      imgElement.src = src;
      imgElement.classList.remove('lazy-load');
      imgElement.classList.add('loaded');
      
      if (placeholder) {
        placeholder.style.opacity = '0';
        setTimeout(() => {
          placeholder.style.display = 'none';
        }, 300);
      }
      
      imgElement.style.opacity = '0';
      imgElement.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        imgElement.style.opacity = '1';
      }, 100);
    };
    
    testImg.onerror = () => {
      imgElement.classList.remove('lazy-load');
      imgElement.classList.add('error');
      
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="placeholder-icon">❌</div>
          <div class="placeholder-text">Failed to load</div>
        `;
        placeholder.style.backgroundColor = 'var(--color-gray-200)';
      }
      
      console.warn(`Failed to load project image: ${src}`);
    };
    
    testImg.src = src;
  }

  initializeProjectScrollAnimations() {
    // Create intersection observer for project cards
    const projectObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered animation
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 150);
          
          projectObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '30px'
    });
    
    // Observe all project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      projectObserver.observe(card);
    });
  }

  populateSkillsSection() {
    const skills = window.portfolioData.getSkills();
    const skillsSection = document.getElementById('skills');
    
    if (!skillsSection) return;
    
    // Create enhanced skills component with search and filtering
    this.createSkillsComponent(skillsSection, skills);
  }

  createSkillsComponent(container, skillsData) {
    // Get all skills for search functionality
    const allSkills = skillsData.flatMap(category => 
      category.skills.map(skill => ({
        ...skill,
        category: category.category
      }))
    );
    
    // Create the skills HTML structure
    const skillsHTML = `
      <div class="container">
        <h2 class="section-title">Skills & Expertise</h2>
        
        <!-- Skills Search and Filter -->
        <div class="skills-controls">
          <div class="skills-search-container">
            <input 
              type="text" 
              id="skills-search" 
              class="skills-search" 
              placeholder="Search skills..."
              aria-label="Search skills"
            >
            <div class="search-icon">🔍</div>
          </div>
          
          <div class="skills-filter">
            <button class="skills-filter-btn active" data-category="all">All Skills</button>
            ${skillsData.map(category => 
              `<button class="skills-filter-btn" data-category="${this.escapeHtml(category.category)}">${this.escapeHtml(category.category)}</button>`
            ).join('')}
          </div>
        </div>
        
        <!-- Skills Categories Grid -->
        <div class="skills-grid" id="skills-grid">
          ${skillsData.map(category => this.createSkillCategory(category)).join('')}
        </div>
        
        <!-- Skills Summary -->
        <div class="skills-summary" id="skills-summary">
          <p class="skills-count">Showing ${allSkills.length} skills across ${skillsData.length} categories</p>
        </div>
      </div>
    `;
    
    container.innerHTML = skillsHTML;
    
    // Initialize skills interactions
    this.initializeSkillsInteractions(allSkills);
    this.initializeSkillsAnimations();
  }

  createSkillCategory(category) {
    return `
      <div class="skill-category" data-category="${this.escapeHtml(category.category)}">
        <div class="skill-category-header">
          <h3 class="skill-category-title">
            <span class="category-icon">${this.getCategoryIcon(category.category)}</span>
            ${this.escapeHtml(category.category)}
          </h3>
          <button class="category-toggle" 
                  data-target="skills-${category.category.replace(/\s+/g, '-').toLowerCase()}"
                  aria-expanded="true"
                  aria-label="Toggle ${category.category} skills">
            <span class="toggle-icon">▼</span>
          </button>
        </div>
        
        <div class="skills-list" id="skills-${category.category.replace(/\s+/g, '-').toLowerCase()}">
          ${category.skills.map(skill => this.createSkillItem(skill, category.category)).join('')}
        </div>
        
        <div class="category-summary">
          <span class="skills-count">${category.skills.length} skill${category.skills.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    `;
  }

  createSkillItem(skill, categoryName) {
    const proficiencyLevel = skill.proficiency || 'intermediate';
    const proficiencyClass = `proficiency-${proficiencyLevel}`;
    
    return `
      <div class="skill-item ${proficiencyClass}" 
           data-skill="${this.escapeHtml(skill.name).toLowerCase()}"
           data-category="${this.escapeHtml(categoryName).toLowerCase()}"
           data-proficiency="${proficiencyLevel}"
           title="${skill.name}${skill.proficiency ? ` - ${skill.proficiency} level` : ''}">
        
        <div class="skill-content">
          <span class="skill-name">${this.escapeHtml(skill.name)}</span>
          ${skill.proficiency ? `
            <div class="skill-proficiency">
              <span class="proficiency-label">${this.escapeHtml(skill.proficiency)}</span>
              <div class="proficiency-bar">
                <div class="proficiency-fill" data-level="${proficiencyLevel}"></div>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="skill-details" style="display: none;">
          <p class="skill-description">
            ${this.getSkillDescription(skill.name, categoryName)}
          </p>
          <div class="skill-meta">
            <span class="skill-category-tag">${this.escapeHtml(categoryName)}</span>
            ${skill.proficiency ? `<span class="skill-level-tag">${this.escapeHtml(skill.proficiency)}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  getCategoryIcon(category) {
    const iconMap = {
      'Cloud Platforms': '☁️',
      'Cloud': '☁️',
      'Cybersecurity': '🔒',
      'Security': '🔒',
      'Programming': '💻',
      'Tools & Technologies': '🛠️',
      'Tools': '🛠️',
      'Design': '🎨',
      'Database': '🗄️',
      'DevOps': '⚙️',
      'AI/ML': '🤖',
      'Mobile': '📱',
      'Web': '🌐'
    };
    
    return iconMap[category] || '📋';
  }

  getSkillDescription(skillName, category) {
    // Generate contextual descriptions based on skill and category
    const descriptions = {
      'AWS': 'Amazon Web Services - Cloud computing platform with extensive experience in EC2, S3, Lambda, and more.',
      'Azure': 'Microsoft Azure cloud platform - Experience with virtual machines, storage, and cloud services.',
      'Docker': 'Containerization technology for application deployment and development environments.',
      'Kubernetes': 'Container orchestration platform for managing scalable applications.',
      'Python': 'Versatile programming language used for automation, web development, and data analysis.',
      'JavaScript': 'Dynamic programming language for web development and modern applications.',
      'React': 'Modern JavaScript library for building user interfaces and web applications.',
      'Security Auditing': 'Comprehensive security assessments and vulnerability analysis.',
      'Penetration Testing': 'Ethical hacking and security testing methodologies.',
      'SIEM': 'Security Information and Event Management systems for threat detection.',
      'Terraform': 'Infrastructure as Code tool for cloud resource management.',
      'Git': 'Version control system for collaborative software development.',
      'CI/CD': 'Continuous Integration and Deployment practices for automated software delivery.'
    };
    
    return descriptions[skillName] || `Professional experience with ${skillName} in ${category.toLowerCase()} contexts.`;
  }

  initializeSkillsInteractions(allSkills) {
    // Search functionality
    const searchInput = document.getElementById('skills-search');
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSkillsSearch(e.target.value, allSkills);
        }, 300);
      });
      
      // Clear search on escape
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.target.value = '';
          this.handleSkillsSearch('', allSkills);
          e.target.blur();
        }
      });
    }
    
    // Category filter functionality
    const filterButtons = document.querySelectorAll('.skills-filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active filter
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        this.handleSkillsFilter(category);
      });
    });
    
    // Category toggle functionality
    const toggleButtons = document.querySelectorAll('.category-toggle');
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCategoryToggle(button);
      });
    });
    
    // Skill item interactions
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
      // Click to show/hide details
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSkillItemClick(item);
      });
      
      // Keyboard support
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleSkillItemClick(item);
        }
      });
      
      // Make focusable
      item.setAttribute('tabindex', '0');
    });
  }

  handleSkillsSearch(query, allSkills) {
    const searchTerm = query.toLowerCase().trim();
    const skillItems = document.querySelectorAll('.skill-item');
    const categories = document.querySelectorAll('.skill-category');
    
    let visibleSkillsCount = 0;
    let visibleCategoriesCount = 0;
    
    if (!searchTerm) {
      // Show all skills and categories
      skillItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('search-highlight');
      });
      categories.forEach(category => {
        category.style.display = 'block';
      });
      visibleSkillsCount = allSkills.length;
      visibleCategoriesCount = categories.length;
    } else {
      // Filter skills based on search
      categories.forEach(category => {
        const categorySkills = category.querySelectorAll('.skill-item');
        let categoryHasVisibleSkills = false;
        
        categorySkills.forEach(item => {
          const skillName = item.getAttribute('data-skill');
          const categoryName = item.getAttribute('data-category');
          
          if (skillName.includes(searchTerm) || categoryName.includes(searchTerm)) {
            item.style.display = 'block';
            item.classList.add('search-highlight');
            categoryHasVisibleSkills = true;
            visibleSkillsCount++;
          } else {
            item.style.display = 'none';
            item.classList.remove('search-highlight');
          }
        });
        
        // Show/hide category based on whether it has visible skills
        if (categoryHasVisibleSkills) {
          category.style.display = 'block';
          visibleCategoriesCount++;
        } else {
          category.style.display = 'none';
        }
      });
    }
    
    // Update summary
    this.updateSkillsSummary(visibleSkillsCount, visibleCategoriesCount, searchTerm);
  }

  handleSkillsFilter(categoryFilter) {
    const categories = document.querySelectorAll('.skill-category');
    let visibleSkillsCount = 0;
    let visibleCategoriesCount = 0;
    
    categories.forEach(category => {
      const categoryName = category.getAttribute('data-category');
      
      if (categoryFilter === 'all' || categoryName === categoryFilter) {
        category.style.display = 'block';
        visibleCategoriesCount++;
        
        // Count visible skills in this category
        const visibleSkills = category.querySelectorAll('.skill-item[style*="display: block"], .skill-item:not([style*="display: none"])');
        visibleSkillsCount += visibleSkills.length;
      } else {
        category.style.display = 'none';
      }
    });
    
    // Update summary
    this.updateSkillsSummary(visibleSkillsCount, visibleCategoriesCount, '', categoryFilter);
  }

  handleCategoryToggle(button) {
    const targetId = button.getAttribute('data-target');
    const skillsList = document.getElementById(targetId);
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const toggleIcon = button.querySelector('.toggle-icon');
    
    if (skillsList) {
      if (isExpanded) {
        // Collapse
        skillsList.style.maxHeight = '0';
        skillsList.style.opacity = '0.5';
        button.setAttribute('aria-expanded', 'false');
        toggleIcon.textContent = '▶';
        button.classList.add('collapsed');
      } else {
        // Expand
        skillsList.style.maxHeight = 'none';
        skillsList.style.opacity = '1';
        button.setAttribute('aria-expanded', 'true');
        toggleIcon.textContent = '▼';
        button.classList.remove('collapsed');
        
        // Animate skills in
        this.animateSkillsIn(skillsList);
      }
    }
  }

  handleSkillItemClick(skillItem) {
    const details = skillItem.querySelector('.skill-details');
    const isExpanded = details.style.display !== 'none';
    
    // Close all other expanded skills first
    const allSkillItems = document.querySelectorAll('.skill-item');
    allSkillItems.forEach(item => {
      if (item !== skillItem) {
        const otherDetails = item.querySelector('.skill-details');
        if (otherDetails) {
          otherDetails.style.display = 'none';
          item.classList.remove('expanded');
        }
      }
    });
    
    // Toggle current skill
    if (isExpanded) {
      details.style.display = 'none';
      skillItem.classList.remove('expanded');
    } else {
      details.style.display = 'block';
      skillItem.classList.add('expanded');
      
      // Animate in the details
      details.style.opacity = '0';
      details.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        details.style.transition = 'all 0.3s ease';
        details.style.opacity = '1';
        details.style.transform = 'translateY(0)';
      }, 10);
    }
  }

  animateSkillsIn(skillsList) {
    const skills = skillsList.querySelectorAll('.skill-item');
    skills.forEach((skill, index) => {
      skill.style.opacity = '0';
      skill.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        skill.style.transition = 'all 0.3s ease';
        skill.style.opacity = '1';
        skill.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  updateSkillsSummary(skillsCount, categoriesCount, searchTerm = '', filterCategory = '') {
    const summaryElement = document.getElementById('skills-summary');
    if (!summaryElement) return;
    
    let summaryText = `Showing ${skillsCount} skill${skillsCount !== 1 ? 's' : ''}`;
    
    if (categoriesCount > 0) {
      summaryText += ` across ${categoriesCount} categor${categoriesCount !== 1 ? 'ies' : 'y'}`;
    }
    
    if (searchTerm) {
      summaryText += ` matching "${searchTerm}"`;
    } else if (filterCategory && filterCategory !== 'all') {
      summaryText += ` in ${filterCategory}`;
    }
    
    const countElement = summaryElement.querySelector('.skills-count');
    if (countElement) {
      countElement.textContent = summaryText;
    }
  }

  initializeSkillsAnimations() {
    // Create intersection observer for skills categories
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered animation for categories
          setTimeout(() => {
            entry.target.classList.add('animate-in');
            
            // Animate skills within the category
            const skills = entry.target.querySelectorAll('.skill-item');
            skills.forEach((skill, skillIndex) => {
              setTimeout(() => {
                skill.classList.add('animate-in');
              }, skillIndex * 100);
            });
          }, index * 200);
          
          skillsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '50px'
    });
    
    // Observe all skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
      skillsObserver.observe(category);
    });
  }

  populateContactSection() {
    const personal = window.portfolioData.getPersonalInfo();
    const contactSection = document.getElementById('contact');
    
    if (!contactSection) return;
    
    // Create enhanced contact component
    this.createContactComponent(contactSection, personal);
  }

  createContactComponent(container, personal) {
    const contactHTML = `
      <div class="container">
        <!-- Left Column - Title -->
        <div class="contact-title-section">
          <h2 class="section-title">Contact</h2>
        </div>
        
        <!-- Vertical Divider -->
        <div class="contact-divider"></div>
        
        <!-- Right Column - Content -->
        <div class="contact-content-section">
          <div class="contact-info">
            <div class="contact-label">Get in Touch</div>
            <p class="contact-message">Let's work together</p>
            <p class="contact-subtitle">
              Available for freelance projects, collaborations, 
              and full-time opportunities in cloud engineering and cybersecurity.
            </p>
          </div>
          
          <div class="contact-links" id="contact-links">
            ${this.createContactLinks(personal.contact)}
          </div>
          
          <div class="contact-meta">
            <div class="contact-availability">
              <div class="availability-dot"></div>
              <span class="availability-text">Available for work</span>
            </div>
            <p class="contact-note">
              Based in [Location]. Open to remote work and travel for the right projects.
            </p>
          </div>
        </div>
      </div>
      
      <div class="contact-footer">
        © ${new Date().getFullYear()} ${personal.name || 'Portfolio'}
      </div>
    `;
    
    container.innerHTML = contactHTML;
    
    // Initialize contact interactions
    this.initializeContactInteractions();
  }

  createContactLinks(contact) {
    const links = [];
    
    if (contact.email) {
      links.push(`
        <a href="mailto:${contact.email}" 
           class="contact-link" 
           aria-label="Send email to ${contact.email}"
           data-contact-type="email">
          <span class="contact-icon" aria-hidden="true">→</span>
          <span class="contact-text">${contact.email}</span>
        </a>
      `);
    }
    
    if (contact.linkedin) {
      links.push(`
        <a href="${contact.linkedin}" 
           class="contact-link" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Visit LinkedIn profile (opens in new tab)"
           data-contact-type="linkedin">
          <span class="contact-icon" aria-hidden="true">→</span>
          <span class="contact-text">LinkedIn</span>
        </a>
      `);
    }
    
    if (contact.github) {
      links.push(`
        <a href="${contact.github}" 
           class="contact-link" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Visit GitHub profile (opens in new tab)"
           data-contact-type="github">
          <span class="contact-icon" aria-hidden="true">→</span>
          <span class="contact-text">GitHub</span>
        </a>
      `);
    }
    
    if (contact.behance) {
      links.push(`
        <a href="${contact.behance}" 
           class="contact-link" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Visit Behance portfolio (opens in new tab)"
           data-contact-type="behance">
          <span class="contact-icon" aria-hidden="true">→</span>
          <span class="contact-text">Behance</span>
        </a>
      `);
    }
    
    return links.join('');
  }

  initializeContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      // Enhanced hover effects
      link.addEventListener('mouseenter', () => {
        this.handleContactLinkHover(link, true);
      });
      
      link.addEventListener('mouseleave', () => {
        this.handleContactLinkHover(link, false);
      });
      
      // Click tracking for analytics (if needed)
      link.addEventListener('click', (e) => {
        const contactType = link.getAttribute('data-contact-type');
        this.trackContactInteraction(contactType);
      });
      
      // Keyboard accessibility
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
    
    // Initialize scroll animations for contact section
    this.initializeContactAnimations();
  }

  handleContactLinkHover(link, isHovering) {
    const icon = link.querySelector('.contact-icon');
    const text = link.querySelector('.contact-text');
    
    if (isHovering) {
      // Add hover state classes for additional effects
      link.classList.add('hovered');
      
      // Animate icon and text
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
      }
      if (text) {
        text.style.transform = 'translateX(2px)';
      }
    } else {
      // Remove hover state
      link.classList.remove('hovered');
      
      // Reset animations
      if (icon) {
        icon.style.transform = '';
      }
      if (text) {
        text.style.transform = '';
      }
    }
  }

  trackContactInteraction(contactType) {
    // Log interaction for analytics (can be extended with actual analytics)
    console.log(`Contact interaction: ${contactType}`);
    
    // Could integrate with Google Analytics, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'contact_click', {
        'contact_method': contactType,
        'event_category': 'engagement'
      });
    }
  }

  initializeContactAnimations() {
    // Create intersection observer for contact section animations
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate contact elements with stagger
          this.animateContactElements();
          contactObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '50px'
    });
    
    // Observe contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactObserver.observe(contactSection);
    }
  }

  animateContactElements() {
    // Animate contact links with stagger
    const contactLinks = document.querySelectorAll('.contact-link');
    const contactMessage = document.querySelector('.contact-message');
    const contactSubtitle = document.querySelector('.contact-subtitle');
    const contactCta = document.querySelector('.contact-cta');
    
    // Animate message and subtitle first
    if (contactMessage) {
      contactMessage.style.opacity = '0';
      contactMessage.style.transform = 'translateY(30px)';
      setTimeout(() => {
        contactMessage.style.transition = 'all 0.6s ease';
        contactMessage.style.opacity = '1';
        contactMessage.style.transform = 'translateY(0)';
      }, 200);
    }
    
    if (contactSubtitle) {
      contactSubtitle.style.opacity = '0';
      contactSubtitle.style.transform = 'translateY(30px)';
      setTimeout(() => {
        contactSubtitle.style.transition = 'all 0.6s ease';
        contactSubtitle.style.opacity = '1';
        contactSubtitle.style.transform = 'translateY(0)';
      }, 400);
    }
    
    // Animate contact links with stagger
    contactLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(40px) scale(0.9)';
      
      setTimeout(() => {
        link.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        link.style.opacity = '1';
        link.style.transform = 'translateY(0) scale(1)';
      }, 600 + (index * 150));
    });
    
    // Animate CTA section last
    if (contactCta) {
      contactCta.style.opacity = '0';
      contactCta.style.transform = 'translateY(30px)';
      setTimeout(() => {
        contactCta.style.transition = 'all 0.6s ease';
        contactCta.style.opacity = '1';
        contactCta.style.transform = 'translateY(0)';
      }, 1200);
    }
  }

  handleLoadComplete() {
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
    document.body.classList.add('app-loaded');
    
    // Initialize any post-load enhancements
    this.initializePostLoadFeatures();
    
    // Dispatch custom event for other components
    const loadEvent = new CustomEvent('portfolioLoaded', {
      detail: {
        app: this,
        components: Array.from(this.components.keys()),
        loadTime: Date.now()
      }
    });
    document.dispatchEvent(loadEvent);
    
    console.log('🎉 Portfolio load complete');
  }

  initializePostLoadFeatures() {
    // Add intersection observers for animations
    if (this.animations && typeof this.animations.initializeScrollAnimations === 'function') {
      this.animations.initializeScrollAnimations();
    }
    
    // Initialize lazy loading for images
    if (this.performance && typeof this.performance.initLazyLoading === 'function') {
      this.performance.initLazyLoading();
    }
    
    // Add consistent spacing and flow between sections
    this.optimizeSectionSpacing();
  }

  optimizeSectionSpacing() {
    // Ensure consistent spacing between all sections
    this.components.forEach((component, name) => {
      if (component.element && component.populated) {
        // Add consistent section spacing class
        component.element.classList.add('section-optimized');
        
        // Ensure proper ARIA landmarks
        if (!component.element.getAttribute('aria-labelledby')) {
          const titleElement = component.element.querySelector('.section-title');
          if (titleElement && titleElement.id) {
            component.element.setAttribute('aria-labelledby', titleElement.id);
          }
        }
      }
    });
  }

  // Public API methods for external access
  getComponent(name) {
    return this.components.get(name);
  }

  getAllComponents() {
    return Array.from(this.components.entries()).map(([name, component]) => ({
      name,
      element: component.element,
      populated: component.populated,
      isVisible: component.element ? this.isElementVisible(component.element) : false
    }));
  }

  isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  refreshComponent(name) {
    const component = this.components.get(name);
    if (component && component.populateMethod) {
      try {
        component.populateMethod();
        component.populated = true;
        console.log(`🔄 ${name} component refreshed`);
        return true;
      } catch (error) {
        console.error(`❌ Error refreshing ${name} component:`, error);
        return false;
      }
    }
    return false;
  }

  refreshAllComponents() {
    console.log('🔄 Refreshing all components...');
    this.populateAllSections();
  }

  handleLoadError(error) {
    // Use performance optimizer error handling if available
    if (window.performanceOptimizer) {
      window.performanceOptimizer.showErrorMessage(error);
    } else {
      // Fallback error display
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.innerHTML = `
        <p>There was an error loading the portfolio data. Please refresh the page to try again.</p>
      `;
      document.body.insertBefore(errorMessage, document.body.firstChild);
    }
    
    // Show fallback content
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) {
      heroTitle.textContent = 'Portfolio Temporarily Unavailable';
    }
    
    if (heroSubtitle) {
      heroSubtitle.textContent = 'Please try refreshing the page or check back later.';
    }
    
    // Hide loading states
    document.querySelectorAll('.loading').forEach(element => {
      element.classList.remove('loading');
    });
    
    // Log error for monitoring
    if (window.performanceOptimizer) {
      window.performanceOptimizer.logError(error, {
        component: 'PortfolioApp',
        method: 'init'
      });
    }
  }

  // Utility method to update data dynamically
  updateSection(sectionName) {
    switch (sectionName) {
      case 'hero':
        this.populateHeroSection();
        break;
      case 'about':
        this.populateAboutSection();
        break;
      case 'summary':
        this.populateSummarySection();
        break;
      case 'experience':
        this.populateExperienceSection();
        break;
      case 'projects':
        this.populateProjectsSection();
        break;
      case 'skills':
        this.populateSkillsSection();
        break;
      case 'contact':
        this.populateContactSection();
        break;
      default:
        console.warn(`Unknown section: ${sectionName}`);
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new App();
  
  // Make app globally accessible for testing and debugging
  window.App = App;
  
  console.log('🎯 Portfolio App instance created and available globally');
});

// Handle any errors globally
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});  creat
eContactLinks(contact) {
    if (!contact) return '';
    
    const links = [];
    
    if (contact.email) {
      links.push(`<a href="mailto:${contact.email}" class="contact-link">
        <span class="contact-icon">📧</span>
        Email
      </a>`);
    }
    
    if (contact.linkedin) {
      links.push(`<a href="${contact.linkedin}" class="contact-link" target="_blank" rel="noopener noreferrer">
        <span class="contact-icon">💼</span>
        LinkedIn
      </a>`);
    }
    
    if (contact.github) {
      links.push(`<a href="${contact.github}" class="contact-link" target="_blank" rel="noopener noreferrer">
        <span class="contact-icon">💻</span>
        GitHub
      </a>`);
    }
    
    return links.join('');
  }

  initializeProjectsInteractions() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        projectCards.forEach(card => {
          const technologies = card.getAttribute('data-technologies');
          
          if (filter === 'all' || technologies.includes(filter.toLowerCase())) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  initializeProjectImageLazyLoading() {
    const images = document.querySelectorAll('.project-image[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const placeholder = img.parentElement.querySelector('.project-image-placeholder');
          
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          
          img.onload = () => {
            img.classList.add('loaded');
            if (placeholder) placeholder.style.display = 'none';
          };
          
          img.onerror = () => {
            if (placeholder) {
              placeholder.innerHTML = `
                <div class="fallback-icon">❌</div>
                <div class="fallback-text">Failed to load</div>
              `;
            }
          };
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  populateSkillsSection() {
    const skills = window.portfolioData.getSkills();
    const skillsElement = document.getElementById('skills-categories');
    
    if (!skillsElement) return;
    
    skillsElement.innerHTML = skills.map(category => `
      <div class="skill-category">
        <h3 class="skill-category-title">${this.escapeHtml(category.category)}</h3>
        <ul class="skill-list">
          ${category.skills.map(skill => `
            <li class="skill-item">
              <span class="skill-name">${this.escapeHtml(skill.name)}</span>
              <span class="skill-level">${this.escapeHtml(skill.level)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  populateContactSection() {
    const personal = window.portfolioData.getPersonalInfo();
    const contactLinksElement = document.getElementById('contact-links');
    
    if (contactLinksElement && personal.contact) {
      contactLinksElement.innerHTML = this.createContactLinks(personal.contact);
    }
  }

  handleLoadComplete() {
    // Add loaded class to body for CSS animations
    document.body.classList.add('app-loaded');
    
    // Initialize scroll animations
    this.initializeScrollAnimations();
    
    // Announce to screen readers
    this.announceToScreenReader('Portfolio loaded successfully');
    
    console.log('🎉 Portfolio app fully loaded and ready');
  }

  handleLoadError(error) {
    console.error('Portfolio initialization error:', error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <h3>Loading Error</h3>
      <p>Some content may not display correctly. Please refresh the page.</p>
      <button onclick="location.reload()">Refresh Page</button>
    `;
    
    document.body.appendChild(errorMessage);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.remove();
      }
    }, 10000);
  }

  initializeScrollAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new App();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (window.portfolioApp && window.performanceOptimizer) {
    if (document.hidden) {
      window.performanceOptimizer.pauseAnimations();
    } else {
      window.performanceOptimizer.resumeAnimations();
    }
  }
});
// Ma
ke App class globally available
window.App = App;