// SEO optimization and meta data management
class SEOManager {
  constructor() {
    this.defaultTitle = 'Professional Portfolio - Cloud Engineer & Cybersecurity Professional';
    this.defaultDescription = 'Professional portfolio showcasing cloud engineering, cybersecurity, and API development expertise';
    this.defaultImage = 'images/profile/headshot.svg';
    this.siteUrl = '';
    this.structuredDataId = 'structured-data';
  }

  /**
   * Initialize SEO optimization with portfolio data
   * @param {Object} portfolioData - The portfolio data object
   */
  initialize(portfolioData) {
    if (typeof document === 'undefined') {
      console.warn('SEO: Document not available, initialization skipped');
      return;
    }

    if (!portfolioData || !portfolioData.personal) {
      console.warn('SEO: Portfolio data not available, using defaults');
      this.updateBasicMeta();
      return;
    }

    this.portfolioData = portfolioData;
    this.siteUrl = window.location ? window.location.origin : '';
    this.updateDynamicMeta();
    this.addOpenGraphTags();
    this.addTwitterCardTags();
    this.addStructuredData();
    this.validateHeadingHierarchy();
    
    console.log('✓ SEO optimization initialized');
  }

  /**
   * Update basic meta tags with default values
   */
  updateBasicMeta() {
    if (typeof document === 'undefined') {
      console.warn('SEO: Document not available, skipping meta tag updates');
      return;
    }
    this.updateMetaTag('description', this.defaultDescription);
    this.updateTitle(this.defaultTitle);
  }

  /**
   * Update meta tags dynamically based on portfolio data
   */
  updateDynamicMeta() {
    const { personal } = this.portfolioData;
    
    // Dynamic title based on name and title
    const dynamicTitle = `${personal.name} - ${personal.title} | Portfolio`;
    this.updateTitle(dynamicTitle);
    
    // Dynamic description based on summary or bio
    const dynamicDescription = personal.summary || personal.bio || this.defaultDescription;
    const truncatedDescription = this.truncateText(dynamicDescription, 160);
    this.updateMetaTag('description', truncatedDescription);
    
    // Update author meta tag
    this.updateMetaTag('author', personal.name);
    
    // Update keywords based on skills and experience
    const keywords = this.generateKeywords();
    this.updateMetaTag('keywords', keywords);
  }

  /**
   * Add Open Graph tags for social media sharing
   */
  addOpenGraphTags() {
    const { personal } = this.portfolioData;
    
    // Basic Open Graph tags
    this.addMetaProperty('og:type', 'profile');
    this.addMetaProperty('og:title', `${personal.name} - ${personal.title}`);
    this.addMetaProperty('og:description', this.truncateText(personal.summary || personal.bio, 200));
    this.addMetaProperty('og:url', this.siteUrl);
    this.addMetaProperty('og:site_name', `${personal.name} Portfolio`);
    
    // Profile-specific Open Graph tags
    this.addMetaProperty('profile:first_name', personal.name.split(' ')[0]);
    this.addMetaProperty('profile:last_name', personal.name.split(' ').slice(1).join(' '));
    
    // Image for social sharing
    const imageUrl = personal.headshot ? 
      `${this.siteUrl}/${personal.headshot}` : 
      `${this.siteUrl}/${this.defaultImage}`;
    this.addMetaProperty('og:image', imageUrl);
    this.addMetaProperty('og:image:alt', `Professional headshot of ${personal.name}`);
    this.addMetaProperty('og:image:width', '400');
    this.addMetaProperty('og:image:height', '400');
  }

  /**
   * Add Twitter Card tags for Twitter sharing
   */
  addTwitterCardTags() {
    const { personal } = this.portfolioData;
    
    this.addMetaName('twitter:card', 'summary');
    this.addMetaName('twitter:title', `${personal.name} - ${personal.title}`);
    this.addMetaName('twitter:description', this.truncateText(personal.summary || personal.bio, 200));
    
    const imageUrl = personal.headshot ? 
      `${this.siteUrl}/${personal.headshot}` : 
      `${this.siteUrl}/${this.defaultImage}`;
    this.addMetaName('twitter:image', imageUrl);
    this.addMetaName('twitter:image:alt', `Professional headshot of ${personal.name}`);
  }

  /**
   * Add structured data markup for professional information
   */
  addStructuredData() {
    const { personal, experience, skills } = this.portfolioData;
    
    // Create Person schema
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": personal.name,
      "jobTitle": personal.title,
      "description": personal.bio,
      "url": this.siteUrl,
      "sameAs": this.getSameAsLinks(personal.contact),
      "knowsAbout": this.getSkillsArray(),
      "worksFor": this.getCurrentEmployer(experience)
    };

    // Add image if available
    if (personal.headshot) {
      personSchema.image = `${this.siteUrl}/${personal.headshot}`;
    }

    // Add contact information
    if (personal.contact.email) {
      personSchema.email = personal.contact.email;
    }

    // Create WebSite schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": `${personal.name} Portfolio`,
      "description": personal.summary || personal.bio,
      "url": this.siteUrl,
      "author": {
        "@type": "Person",
        "name": personal.name
      }
    };

    // Combine schemas
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [personSchema, websiteSchema]
    };

    // Add to page
    this.addStructuredDataScript(structuredData);
  }

  /**
   * Validate heading hierarchy for SEO best practices
   */
  validateHeadingHierarchy() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hierarchy = [];
    let errors = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      hierarchy.push({ element: heading, level, index });
    });

    // Check for multiple H1s
    const h1Count = hierarchy.filter(h => h.level === 1).length;
    if (h1Count > 1) {
      errors.push(`Multiple H1 tags found (${h1Count}). Should have only one H1 per page.`);
    }

    // Check for skipped levels
    for (let i = 1; i < hierarchy.length; i++) {
      const current = hierarchy[i];
      const previous = hierarchy[i - 1];
      
      if (current.level > previous.level + 1) {
        errors.push(`Heading level skipped: H${previous.level} followed by H${current.level} at position ${i + 1}`);
      }
    }

    if (errors.length > 0) {
      console.warn('SEO: Heading hierarchy issues found:', errors);
    } else {
      console.log('✓ SEO: Heading hierarchy is valid');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Generate keywords from portfolio data
   */
  generateKeywords() {
    const { personal, skills, experience } = this.portfolioData;
    const keywords = new Set();

    // Add title keywords
    personal.title.split(/[,&\s]+/).forEach(word => {
      if (word.length > 2) keywords.add(word.toLowerCase());
    });

    // Add skill keywords
    skills.forEach(category => {
      keywords.add(category.category.toLowerCase());
      category.skills.forEach(skill => {
        keywords.add(skill.name.toLowerCase());
      });
    });

    // Add technology keywords from experience
    experience.forEach(exp => {
      if (exp.technologies) {
        exp.technologies.forEach(tech => keywords.add(tech.toLowerCase()));
      }
    });

    // Add common professional keywords
    ['portfolio', 'professional', 'developer', 'engineer'].forEach(word => {
      keywords.add(word);
    });

    return Array.from(keywords).slice(0, 20).join(', ');
  }

  /**
   * Get social media links for sameAs property
   */
  getSameAsLinks(contact) {
    const links = [];
    if (contact.linkedin) links.push(contact.linkedin);
    if (contact.github) links.push(contact.github);
    if (contact.behance) links.push(contact.behance);
    return links;
  }

  /**
   * Get skills array for knowsAbout property
   */
  getSkillsArray() {
    return this.portfolioData.skills.flatMap(category => 
      category.skills.map(skill => skill.name)
    ).slice(0, 10); // Limit to top 10 skills
  }

  /**
   * Get current employer from experience
   */
  getCurrentEmployer(experience) {
    if (!experience || experience.length === 0) return null;
    
    const currentJob = experience.find(exp => 
      exp.duration.toLowerCase().includes('present') || 
      exp.duration.toLowerCase().includes('current')
    ) || experience[0];

    return {
      "@type": "Organization",
      "name": currentJob.company
    };
  }

  /**
   * Utility methods for meta tag management
   */
  updateTitle(title) {
    document.title = title;
  }

  updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  addMetaProperty(property, content) {
    // Remove existing tag if it exists
    const existing = document.querySelector(`meta[property="${property}"]`);
    if (existing) existing.remove();

    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.content = content;
    document.head.appendChild(meta);
  }

  addMetaName(name, content) {
    // Remove existing tag if it exists
    const existing = document.querySelector(`meta[name="${name}"]`);
    if (existing) existing.remove();

    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  addStructuredDataScript(data) {
    // Remove existing structured data if it exists
    const existing = document.getElementById(this.structuredDataId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = this.structuredDataId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3).trim() + '...';
  }

  /**
   * Get current SEO status for debugging
   */
  getSEOStatus() {
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      keywords: document.querySelector('meta[name="keywords"]')?.content,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      ogDescription: document.querySelector('meta[property="og:description"]')?.content,
      structuredData: document.getElementById(this.structuredDataId)?.textContent,
      headingHierarchy: this.validateHeadingHierarchy()
    };
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  try {
    window.SEOManager = new SEOManager();
    console.log('✓ SEO Manager created and available globally');
  } catch (error) {
    console.error('❌ Failed to create SEO Manager:', error);
    console.error('Error details:', error.stack);
  }
} else {
  console.warn('⚠️ Window object not available, SEO Manager not created');
}