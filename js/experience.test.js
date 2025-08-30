/**
 * Experience Timeline Component Tests
 * Tests for rendering, interactions, and animations
 */

// Mock portfolio data for testing
const mockExperienceData = [
  {
    id: 'exp1',
    company: 'Tech Solutions Inc.',
    title: 'Senior Cloud Engineer',
    duration: '2022 - Present',
    achievements: [
      'Led cloud migration projects reducing infrastructure costs by 30%',
      'Implemented comprehensive security frameworks across multi-cloud environments',
      'Mentored junior developers on cloud technologies and best practices'
    ],
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform']
  },
  {
    id: 'exp2',
    company: 'CyberSecure Corp',
    title: 'Cybersecurity Analyst',
    duration: '2020 - 2022',
    achievements: [
      'Conducted security audits and penetration testing for enterprise clients',
      'Developed incident response procedures reducing response time by 40%'
    ],
    technologies: ['SIEM', 'Nessus', 'Wireshark', 'Python', 'Linux']
  }
];

// Test suite for Experience Timeline Component
describe('Experience Timeline Component', () => {
  let portfolioApp;
  let timelineElement;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <section class="section experience" id="experience">
        <div class="container">
          <h2 class="section-title">Experience</h2>
          <div class="timeline" id="experience-timeline">
            <!-- Experience items will be populated by JavaScript -->
          </div>
        </div>
      </section>
    `;

    // Mock window.portfolioData
    window.portfolioData = {
      getExperience: () => mockExperienceData
    };

    // Create portfolio app instance
    portfolioApp = {
      populateExperienceSection: window.PortfolioApp.prototype.populateExperienceSection,
      initializeTimelineInteractions: window.PortfolioApp.prototype.initializeTimelineInteractions,
      initializeTimelineAnimations: window.PortfolioApp.prototype.initializeTimelineAnimations,
      animateAchievementsToggle: window.PortfolioApp.prototype.animateAchievementsToggle,
      escapeHtml: window.PortfolioApp.prototype.escapeHtml
    };

    timelineElement = document.getElementById('experience-timeline');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.portfolioData;
  });

  describe('Timeline Rendering', () => {
    test('should render timeline with correct structure', () => {
      portfolioApp.populateExperienceSection();

      const timelineItems = timelineElement.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(2);

      // Check first experience item
      const firstItem = timelineItems[0];
      expect(firstItem.getAttribute('data-experience-id')).toBe('exp1');
      
      const company = firstItem.querySelector('.timeline-company');
      expect(company.textContent).toBe('Tech Solutions Inc.');
      
      const title = firstItem.querySelector('.timeline-title');
      expect(title.textContent).toBe('Senior Cloud Engineer');
      
      const duration = firstItem.querySelector('.timeline-duration');
      expect(duration.textContent).toBe('2022 - Present');
    });

    test('should render achievements with toggle button', () => {
      portfolioApp.populateExperienceSection();

      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      expect(toggleButton).toBeTruthy();
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
      expect(toggleButton.textContent).toBe('View Achievements');

      const achievementsList = timelineElement.querySelector('.timeline-achievements');
      expect(achievementsList).toBeTruthy();
      
      const achievements = achievementsList.querySelectorAll('li');
      expect(achievements).toHaveLength(3);
      expect(achievements[0].textContent).toBe('Led cloud migration projects reducing infrastructure costs by 30%');
    });

    test('should render technology tags', () => {
      portfolioApp.populateExperienceSection();

      const techContainer = timelineElement.querySelector('.timeline-technologies');
      expect(techContainer).toBeTruthy();

      const techTags = techContainer.querySelectorAll('.timeline-tech-tag');
      expect(techTags).toHaveLength(5);
      expect(techTags[0].textContent).toBe('AWS');
      expect(techTags[1].textContent).toBe('Docker');
    });

    test('should handle missing achievements gracefully', () => {
      // Mock data without achievements
      window.portfolioData.getExperience = () => [{
        id: 'exp-no-achievements',
        company: 'Test Company',
        title: 'Test Role',
        duration: '2021 - 2022',
        technologies: ['JavaScript']
      }];

      portfolioApp.populateExperienceSection();

      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      expect(toggleButton).toBeFalsy();

      const achievementsList = timelineElement.querySelector('.timeline-achievements');
      expect(achievementsList).toBeFalsy();
    });

    test('should handle missing technologies gracefully', () => {
      // Mock data without technologies
      window.portfolioData.getExperience = () => [{
        id: 'exp-no-tech',
        company: 'Test Company',
        title: 'Test Role',
        duration: '2021 - 2022',
        achievements: ['Test achievement']
      }];

      portfolioApp.populateExperienceSection();

      const techContainer = timelineElement.querySelector('.timeline-technologies');
      expect(techContainer).toBeFalsy();
    });
  });

  describe('Achievement Toggle Interactions', () => {
    beforeEach(() => {
      portfolioApp.populateExperienceSection();
      portfolioApp.initializeTimelineInteractions();
    });

    test('should toggle achievements visibility on button click', () => {
      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      const achievementsList = timelineElement.querySelector('.timeline-achievements');

      // Initially expanded
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
      expect(achievementsList.classList.contains('collapsed')).toBe(false);

      // Click to collapse
      toggleButton.click();

      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
      expect(toggleButton.textContent).toBe('Show Achievements');
      expect(achievementsList.classList.contains('collapsed')).toBe(true);
      expect(toggleButton.classList.contains('collapsed')).toBe(true);

      // Click to expand
      toggleButton.click();

      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
      expect(toggleButton.textContent).toBe('Hide Achievements');
      expect(achievementsList.classList.contains('collapsed')).toBe(false);
      expect(toggleButton.classList.contains('collapsed')).toBe(false);
    });

    test('should support keyboard navigation', () => {
      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      const achievementsList = timelineElement.querySelector('.timeline-achievements');

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      toggleButton.dispatchEvent(enterEvent);

      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
      expect(achievementsList.classList.contains('collapsed')).toBe(true);

      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      toggleButton.dispatchEvent(spaceEvent);

      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
      expect(achievementsList.classList.contains('collapsed')).toBe(false);
    });

    test('should ignore other keyboard keys', () => {
      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      const initialState = toggleButton.getAttribute('aria-expanded');

      // Test other keys (should not trigger toggle)
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      toggleButton.dispatchEvent(tabEvent);

      expect(toggleButton.getAttribute('aria-expanded')).toBe(initialState);
    });
  });

  describe('Animation System', () => {
    beforeEach(() => {
      // Mock IntersectionObserver
      global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }));
    });

    test('should initialize intersection observer for animations', () => {
      portfolioApp.populateExperienceSection();
      portfolioApp.initializeTimelineAnimations();

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.2,
          rootMargin: '50px'
        })
      );
    });

    test('should animate achievements toggle with stagger effect', (done) => {
      portfolioApp.populateExperienceSection();
      
      const achievementsList = timelineElement.querySelector('.timeline-achievements');
      const items = achievementsList.querySelectorAll('li');

      // Mock setTimeout for testing
      const originalSetTimeout = global.setTimeout;
      let timeoutCalls = 0;
      global.setTimeout = jest.fn((callback, delay) => {
        timeoutCalls++;
        callback();
        return timeoutCalls;
      });

      portfolioApp.animateAchievementsToggle(achievementsList, true);

      // Check that setTimeout was called for each item with staggered delays
      expect(global.setTimeout).toHaveBeenCalledTimes(items.length);
      
      // Verify staggered delays (0, 100, 200ms)
      expect(global.setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 0);
      expect(global.setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 100);
      expect(global.setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 200);

      global.setTimeout = originalSetTimeout;
      done();
    });
  });

  describe('HTML Escaping', () => {
    test('should escape HTML characters in content', () => {
      const testString = '<script>alert("xss")</script>';
      const escaped = portfolioApp.escapeHtml(testString);
      
      expect(escaped).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect(escaped).not.toContain('<script>');
    });

    test('should handle special characters', () => {
      const testString = 'Company & Associates "Best" \'Work\'';
      const escaped = portfolioApp.escapeHtml(testString);
      
      expect(escaped).toBe('Company &amp; Associates "Best" \'Work\'');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing timeline element gracefully', () => {
      document.getElementById('experience-timeline').remove();
      
      expect(() => {
        portfolioApp.populateExperienceSection();
      }).not.toThrow();
    });

    test('should handle empty experience data', () => {
      window.portfolioData.getExperience = () => [];
      
      portfolioApp.populateExperienceSection();
      
      const timelineItems = timelineElement.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(0);
      expect(timelineElement.innerHTML).toBe('');
    });

    test('should handle malformed experience data', () => {
      window.portfolioData.getExperience = () => [
        { id: 'incomplete' }, // Missing required fields
        null, // Null entry
        undefined // Undefined entry
      ];
      
      expect(() => {
        portfolioApp.populateExperienceSection();
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      portfolioApp.populateExperienceSection();
      portfolioApp.initializeTimelineInteractions();
    });

    test('should have proper ARIA attributes', () => {
      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      
      expect(toggleButton.getAttribute('aria-expanded')).toBeTruthy();
      expect(toggleButton.getAttribute('aria-label')).toBeTruthy();
      expect(toggleButton.getAttribute('data-target')).toBeTruthy();
    });

    test('should update ARIA attributes on interaction', () => {
      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      
      // Initial state
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
      
      // After collapse
      toggleButton.click();
      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
      
      // After expand
      toggleButton.click();
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    });

    test('should have semantic HTML structure', () => {
      const timelineItems = timelineElement.querySelectorAll('.timeline-item');
      
      timelineItems.forEach(item => {
        // Check for proper heading hierarchy
        const company = item.querySelector('h3.timeline-company');
        const title = item.querySelector('h4.timeline-title');
        
        expect(company).toBeTruthy();
        expect(title).toBeTruthy();
        
        // Check for list structure
        const achievementsList = item.querySelector('ul.timeline-achievements');
        if (achievementsList) {
          const listItems = achievementsList.querySelectorAll('li');
          expect(listItems.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Responsive Behavior', () => {
    test('should maintain functionality on mobile viewport', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480
      });

      portfolioApp.populateExperienceSection();
      portfolioApp.initializeTimelineInteractions();

      // Test that interactions still work
      const toggleButton = timelineElement.querySelector('.timeline-achievements-toggle');
      const achievementsList = timelineElement.querySelector('.timeline-achievements');

      toggleButton.click();
      expect(achievementsList.classList.contains('collapsed')).toBe(true);
    });
  });
});

// Integration tests
describe('Experience Timeline Integration', () => {
  test('should integrate with main portfolio app', () => {
    // Set up full DOM structure
    document.body.innerHTML = `
      <section class="section experience" id="experience">
        <div class="container">
          <h2 class="section-title">Experience</h2>
          <div class="timeline" id="experience-timeline"></div>
        </div>
      </section>
    `;

    // Mock portfolio data
    window.portfolioData = {
      loadData: () => Promise.resolve(),
      getExperience: () => mockExperienceData
    };

    // Create and initialize app
    const app = new PortfolioApp();
    
    // Verify experience section is populated
    const timelineItems = document.querySelectorAll('.timeline-item');
    expect(timelineItems.length).toBeGreaterThan(0);
  });
});