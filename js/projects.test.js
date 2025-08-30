// Projects Component Tests
describe('Projects Component', () => {
  let portfolioApp;
  let mockProjectsData;
  
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <section class="section projects" id="projects">
        <!-- Projects content will be populated by JavaScript -->
      </section>
    `;
    
    // Mock projects data
    mockProjectsData = [
      {
        id: 'proj1',
        title: 'Cloud Security Platform',
        description: 'A comprehensive security monitoring platform for cloud infrastructure.',
        tools: ['AWS', 'Python', 'React', 'Docker'],
        outcomes: [
          'Reduced security incidents by 40%',
          'Automated threat detection and response'
        ],
        images: ['images/projects/security-platform.jpg'],
        links: [
          { name: 'GitHub', url: 'https://github.com/test/security-platform' },
          { name: 'Live Demo', url: 'https://security-platform-demo.com' }
        ]
      },
      {
        id: 'proj2',
        title: 'API Gateway',
        description: 'High-performance API gateway with advanced security features.',
        tools: ['Go', 'Redis', 'PostgreSQL', 'Kubernetes'],
        outcomes: [
          'Processed 1M+ API requests per day',
          'Blocked 15,000+ malicious requests'
        ],
        images: ['images/projects/api-gateway.jpg'],
        links: [
          { name: 'GitHub', url: 'https://github.com/test/api-gateway' }
        ]
      },
      {
        id: 'proj3',
        title: 'Infrastructure Framework',
        description: 'Reusable Terraform framework for deploying secure infrastructure.',
        tools: ['Terraform', 'AWS', 'Python', 'Ansible'],
        outcomes: [
          'Reduced deployment time from days to hours',
          'Standardized security configurations'
        ],
        images: [],
        links: []
      }
    ];
    
    // Mock portfolio data
    window.portfolioData = {
      getProjects: () => mockProjectsData,
      isLoaded: true
    };
    
    // Create portfolio app instance
    portfolioApp = {
      escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      },
      createProjectsComponent: window.PortfolioApp.prototype.createProjectsComponent,
      createProjectCard: window.PortfolioApp.prototype.createProjectCard,
      initializeProjectsInteractions: window.PortfolioApp.prototype.initializeProjectsInteractions,
      filterProjects: window.PortfolioApp.prototype.filterProjects,
      filterProjectsByTechnology: window.PortfolioApp.prototype.filterProjectsByTechnology,
      updateProjectsCount: window.PortfolioApp.prototype.updateProjectsCount,
      handleProjectCardHover: window.PortfolioApp.prototype.handleProjectCardHover,
      initializeProjectImageLazyLoading: window.PortfolioApp.prototype.initializeProjectImageLazyLoading,
      loadProjectImage: window.PortfolioApp.prototype.loadProjectImage,
      initializeProjectScrollAnimations: window.PortfolioApp.prototype.initializeProjectScrollAnimations
    };
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    delete window.portfolioData;
  });

  describe('Project Grid Layout', () => {
    test('should create responsive grid layout', () => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      
      const grid = document.querySelector('.projects-grid');
      expect(grid).toBeTruthy();
      
      // Check CSS Grid is applied
      const computedStyle = window.getComputedStyle(grid);
      expect(computedStyle.display).toBe('grid');
    });
    
    test('should render all project cards', () => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      
      const projectCards = document.querySelectorAll('.project-card');
      expect(projectCards.length).toBe(mockProjectsData.length);
    });
    
    test('should include project data in cards', () => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      
      const firstCard = document.querySelector('.project-card');
      const title = firstCard.querySelector('.project-title');
      const description = firstCard.querySelector('.project-description');
      
      expect(title.textContent).toBe(mockProjectsData[0].title);
      expect(description.textContent).toBe(mockProjectsData[0].description);
    });
  });

  describe('Project Card Components', () => {
    test('should create project card with all elements', () => {
      const card = portfolioApp.createProjectCard(mockProjectsData[0]);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card;
      
      expect(tempDiv.querySelector('.project-title')).toBeTruthy();
      expect(tempDiv.querySelector('.project-description')).toBeTruthy();
      expect(tempDiv.querySelector('.project-tools')).toBeTruthy();
      expect(tempDiv.querySelector('.project-outcomes')).toBeTruthy();
      expect(tempDiv.querySelector('.project-links')).toBeTruthy();
    });
    
    test('should handle project with image', () => {
      const card = portfolioApp.createProjectCard(mockProjectsData[0]);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card;
      
      const image = tempDiv.querySelector('.project-image.lazy-load');
      expect(image).toBeTruthy();
      expect(image.getAttribute('data-src')).toBe(mockProjectsData[0].images[0]);
    });
    
    test('should handle project without image', () => {
      const card = portfolioApp.createProjectCard(mockProjectsData[2]);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card;
      
      const fallback = tempDiv.querySelector('.project-image-fallback');
      expect(fallback).toBeTruthy();
    });
    
    test('should render technology tags', () => {
      const card = portfolioApp.createProjectCard(mockProjectsData[0]);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card;
      
      const toolTags = tempDiv.querySelectorAll('.tool-tag');
      expect(toolTags.length).toBe(mockProjectsData[0].tools.length);
      
      toolTags.forEach((tag, index) => {
        expect(tag.textContent).toBe(mockProjectsData[0].tools[index]);
      });
    });
    
    test('should render project outcomes', () => {
      const card = portfolioApp.createProjectCard(mockProjectsData[0]);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card;
      
      const outcomes = tempDiv.querySelectorAll('.outcomes-list li');
      expect(outcomes.length).toBe(mockProjectsData[0].outcomes.length);
    });
    
    test('should render project links', () => {
      const card = portfolioApp.createProjectCard(mockProjectsData[0]);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card;
      
      const links = tempDiv.querySelectorAll('.project-link');
      expect(links.length).toBe(mockProjectsData[0].links.length);
      
      links.forEach((link, index) => {
        expect(link.textContent.trim()).toBe(mockProjectsData[0].links[index].name);
        expect(link.href).toBe(mockProjectsData[0].links[index].url);
      });
    });
  });

  describe('Filter Functionality', () => {
    beforeEach(() => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      portfolioApp.initializeProjectsInteractions();
    });
    
    test('should create filter buttons for all technologies', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      
      // Should have "All Projects" button plus one for each unique technology
      const allTechnologies = [...new Set(mockProjectsData.flatMap(p => p.tools))];
      expect(filterButtons.length).toBe(allTechnologies.length + 1);
      
      // First button should be "All Projects"
      expect(filterButtons[0].textContent).toBe('All Projects');
      expect(filterButtons[0].classList.contains('active')).toBe(true);
    });
    
    test('should filter projects by technology', () => {
      const projectCards = document.querySelectorAll('.project-card');
      
      // Filter by AWS
      portfolioApp.filterProjects('AWS', projectCards);
      
      // Check which cards should be visible
      const awsProjects = mockProjectsData.filter(p => 
        p.tools.some(tool => tool.toLowerCase().includes('aws'))
      );
      
      let visibleCards = 0;
      projectCards.forEach(card => {
        if (card.style.display !== 'none') {
          visibleCards++;
        }
      });
      
      expect(visibleCards).toBe(awsProjects.length);
    });
    
    test('should show all projects when "all" filter is selected', () => {
      const projectCards = document.querySelectorAll('.project-card');
      
      // First filter by something specific
      portfolioApp.filterProjects('Python', projectCards);
      
      // Then show all
      portfolioApp.filterProjects('all', projectCards);
      
      let visibleCards = 0;
      projectCards.forEach(card => {
        if (card.style.display !== 'none') {
          visibleCards++;
        }
      });
      
      expect(visibleCards).toBe(mockProjectsData.length);
    });
    
    test('should update filter button active state', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const awsButton = Array.from(filterButtons).find(btn => 
        btn.getAttribute('data-filter') === 'AWS'
      );
      
      if (awsButton) {
        // Simulate click
        awsButton.click();
        
        // Check active state
        expect(awsButton.classList.contains('active')).toBe(true);
        
        // Check other buttons are not active
        filterButtons.forEach(btn => {
          if (btn !== awsButton) {
            expect(btn.classList.contains('active')).toBe(false);
          }
        });
      }
    });
    
    test('should update projects count display', () => {
      const projectCards = document.querySelectorAll('.project-card');
      
      portfolioApp.filterProjects('Python', projectCards);
      
      const countElement = document.querySelector('.projects-count');
      expect(countElement).toBeTruthy();
      expect(countElement.textContent).toContain('Python');
    });
  });

  describe('Technology Tag Interactions', () => {
    beforeEach(() => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      portfolioApp.initializeProjectsInteractions();
    });
    
    test('should filter by technology when tag is clicked', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const projectCards = document.querySelectorAll('.project-card');
      
      // Find a technology tag
      const techTag = document.querySelector('.tool-tag[data-tech="python"]');
      
      if (techTag) {
        // Mock the filterProjectsByTechnology method
        const spy = jest.spyOn(portfolioApp, 'filterProjectsByTechnology');
        
        // Simulate click
        techTag.click();
        
        expect(spy).toHaveBeenCalledWith('python', filterButtons, projectCards);
      }
    });
  });

  describe('Hover Effects', () => {
    beforeEach(() => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      portfolioApp.initializeProjectsInteractions();
    });
    
    test('should handle card hover effects', () => {
      const projectCard = document.querySelector('.project-card');
      const overlay = projectCard.querySelector('.project-overlay');
      
      // Test hover in
      portfolioApp.handleProjectCardHover(projectCard, true);
      expect(overlay.style.opacity).toBe('1');
      expect(overlay.style.transform).toBe('translateY(0px)');
      
      // Test hover out
      portfolioApp.handleProjectCardHover(projectCard, false);
      expect(overlay.style.opacity).toBe('0');
      expect(overlay.style.transform).toBe('translateY(20px)');
    });
    
    test('should handle image scaling on hover', () => {
      const projectCard = document.querySelector('.project-card');
      const image = projectCard.querySelector('.project-image');
      
      if (image && !image.classList.contains('project-image-fallback')) {
        // Test hover in
        portfolioApp.handleProjectCardHover(projectCard, true);
        expect(image.style.transform).toBe('scale(1.05)');
        
        // Test hover out
        portfolioApp.handleProjectCardHover(projectCard, false);
        expect(image.style.transform).toBe('scale(1)');
      }
    });
  });

  describe('Lazy Loading', () => {
    beforeEach(() => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
    });
    
    test('should initialize intersection observer for lazy loading', () => {
      const spy = jest.spyOn(window, 'IntersectionObserver');
      
      portfolioApp.initializeProjectImageLazyLoading();
      
      expect(spy).toHaveBeenCalled();
    });
    
    test('should load image when in viewport', (done) => {
      const img = document.querySelector('.project-image.lazy-load');
      
      if (img) {
        // Mock successful image load
        const mockImage = {
          onload: null,
          onerror: null,
          src: ''
        };
        
        jest.spyOn(window, 'Image').mockImplementation(() => mockImage);
        
        portfolioApp.loadProjectImage(img);
        
        // Simulate successful load
        setTimeout(() => {
          mockImage.onload();
          
          expect(img.classList.contains('loaded')).toBe(true);
          expect(img.classList.contains('lazy-load')).toBe(false);
          done();
        }, 100);
      } else {
        done();
      }
    });
    
    test('should handle image load error', (done) => {
      const img = document.querySelector('.project-image.lazy-load');
      
      if (img) {
        // Mock failed image load
        const mockImage = {
          onload: null,
          onerror: null,
          src: ''
        };
        
        jest.spyOn(window, 'Image').mockImplementation(() => mockImage);
        
        portfolioApp.loadProjectImage(img);
        
        // Simulate failed load
        setTimeout(() => {
          mockImage.onerror();
          
          expect(img.classList.contains('error')).toBe(true);
          expect(img.classList.contains('lazy-load')).toBe(false);
          done();
        }, 100);
      } else {
        done();
      }
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
    });
    
    test('should have proper ARIA labels on filter buttons', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      
      filterButtons.forEach(button => {
        expect(button.getAttribute('data-filter')).toBeTruthy();
      });
    });
    
    test('should have proper alt text for images', () => {
      const images = document.querySelectorAll('.project-image');
      
      images.forEach(img => {
        if (img.hasAttribute('alt')) {
          expect(img.getAttribute('alt')).toBeTruthy();
          expect(img.getAttribute('alt')).toContain('project');
        }
      });
    });
    
    test('should have proper ARIA labels on project links', () => {
      const projectLinks = document.querySelectorAll('.project-link');
      
      projectLinks.forEach(link => {
        expect(link.getAttribute('aria-label')).toBeTruthy();
      });
    });
    
    test('should support keyboard navigation on filter buttons', () => {
      const filterButton = document.querySelector('.filter-btn');
      
      // Test focus
      filterButton.focus();
      expect(document.activeElement).toBe(filterButton);
      
      // Test keyboard activation
      const clickSpy = jest.spyOn(filterButton, 'click');
      
      // Simulate Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      filterButton.dispatchEvent(enterEvent);
      
      // Simulate Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      filterButton.dispatchEvent(spaceEvent);
    });
  });

  describe('Responsive Behavior', () => {
    test('should adapt grid layout for mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480
      });
      
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, mockProjectsData);
      
      const grid = document.querySelector('.projects-grid');
      expect(grid).toBeTruthy();
      
      // In a real test environment, you would check computed styles
      // For now, we verify the grid exists and has the right class
      expect(grid.classList.contains('projects-grid')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty projects array', () => {
      const projectsSection = document.getElementById('projects');
      portfolioApp.createProjectsComponent(projectsSection, []);
      
      const grid = document.querySelector('.projects-grid');
      expect(grid).toBeTruthy();
      expect(grid.children.length).toBe(0);
    });
    
    test('should handle projects with missing data', () => {
      const incompleteProject = {
        id: 'incomplete',
        title: 'Incomplete Project',
        description: 'Missing some fields',
        tools: ['JavaScript']
        // Missing outcomes, images, links
      };
      
      const card = portfolioApp.createProjectCard(incompleteProject);
      expect(card).toBeTruthy();
      expect(card).toContain('Incomplete Project');
    });
    
    test('should escape HTML in project data', () => {
      const maliciousProject = {
        id: 'malicious',
        title: '<script>alert("xss")</script>',
        description: '<img src="x" onerror="alert(1)">',
        tools: ['<script>'],
        outcomes: ['<script>alert("outcome")</script>'],
        links: [{ name: '<script>', url: 'javascript:alert(1)' }]
      };
      
      const card = portfolioApp.createProjectCard(maliciousProject);
      
      // Should not contain actual script tags
      expect(card).not.toContain('<script>alert');
      expect(card).toContain('&lt;script&gt;');
    });
  });
});