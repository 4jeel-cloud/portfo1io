// Portfolio data management with validation
class PortfolioData {
  constructor() {
    this.data = null;
    this.isLoaded = false;
    this.validationErrors = [];
  }

  async loadData() {
    try {
      const response = await fetch('data/portfolio.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      
      // Validate the loaded data
      if (window.PortfolioTypes) {
        const validation = window.PortfolioTypes.validatePortfolioData(rawData);
        if (validation.isValid) {
          console.log('✓ Portfolio data validation passed');
          this.data = rawData;
          this.validationErrors = [];
        } else {
          console.warn('⚠ Portfolio data validation failed:', validation.errors);
          this.validationErrors = validation.errors;
          // Use the data anyway but log warnings
          this.data = rawData;
        }
      } else {
        console.warn('⚠ Portfolio validation types not loaded, skipping validation');
        this.data = rawData;
      }
      
      this.isLoaded = true;
      return this.data;
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      // Return fallback data
      this.data = this.getFallbackData();
      this.isLoaded = true;
      return this.data;
    }
  }

  getFallbackData() {
    return {
      personal: {
        name: "Your Name",
        title: "Cloud Engineer & Cybersecurity Professional",
        bio: "Passionate about cloud engineering and cybersecurity with a focus on building secure, scalable solutions.",
        summary: "Experienced professional specializing in Cloud, Cybersecurity, AI, and API development. Dedicated to creating innovative solutions that drive business success.",
        contact: {
          email: "your.email@example.com",
          linkedin: "https://linkedin.com/in/yourprofile",
          github: "https://github.com/yourusername",
          behance: "https://behance.net/yourprofile"
        },
        headshot: "images/profile/headshot.jpg"
      },
      experience: [
        {
          id: "exp1",
          company: "Tech Company",
          title: "Senior Cloud Engineer",
          duration: "2022 - Present",
          achievements: [
            "Led cloud migration projects reducing costs by 30%",
            "Implemented security best practices across infrastructure",
            "Mentored junior developers on cloud technologies"
          ],
          technologies: ["AWS", "Docker", "Kubernetes", "Python"]
        }
      ],
      projects: [
        {
          id: "proj1",
          title: "Cloud Security Platform",
          description: "A comprehensive security monitoring platform for cloud infrastructure.",
          tools: ["AWS", "Python", "React", "Docker"],
          outcomes: [
            "Reduced security incidents by 40%",
            "Automated threat detection and response"
          ],
          images: ["images/projects/project1.jpg"],
          links: [
            { name: "GitHub", url: "https://github.com/yourusername/project" },
            { name: "Live Demo", url: "https://yourproject.com" }
          ]
        }
      ],
      skills: [
        {
          category: "Cloud",
          skills: [
            { name: "AWS", proficiency: "expert" },
            { name: "Azure", proficiency: "advanced" },
            { name: "Docker", proficiency: "expert" },
            { name: "Kubernetes", proficiency: "advanced" }
          ]
        },
        {
          category: "Cybersecurity",
          skills: [
            { name: "Security Auditing", proficiency: "expert" },
            { name: "Penetration Testing", proficiency: "advanced" },
            { name: "Compliance", proficiency: "advanced" }
          ]
        },
        {
          category: "Programming",
          skills: [
            { name: "Python", proficiency: "expert" },
            { name: "JavaScript", proficiency: "advanced" },
            { name: "Go", proficiency: "intermediate" }
          ]
        },
        {
          category: "Design",
          skills: [
            { name: "UI/UX Design", proficiency: "intermediate" },
            { name: "Figma", proficiency: "intermediate" }
          ]
        }
      ]
    };
  }

  getData() {
    return this.data;
  }

  getPersonalInfo() {
    return this.data?.personal || {};
  }

  getExperience() {
    return this.data?.experience || [];
  }

  getProjects() {
    return this.data?.projects || [];
  }

  getSkills() {
    return this.data?.skills || [];
  }

  getValidationErrors() {
    return this.validationErrors;
  }

  isDataValid() {
    return this.validationErrors.length === 0;
  }

  /**
   * Validates a specific data section
   * @param {string} section - The section to validate ('personal', 'experience', 'projects', 'skills')
   * @returns {{isValid: boolean, errors: string[]}} Validation result
   */
  validateSection(section) {
    if (!window.PortfolioTypes) {
      return { isValid: true, errors: ['Validation types not loaded'] };
    }

    switch (section) {
      case 'personal':
        return window.PortfolioTypes.validatePersonalInfo(this.getPersonalInfo());
      case 'experience':
        const expErrors = [];
        this.getExperience().forEach((exp, index) => {
          const validation = window.PortfolioTypes.validateExperience(exp);
          if (!validation.isValid) {
            expErrors.push(`Experience ${index}: ${validation.errors.join(', ')}`);
          }
        });
        return { isValid: expErrors.length === 0, errors: expErrors };
      case 'projects':
        const projErrors = [];
        this.getProjects().forEach((proj, index) => {
          const validation = window.PortfolioTypes.validateProject(proj);
          if (!validation.isValid) {
            projErrors.push(`Project ${index}: ${validation.errors.join(', ')}`);
          }
        });
        return { isValid: projErrors.length === 0, errors: projErrors };
      case 'skills':
        const skillErrors = [];
        this.getSkills().forEach((skillCat, index) => {
          const validation = window.PortfolioTypes.validateSkillCategory(skillCat);
          if (!validation.isValid) {
            skillErrors.push(`Skill category ${index}: ${validation.errors.join(', ')}`);
          }
        });
        return { isValid: skillErrors.length === 0, errors: skillErrors };
      default:
        return { isValid: false, errors: [`Unknown section: ${section}`] };
    }
  }
}

// Create global instance
window.portfolioData = new PortfolioData();