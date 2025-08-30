// Skills Component Tests
describe('Skills Component', () => {
  let portfolioApp;
  let mockSkillsData;
  
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <section class="section skills" id="skills">
        <div class="container">
          <h2 class="section-title">Skills</h2>
          <div class="skills-categories" id="skills-categories">
            <!-- Skills will be populated by JavaScript -->
          </div>
        </div>
      </section>
    `;
    
    // Mock skills data
    mockSkillsData = [
      {
        category: 'Cloud Platforms',
        skills: [
          { name: 'AWS', proficiency: 'expert' },
          { name: 'Azure', proficiency: 'advanced' },
          { name: 'Docker', proficiency: 'expert' }
        ]
      },
      {
        category: 'Programming',
        skills: [
          { name: 'Python', proficiency: 'expert' },
          { name: 'JavaScript', proficiency: 'advanced' }
        ]
      },
      {
        category: 'Cybersecurity',
        skills: [
          { name: 'Security Auditing', proficiency: 'expert' },
          { name: 'Penetration Testing', proficiency: 'advanced' }
        ]
      }
    ];
    
    // Mock portfolio data
    window.portfolioData = {
      getSkills: () => mockSkillsData,
      isLoaded: true
    };
    
    // Create portfolio app instance
    portfolioApp = new PortfolioApp();
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    delete window.portfolioData;
  });
  
  describe('Skills Component Creation', () => {
    test('should create skills component with all required elements', () => {
      portfolioApp.populateSkillsSection();
      
      // Check main structure
      expect(document.querySelector('.skills-controls')).toBeTruthy();
      expect(document.querySelector('.skills-search')).toBeTruthy();
      expect(document.querySelector('.skills-filter')).toBeTruthy();
      expect(document.querySelector('.skills-grid')).toBeTruthy();
      expect(document.querySelector('.skills-summary')).toBeTruthy();
    });
    
    test('should create correct number of skill categories', () => {
      portfolioApp.populateSkillsSection();
      
      const categories = document.querySelectorAll('.skill-category');
      expect(categories.length).toBe(mockSkillsData.length);
    });
    
    test('should create filter buttons for all categories', () => {
      portfolioApp.populateSkillsSection();
      
      const filterButtons = document.querySelectorAll('.skills-filter-btn');
      // Should have "All Skills" + one for each category
      expect(filterButtons.length).toBe(mockSkillsData.length + 1);
      
      // Check "All Skills" button exists and is active
      const allButton = document.querySelector('.skills-filter-btn[data-category="all"]');
      expect(allButton).toBeTruthy();
      expect(allButton.classList.contains('active')).toBe(true);
    });
    
    test('should create skill items with correct data attributes', () => {
      portfolioApp.populateSkillsSection();
      
      const skillItems = document.querySelectorAll('.skill-item');
      const totalSkills = mockSkillsData.reduce((sum, cat) => sum + cat.skills.length, 0);
      expect(skillItems.length).toBe(totalSkills);
      
      // Check first skill item has correct attributes
      const firstSkill = skillItems[0];
      expect(firstSkill.getAttribute('data-skill')).toBeTruthy();
      expect(firstSkill.getAttribute('data-category')).toBeTruthy();
      expect(firstSkill.getAttribute('data-proficiency')).toBeTruthy();
    });
  });
  
  describe('Skills Search Functionality', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should filter skills based on search input', (done) => {
      const searchInput = document.getElementById('skills-search');
      const skillItems = document.querySelectorAll('.skill-item');
      
      // Simulate search for "AWS"
      searchInput.value = 'aws';
      searchInput.dispatchEvent(new Event('input'));
      
      // Wait for debounced search
      setTimeout(() => {
        const visibleSkills = Array.from(skillItems).filter(item => 
          item.style.display !== 'none'
        );
        
        expect(visibleSkills.length).toBe(1);
        expect(visibleSkills[0].getAttribute('data-skill')).toBe('aws');
        done();
      }, 350);
    });
    
    test('should highlight matching skills during search', (done) => {
      const searchInput = document.getElementById('skills-search');
      
      searchInput.value = 'python';
      searchInput.dispatchEvent(new Event('input'));
      
      setTimeout(() => {
        const highlightedSkills = document.querySelectorAll('.skill-item.search-highlight');
        expect(highlightedSkills.length).toBeGreaterThan(0);
        done();
      }, 350);
    });
    
    test('should clear search on escape key', () => {
      const searchInput = document.getElementById('skills-search');
      searchInput.value = 'test search';
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      searchInput.dispatchEvent(escapeEvent);
      
      expect(searchInput.value).toBe('');
    });
    
    test('should update skills summary during search', (done) => {
      const searchInput = document.getElementById('skills-search');
      
      searchInput.value = 'security';
      searchInput.dispatchEvent(new Event('input'));
      
      setTimeout(() => {
        const summaryElement = document.querySelector('.skills-summary .skills-count');
        expect(summaryElement.textContent).toContain('matching "security"');
        done();
      }, 350);
    });
  });
  
  describe('Skills Filter Functionality', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should filter skills by category', () => {
      const programmingButton = document.querySelector('.skills-filter-btn[data-category="Programming"]');
      const categories = document.querySelectorAll('.skill-category');
      
      programmingButton.click();
      
      // Check that only Programming category is visible
      const visibleCategories = Array.from(categories).filter(cat => 
        cat.style.display !== 'none'
      );
      
      expect(visibleCategories.length).toBe(1);
      expect(visibleCategories[0].getAttribute('data-category')).toBe('Programming');
    });
    
    test('should update active filter button', () => {
      const allButton = document.querySelector('.skills-filter-btn[data-category="all"]');
      const cloudButton = document.querySelector('.skills-filter-btn[data-category="Cloud Platforms"]');
      
      expect(allButton.classList.contains('active')).toBe(true);
      
      cloudButton.click();
      
      expect(allButton.classList.contains('active')).toBe(false);
      expect(cloudButton.classList.contains('active')).toBe(true);
    });
    
    test('should show all categories when "All Skills" is selected', () => {
      const cloudButton = document.querySelector('.skills-filter-btn[data-category="Cloud Platforms"]');
      const allButton = document.querySelector('.skills-filter-btn[data-category="all"]');
      const categories = document.querySelectorAll('.skill-category');
      
      // First filter by cloud
      cloudButton.click();
      
      // Then show all
      allButton.click();
      
      const visibleCategories = Array.from(categories).filter(cat => 
        cat.style.display !== 'none'
      );
      
      expect(visibleCategories.length).toBe(mockSkillsData.length);
    });
  });
  
  describe('Category Toggle Functionality', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should toggle category expansion', () => {
      const toggleButton = document.querySelector('.category-toggle');
      const skillsList = document.querySelector('.skills-list');
      
      // Initially expanded
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
      
      toggleButton.click();
      
      // Should be collapsed
      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
      expect(skillsList.style.maxHeight).toBe('0px');
    });
    
    test('should update toggle icon on collapse/expand', () => {
      const toggleButton = document.querySelector('.category-toggle');
      const toggleIcon = toggleButton.querySelector('.toggle-icon');
      
      expect(toggleIcon.textContent).toBe('▼');
      
      toggleButton.click();
      
      expect(toggleIcon.textContent).toBe('▶');
    });
  });
  
  describe('Skill Item Interactions', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should expand skill details on click', () => {
      const skillItem = document.querySelector('.skill-item');
      const skillDetails = skillItem.querySelector('.skill-details');
      
      expect(skillDetails.style.display).toBe('none');
      
      skillItem.click();
      
      expect(skillDetails.style.display).toBe('block');
      expect(skillItem.classList.contains('expanded')).toBe(true);
    });
    
    test('should collapse skill details on second click', () => {
      const skillItem = document.querySelector('.skill-item');
      const skillDetails = skillItem.querySelector('.skill-details');
      
      // First click to expand
      skillItem.click();
      expect(skillDetails.style.display).toBe('block');
      
      // Second click to collapse
      skillItem.click();
      expect(skillDetails.style.display).toBe('none');
      expect(skillItem.classList.contains('expanded')).toBe(false);
    });
    
    test('should close other expanded skills when opening new one', () => {
      const skillItems = document.querySelectorAll('.skill-item');
      const firstSkill = skillItems[0];
      const secondSkill = skillItems[1];
      
      // Expand first skill
      firstSkill.click();
      expect(firstSkill.classList.contains('expanded')).toBe(true);
      
      // Expand second skill
      secondSkill.click();
      expect(firstSkill.classList.contains('expanded')).toBe(false);
      expect(secondSkill.classList.contains('expanded')).toBe(true);
    });
    
    test('should support keyboard navigation', () => {
      const skillItem = document.querySelector('.skill-item');
      const skillDetails = skillItem.querySelector('.skill-details');
      
      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      skillItem.dispatchEvent(enterEvent);
      
      expect(skillDetails.style.display).toBe('block');
      
      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      skillItem.dispatchEvent(spaceEvent);
      
      expect(skillDetails.style.display).toBe('none');
    });
  });
  
  describe('Proficiency Display', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should display proficiency bars for skills with proficiency data', () => {
      const skillItems = document.querySelectorAll('.skill-item');
      const skillsWithProficiency = Array.from(skillItems).filter(item => 
        item.querySelector('.proficiency-bar')
      );
      
      expect(skillsWithProficiency.length).toBeGreaterThan(0);
    });
    
    test('should set correct proficiency bar width based on level', () => {
      const expertSkill = document.querySelector('.skill-item[data-proficiency="expert"]');
      const proficiencyFill = expertSkill.querySelector('.proficiency-fill');
      
      expect(proficiencyFill.getAttribute('data-level')).toBe('expert');
    });
    
    test('should apply correct CSS classes for proficiency levels', () => {
      const expertSkill = document.querySelector('.skill-item[data-proficiency="expert"]');
      const advancedSkill = document.querySelector('.skill-item[data-proficiency="advanced"]');
      
      expect(expertSkill.classList.contains('proficiency-expert')).toBe(true);
      expect(advancedSkill.classList.contains('proficiency-advanced')).toBe(true);
    });
  });
  
  describe('Category Icons', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should display appropriate icons for different categories', () => {
      const cloudCategory = document.querySelector('.skill-category[data-category="Cloud Platforms"]');
      const programmingCategory = document.querySelector('.skill-category[data-category="Programming"]');
      const securityCategory = document.querySelector('.skill-category[data-category="Cybersecurity"]');
      
      const cloudIcon = cloudCategory.querySelector('.category-icon');
      const programmingIcon = programmingCategory.querySelector('.category-icon');
      const securityIcon = securityCategory.querySelector('.category-icon');
      
      expect(cloudIcon.textContent).toBe('☁️');
      expect(programmingIcon.textContent).toBe('💻');
      expect(securityIcon.textContent).toBe('🔒');
    });
  });
  
  describe('Skills Summary', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should display correct total skills count', () => {
      const summaryElement = document.querySelector('.skills-summary .skills-count');
      const totalSkills = mockSkillsData.reduce((sum, cat) => sum + cat.skills.length, 0);
      
      expect(summaryElement.textContent).toContain(`${totalSkills} skills`);
    });
    
    test('should display correct categories count', () => {
      const summaryElement = document.querySelector('.skills-summary .skills-count');
      
      expect(summaryElement.textContent).toContain(`${mockSkillsData.length} categories`);
    });
  });
  
  describe('Accessibility Features', () => {
    beforeEach(() => {
      portfolioApp.populateSkillsSection();
    });
    
    test('should have proper ARIA labels', () => {
      const searchInput = document.getElementById('skills-search');
      const toggleButtons = document.querySelectorAll('.category-toggle');
      
      expect(searchInput.getAttribute('aria-label')).toBe('Search skills');
      
      toggleButtons.forEach(button => {
        expect(button.getAttribute('aria-label')).toBeTruthy();
        expect(button.getAttribute('aria-expanded')).toBeTruthy();
      });
    });
    
    test('should make skill items focusable', () => {
      const skillItems = document.querySelectorAll('.skill-item');
      
      skillItems.forEach(item => {
        expect(item.getAttribute('tabindex')).toBe('0');
      });
    });
    
    test('should have proper focus management', () => {
      const searchInput = document.getElementById('skills-search');
      const filterButtons = document.querySelectorAll('.skills-filter-btn');
      
      expect(searchInput.getAttribute('outline')).toBeFalsy(); // Should be handled by CSS
      
      filterButtons.forEach(button => {
        // Focus should be handled by CSS :focus styles
        expect(button.tabIndex).not.toBe(-1);
      });
    });
  });
  
  describe('Error Handling', () => {
    test('should handle empty skills data gracefully', () => {
      window.portfolioData.getSkills = () => [];
      
      expect(() => {
        portfolioApp.populateSkillsSection();
      }).not.toThrow();
      
      const skillsGrid = document.querySelector('.skills-grid');
      expect(skillsGrid.children.length).toBe(0);
    });
    
    test('should handle missing skills section element', () => {
      document.getElementById('skills').remove();
      
      expect(() => {
        portfolioApp.populateSkillsSection();
      }).not.toThrow();
    });
    
    test('should handle skills without proficiency data', () => {
      const skillsWithoutProficiency = [
        {
          category: 'Test Category',
          skills: [
            { name: 'Test Skill' } // No proficiency
          ]
        }
      ];
      
      window.portfolioData.getSkills = () => skillsWithoutProficiency;
      
      expect(() => {
        portfolioApp.populateSkillsSection();
      }).not.toThrow();
      
      const skillItem = document.querySelector('.skill-item');
      expect(skillItem.getAttribute('data-proficiency')).toBe('intermediate'); // Default
    });
  });
  
  describe('Performance', () => {
    test('should debounce search input', (done) => {
      portfolioApp.populateSkillsSection();
      
      const searchInput = document.getElementById('skills-search');
      let searchCallCount = 0;
      
      // Mock the search handler to count calls
      const originalHandler = portfolioApp.handleSkillsSearch;
      portfolioApp.handleSkillsSearch = (...args) => {
        searchCallCount++;
        return originalHandler.apply(portfolioApp, args);
      };
      
      // Rapid input events
      searchInput.value = 'a';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.value = 'aw';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.value = 'aws';
      searchInput.dispatchEvent(new Event('input'));
      
      // Should only call search once after debounce
      setTimeout(() => {
        expect(searchCallCount).toBe(1);
        done();
      }, 350);
    });
  });
});

// Test Helper Functions
function createMockSkillsData() {
  return [
    {
      category: 'Cloud Platforms',
      skills: [
        { name: 'AWS', proficiency: 'expert' },
        { name: 'Azure', proficiency: 'advanced' },
        { name: 'Google Cloud', proficiency: 'intermediate' },
        { name: 'Docker', proficiency: 'expert' },
        { name: 'Kubernetes', proficiency: 'advanced' }
      ]
    },
    {
      category: 'Programming',
      skills: [
        { name: 'Python', proficiency: 'expert' },
        { name: 'JavaScript', proficiency: 'advanced' },
        { name: 'Go', proficiency: 'intermediate' },
        { name: 'SQL', proficiency: 'advanced' }
      ]
    },
    {
      category: 'Cybersecurity',
      skills: [
        { name: 'Security Auditing', proficiency: 'expert' },
        { name: 'Penetration Testing', proficiency: 'advanced' },
        { name: 'SIEM', proficiency: 'advanced' },
        { name: 'Incident Response', proficiency: 'expert' }
      ]
    }
  ];
}

// Integration Tests
describe('Skills Component Integration', () => {
  test('should integrate properly with portfolio data loading', async () => {
    // Mock async data loading
    window.portfolioData = {
      loadData: async () => createMockSkillsData(),
      getSkills: () => createMockSkillsData(),
      isLoaded: false
    };
    
    document.body.innerHTML = `
      <section class="section skills" id="skills"></section>
    `;
    
    const app = new PortfolioApp();
    await app.init();
    
    expect(document.querySelector('.skills-grid')).toBeTruthy();
    expect(document.querySelectorAll('.skill-category').length).toBe(3);
  });
});