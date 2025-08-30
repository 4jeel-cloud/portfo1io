// SEO Manager Tests
describe('SEO Manager', () => {
  let seoManager;
  let mockPortfolioData;

  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Original Title</title>
    `;
    
    document.body.innerHTML = `
      <h1>Main Title</h1>
      <section>
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h3>Subsection 1.2</h3>
      </section>
      <section>
        <h2>Section 2</h2>
      </section>
    `;

    // Create fresh SEO manager instance
    seoManager = new (window.SEOManager.constructor)();
    
    // Mock portfolio data
    mockPortfolioData = {
      personal: {
        name: 'John Doe',
        title: 'Senior Cloud Engineer',
        bio: 'Passionate cloud engineer with expertise in AWS and cybersecurity.',
        summary: 'Experienced professional specializing in Cloud, Cybersecurity, AI, and API development. Dedicated to creating innovative solutions that drive business success while maintaining the highest security standards.',
        contact: {
          email: 'john.doe@example.com',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          behance: 'https://behance.net/johndoe'
        },
        headshot: 'images/profile/john-doe.jpg'
      },
      experience: [
        {
          id: 'exp1',
          company: 'Tech Corp',
          title: 'Senior Cloud Engineer',
          duration: '2022 - Present',
          achievements: ['Led cloud migration', 'Reduced costs by 30%'],
          technologies: ['AWS', 'Docker', 'Kubernetes']
        },
        {
          id: 'exp2',
          company: 'StartupTech',
          title: 'DevOps Engineer',
          duration: '2020 - 2022',
          achievements: ['Automated deployments'],
          technologies: ['Python', 'Terraform']
        }
      ],
      projects: [
        {
          id: 'proj1',
          title: 'Cloud Security Platform',
          description: 'A comprehensive security monitoring platform',
          tools: ['AWS', 'Python', 'React'],
          outcomes: ['Reduced incidents by 40%']
        }
      ],
      skills: [
        {
          category: 'Cloud Platforms',
          skills: [
            { name: 'AWS', proficiency: 'expert' },
            { name: 'Azure', proficiency: 'advanced' }
          ]
        },
        {
          category: 'Programming',
          skills: [
            { name: 'Python', proficiency: 'expert' },
            { name: 'JavaScript', proficiency: 'advanced' }
          ]
        }
      ]
    };
  });

  afterEach(() => {
    // Clean up any added elements
    const structuredData = document.getElementById('structured-data');
    if (structuredData) structuredData.remove();
    
    // Remove any added meta tags
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(el => el.remove());
  });

  describe('Initialization', () => {
    test('should initialize with portfolio data', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      seoManager.initialize(mockPortfolioData);
      
      expect(consoleSpy).toHaveBeenCalledWith('✓ SEO optimization initialized');
      consoleSpy.mockRestore();
    });

    test('should handle missing portfolio data gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      seoManager.initialize(null);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('SEO: Portfolio data not available, using defaults');
      consoleWarnSpy.mockRestore();
    });

    test('should handle missing personal data gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      seoManager.initialize({});
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('SEO: Portfolio data not available, using defaults');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Dynamic Meta Tags', () => {
    beforeEach(() => {
      seoManager.initialize(mockPortfolioData);
    });

    test('should update page title dynamically', () => {
      expect(document.title).toBe('John Doe - Senior Cloud Engineer | Portfolio');
    });

    test('should update meta description', () => {
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc.content).toContain('Experienced professional specializing in Cloud, Cybersecurity, AI');
    });

    test('should update author meta tag', () => {
      const metaAuthor = document.querySelector('meta[name="author"]');
      expect(metaAuthor.content).toBe('John Doe');
    });

    test('should generate keywords from portfolio data', () => {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      expect(metaKeywords.content).toContain('cloud');
      expect(metaKeywords.content).toContain('aws');
      expect(metaKeywords.content).toContain('python');
    });

    test('should truncate long descriptions', () => {
      const longSummary = 'A'.repeat(200);
      const testData = {
        ...mockPortfolioData,
        personal: {
          ...mockPortfolioData.personal,
          summary: longSummary
        }
      };
      
      seoManager.initialize(testData);
      
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc.content.length).toBeLessThanOrEqual(160);
      expect(metaDesc.content).toMatch(/\.\.\.$/);
    });
  });

  describe('Open Graph Tags', () => {
    beforeEach(() => {
      seoManager.initialize(mockPortfolioData);
    });

    test('should add basic Open Graph tags', () => {
      expect(document.querySelector('meta[property="og:type"]').content).toBe('profile');
      expect(document.querySelector('meta[property="og:title"]').content).toBe('John Doe - Senior Cloud Engineer');
      expect(document.querySelector('meta[property="og:url"]').content).toBe(window.location.origin);
      expect(document.querySelector('meta[property="og:site_name"]').content).toBe('John Doe Portfolio');
    });

    test('should add profile-specific Open Graph tags', () => {
      expect(document.querySelector('meta[property="profile:first_name"]').content).toBe('John');
      expect(document.querySelector('meta[property="profile:last_name"]').content).toBe('Doe');
    });

    test('should add image Open Graph tags', () => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage.content).toBe(`${window.location.origin}/images/profile/john-doe.jpg`);
      
      const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
      expect(ogImageAlt.content).toBe('Professional headshot of John Doe');
    });

    test('should handle missing headshot gracefully', () => {
      const testData = {
        ...mockPortfolioData,
        personal: {
          ...mockPortfolioData.personal,
          headshot: null
        }
      };
      
      seoManager.initialize(testData);
      
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage.content).toBe(`${window.location.origin}/images/profile/headshot.svg`);
    });
  });

  describe('Twitter Card Tags', () => {
    beforeEach(() => {
      seoManager.initialize(mockPortfolioData);
    });

    test('should add Twitter Card tags', () => {
      expect(document.querySelector('meta[name="twitter:card"]').content).toBe('summary');
      expect(document.querySelector('meta[name="twitter:title"]').content).toBe('John Doe - Senior Cloud Engineer');
      expect(document.querySelector('meta[name="twitter:image"]').content).toBe(`${window.location.origin}/images/profile/john-doe.jpg`);
      expect(document.querySelector('meta[name="twitter:image:alt"]').content).toBe('Professional headshot of John Doe');
    });

    test('should truncate Twitter description appropriately', () => {
      const longSummary = 'A'.repeat(250);
      const testData = {
        ...mockPortfolioData,
        personal: {
          ...mockPortfolioData.personal,
          summary: longSummary
        }
      };
      
      seoManager.initialize(testData);
      
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      expect(twitterDesc.content.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Structured Data', () => {
    beforeEach(() => {
      seoManager.initialize(mockPortfolioData);
    });

    test('should add structured data script', () => {
      const structuredDataScript = document.getElementById('structured-data');
      expect(structuredDataScript).toBeTruthy();
      expect(structuredDataScript.type).toBe('application/ld+json');
    });

    test('should include Person schema', () => {
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      
      const personSchema = data['@graph'].find(item => item['@type'] === 'Person');
      expect(personSchema).toBeTruthy();
      expect(personSchema.name).toBe('John Doe');
      expect(personSchema.jobTitle).toBe('Senior Cloud Engineer');
      expect(personSchema.email).toBe('john.doe@example.com');
    });

    test('should include WebSite schema', () => {
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      
      const websiteSchema = data['@graph'].find(item => item['@type'] === 'WebSite');
      expect(websiteSchema).toBeTruthy();
      expect(websiteSchema.name).toBe('John Doe Portfolio');
      expect(websiteSchema.url).toBe(window.location.origin);
    });

    test('should include sameAs links', () => {
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      
      const personSchema = data['@graph'].find(item => item['@type'] === 'Person');
      expect(personSchema.sameAs).toContain('https://linkedin.com/in/johndoe');
      expect(personSchema.sameAs).toContain('https://github.com/johndoe');
      expect(personSchema.sameAs).toContain('https://behance.net/johndoe');
    });

    test('should include skills in knowsAbout', () => {
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      
      const personSchema = data['@graph'].find(item => item['@type'] === 'Person');
      expect(personSchema.knowsAbout).toContain('AWS');
      expect(personSchema.knowsAbout).toContain('Python');
    });

    test('should include current employer', () => {
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      
      const personSchema = data['@graph'].find(item => item['@type'] === 'Person');
      expect(personSchema.worksFor).toBeTruthy();
      expect(personSchema.worksFor.name).toBe('Tech Corp');
    });
  });

  describe('Heading Hierarchy Validation', () => {
    test('should validate correct heading hierarchy', () => {
      const result = seoManager.validateHeadingHierarchy();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect multiple H1 tags', () => {
      document.body.innerHTML += '<h1>Another H1</h1>';
      
      const result = seoManager.validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Multiple H1 tags found');
    });

    test('should detect skipped heading levels', () => {
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h3>Skipped H2</h3>
      `;
      
      const result = seoManager.validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Heading level skipped');
    });

    test('should log validation results', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      seoManager.validateHeadingHierarchy();
      
      expect(consoleSpy).toHaveBeenCalledWith('✓ SEO: Heading hierarchy is valid');
      consoleSpy.mockRestore();
    });
  });

  describe('Utility Methods', () => {
    test('should truncate text correctly', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = seoManager.truncateText(longText, 20);
      expect(result).toBe('This is a very l...');
    });

    test('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = seoManager.truncateText(shortText, 20);
      expect(result).toBe('Short text');
    });

    test('should handle null text', () => {
      const result = seoManager.truncateText(null, 20);
      expect(result).toBeNull();
    });

    test('should generate keywords from portfolio data', () => {
      seoManager.portfolioData = mockPortfolioData;
      const keywords = seoManager.generateKeywords();
      
      expect(keywords).toContain('cloud');
      expect(keywords).toContain('aws');
      expect(keywords).toContain('python');
      expect(keywords).toContain('portfolio');
    });

    test('should get social media links', () => {
      const links = seoManager.getSameAsLinks(mockPortfolioData.personal.contact);
      expect(links).toContain('https://linkedin.com/in/johndoe');
      expect(links).toContain('https://github.com/johndoe');
      expect(links).toContain('https://behance.net/johndoe');
    });

    test('should get skills array', () => {
      seoManager.portfolioData = mockPortfolioData;
      const skills = seoManager.getSkillsArray();
      expect(skills).toContain('AWS');
      expect(skills).toContain('Python');
      expect(skills.length).toBeLessThanOrEqual(10);
    });
  });

  describe('SEO Status', () => {
    beforeEach(() => {
      seoManager.initialize(mockPortfolioData);
    });

    test('should return current SEO status', () => {
      const status = seoManager.getSEOStatus();
      
      expect(status.title).toBe('John Doe - Senior Cloud Engineer | Portfolio');
      expect(status.description).toContain('Experienced professional');
      expect(status.ogTitle).toBe('John Doe - Senior Cloud Engineer');
      expect(status.structuredData).toBeTruthy();
      expect(status.headingHierarchy.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed portfolio data', () => {
      const malformedData = {
        personal: {
          name: null,
          title: undefined,
          contact: {}
        }
      };
      
      expect(() => {
        seoManager.initialize(malformedData);
      }).not.toThrow();
    });

    test('should handle missing contact information', () => {
      const testData = {
        ...mockPortfolioData,
        personal: {
          ...mockPortfolioData.personal,
          contact: {}
        }
      };
      
      expect(() => {
        seoManager.initialize(testData);
      }).not.toThrow();
      
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      const personSchema = data['@graph'].find(item => item['@type'] === 'Person');
      
      expect(personSchema.sameAs).toHaveLength(0);
    });

    test('should handle empty skills array', () => {
      const testData = {
        ...mockPortfolioData,
        skills: []
      };
      
      expect(() => {
        seoManager.initialize(testData);
      }).not.toThrow();
    });

    test('should handle empty experience array', () => {
      const testData = {
        ...mockPortfolioData,
        experience: []
      };
      
      expect(() => {
        seoManager.initialize(testData);
      }).not.toThrow();
      
      const structuredDataScript = document.getElementById('structured-data');
      const data = JSON.parse(structuredDataScript.textContent);
      const personSchema = data['@graph'].find(item => item['@type'] === 'Person');
      
      expect(personSchema.worksFor).toBeNull();
    });
  });

  describe('Meta Tag Management', () => {
    test('should update existing meta tags', () => {
      // Add initial meta tag
      const initialMeta = document.createElement('meta');
      initialMeta.name = 'description';
      initialMeta.content = 'Initial description';
      document.head.appendChild(initialMeta);
      
      seoManager.updateMetaTag('description', 'Updated description');
      
      const metaTags = document.querySelectorAll('meta[name="description"]');
      expect(metaTags.length).toBe(1);
      expect(metaTags[0].content).toBe('Updated description');
    });

    test('should create new meta tags if they do not exist', () => {
      seoManager.updateMetaTag('new-tag', 'New content');
      
      const newMeta = document.querySelector('meta[name="new-tag"]');
      expect(newMeta).toBeTruthy();
      expect(newMeta.content).toBe('New content');
    });

    test('should replace existing Open Graph tags', () => {
      // Add initial OG tag
      const initialOG = document.createElement('meta');
      initialOG.setAttribute('property', 'og:title');
      initialOG.content = 'Initial title';
      document.head.appendChild(initialOG);
      
      seoManager.addMetaProperty('og:title', 'Updated title');
      
      const ogTags = document.querySelectorAll('meta[property="og:title"]');
      expect(ogTags.length).toBe(1);
      expect(ogTags[0].content).toBe('Updated title');
    });
  });
});

// Integration test for SEO with portfolio app
describe('SEO Integration', () => {
  test('should integrate with portfolio app initialization', async () => {
    // Mock portfolio data loading
    window.portfolioData = {
      getData: () => ({
        personal: {
          name: 'Test User',
          title: 'Test Title',
          bio: 'Test bio',
          summary: 'Test summary',
          contact: {
            email: 'test@example.com'
          }
        },
        experience: [],
        projects: [],
        skills: []
      })
    };
    
    // Mock SEO Manager
    const mockSEOManager = {
      initialize: jest.fn()
    };
    window.SEOManager = mockSEOManager;
    
    // Create app instance (simplified)
    const app = {
      initializeSEO() {
        if (window.SEOManager) {
          const portfolioData = window.portfolioData.getData();
          window.SEOManager.initialize(portfolioData);
        }
      }
    };
    
    app.initializeSEO();
    
    expect(mockSEOManager.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        personal: expect.objectContaining({
          name: 'Test User',
          title: 'Test Title'
        })
      })
    );
  });
});