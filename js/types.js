/**
 * @fileoverview Type definitions and validation utilities for portfolio data
 * This file contains JSDoc type definitions and validation functions for the portfolio data structure
 */

/**
 * @typedef {Object} ContactInfo
 * @property {string} email - Email address
 * @property {string} linkedin - LinkedIn profile URL
 * @property {string} github - GitHub profile URL
 * @property {string} behance - Behance profile URL
 */

/**
 * @typedef {Object} PersonalInfo
 * @property {string} name - Full name
 * @property {string} title - Professional title
 * @property {string} bio - Personal biography
 * @property {string} summary - Professional summary
 * @property {ContactInfo} contact - Contact information
 * @property {string} [headshot] - Optional headshot image path
 */

/**
 * @typedef {Object} Experience
 * @property {string} id - Unique identifier
 * @property {string} company - Company name
 * @property {string} title - Job title
 * @property {string} duration - Employment duration
 * @property {string[]} achievements - List of achievements
 * @property {string[]} [technologies] - Optional list of technologies used
 */

/**
 * @typedef {Object} ProjectLink
 * @property {string} name - Link display name
 * @property {string} url - Link URL
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {string[]} tools - Tools and technologies used
 * @property {string[]} outcomes - Project outcomes and achievements
 * @property {string[]} [images] - Optional project images
 * @property {ProjectLink[]} [links] - Optional project links
 */

/**
 * @typedef {Object} Skill
 * @property {string} name - Skill name
 * @property {string} [icon] - Optional icon identifier
 * @property {string} [proficiency] - Optional proficiency level
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} category - Category name
 * @property {Skill[]} skills - Skills in this category
 */

/**
 * @typedef {Object} PortfolioData
 * @property {PersonalInfo} personal - Personal information
 * @property {Experience[]} experience - Work experience
 * @property {Project[]} projects - Projects portfolio
 * @property {SkillCategory[]} skills - Skills organized by category
 */

// Validation constants
const VALIDATION_CONSTANTS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  REQUIRED_PERSONAL_FIELDS: ['name', 'title', 'bio', 'summary', 'contact'],
  REQUIRED_CONTACT_FIELDS: ['email', 'linkedin', 'github', 'behance'],
  REQUIRED_EXPERIENCE_FIELDS: ['id', 'company', 'title', 'duration', 'achievements'],
  REQUIRED_PROJECT_FIELDS: ['id', 'title', 'description', 'tools', 'outcomes'],
  REQUIRED_SKILL_FIELDS: ['name'],
  REQUIRED_SKILL_CATEGORY_FIELDS: ['category', 'skills'],
  PROFICIENCY_LEVELS: ['beginner', 'intermediate', 'advanced', 'expert']
};

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
  return typeof email === 'string' && VALIDATION_CONSTANTS.EMAIL_REGEX.test(email);
}

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(url) {
  return typeof url === 'string' && VALIDATION_CONSTANTS.URL_REGEX.test(url);
}

/**
 * Validates that an object has all required fields
 * @param {Object} obj - Object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {boolean} True if all required fields are present
 */
function hasRequiredFields(obj, requiredFields) {
  if (!obj || typeof obj !== 'object') return false;
  return requiredFields.every(field => obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined);
}

/**
 * Validates contact information
 * @param {ContactInfo} contact - Contact info to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateContactInfo(contact) {
  const errors = [];
  
  if (!hasRequiredFields(contact, VALIDATION_CONSTANTS.REQUIRED_CONTACT_FIELDS)) {
    errors.push('Contact info missing required fields');
    return { isValid: false, errors };
  }
  
  if (!isValidEmail(contact.email)) {
    errors.push('Invalid email address');
  }
  
  ['linkedin', 'github', 'behance'].forEach(field => {
    if (!isValidUrl(contact[field])) {
      errors.push(`Invalid ${field} URL`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates personal information
 * @param {PersonalInfo} personal - Personal info to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validatePersonalInfo(personal) {
  const errors = [];
  
  if (!hasRequiredFields(personal, VALIDATION_CONSTANTS.REQUIRED_PERSONAL_FIELDS)) {
    errors.push('Personal info missing required fields');
    return { isValid: false, errors };
  }
  
  // Validate string fields are not empty
  ['name', 'title', 'bio', 'summary'].forEach(field => {
    if (typeof personal[field] !== 'string' || personal[field].trim() === '') {
      errors.push(`${field} must be a non-empty string`);
    }
  });
  
  // Validate contact info
  const contactValidation = validateContactInfo(personal.contact);
  if (!contactValidation.isValid) {
    errors.push(...contactValidation.errors);
  }
  
  // Validate optional headshot
  if (personal.headshot && typeof personal.headshot !== 'string') {
    errors.push('Headshot must be a string');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates experience entry
 * @param {Experience} experience - Experience to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateExperience(experience) {
  const errors = [];
  
  if (!hasRequiredFields(experience, VALIDATION_CONSTANTS.REQUIRED_EXPERIENCE_FIELDS)) {
    errors.push('Experience missing required fields');
    return { isValid: false, errors };
  }
  
  // Validate string fields
  ['id', 'company', 'title', 'duration'].forEach(field => {
    if (typeof experience[field] !== 'string' || experience[field].trim() === '') {
      errors.push(`${field} must be a non-empty string`);
    }
  });
  
  // Validate achievements array
  if (!Array.isArray(experience.achievements) || experience.achievements.length === 0) {
    errors.push('Achievements must be a non-empty array');
  } else {
    experience.achievements.forEach((achievement, index) => {
      if (typeof achievement !== 'string' || achievement.trim() === '') {
        errors.push(`Achievement ${index} must be a non-empty string`);
      }
    });
  }
  
  // Validate optional technologies array
  if (experience.technologies) {
    if (!Array.isArray(experience.technologies)) {
      errors.push('Technologies must be an array');
    } else {
      experience.technologies.forEach((tech, index) => {
        if (typeof tech !== 'string' || tech.trim() === '') {
          errors.push(`Technology ${index} must be a non-empty string`);
        }
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates project entry
 * @param {Project} project - Project to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateProject(project) {
  const errors = [];
  
  if (!hasRequiredFields(project, VALIDATION_CONSTANTS.REQUIRED_PROJECT_FIELDS)) {
    errors.push('Project missing required fields');
    return { isValid: false, errors };
  }
  
  // Validate string fields
  ['id', 'title', 'description'].forEach(field => {
    if (typeof project[field] !== 'string' || project[field].trim() === '') {
      errors.push(`${field} must be a non-empty string`);
    }
  });
  
  // Validate tools array
  if (!Array.isArray(project.tools) || project.tools.length === 0) {
    errors.push('Tools must be a non-empty array');
  } else {
    project.tools.forEach((tool, index) => {
      if (typeof tool !== 'string' || tool.trim() === '') {
        errors.push(`Tool ${index} must be a non-empty string`);
      }
    });
  }
  
  // Validate outcomes array
  if (!Array.isArray(project.outcomes) || project.outcomes.length === 0) {
    errors.push('Outcomes must be a non-empty array');
  } else {
    project.outcomes.forEach((outcome, index) => {
      if (typeof outcome !== 'string' || outcome.trim() === '') {
        errors.push(`Outcome ${index} must be a non-empty string`);
      }
    });
  }
  
  // Validate optional images array
  if (project.images) {
    if (!Array.isArray(project.images)) {
      errors.push('Images must be an array');
    } else {
      project.images.forEach((image, index) => {
        if (typeof image !== 'string' || image.trim() === '') {
          errors.push(`Image ${index} must be a non-empty string`);
        }
      });
    }
  }
  
  // Validate optional links array
  if (project.links) {
    if (!Array.isArray(project.links)) {
      errors.push('Links must be an array');
    } else {
      project.links.forEach((link, index) => {
        if (!link || typeof link !== 'object') {
          errors.push(`Link ${index} must be an object`);
        } else {
          if (!link.name || typeof link.name !== 'string' || link.name.trim() === '') {
            errors.push(`Link ${index} name must be a non-empty string`);
          }
          if (!isValidUrl(link.url)) {
            errors.push(`Link ${index} URL is invalid`);
          }
        }
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates skill entry
 * @param {Skill} skill - Skill to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateSkill(skill) {
  const errors = [];
  
  if (!hasRequiredFields(skill, VALIDATION_CONSTANTS.REQUIRED_SKILL_FIELDS)) {
    errors.push('Skill missing required fields');
    return { isValid: false, errors };
  }
  
  if (typeof skill.name !== 'string' || skill.name.trim() === '') {
    errors.push('Skill name must be a non-empty string');
  }
  
  // Validate optional icon
  if (skill.icon && (typeof skill.icon !== 'string' || skill.icon.trim() === '')) {
    errors.push('Skill icon must be a non-empty string');
  }
  
  // Validate optional proficiency
  if (skill.proficiency) {
    if (typeof skill.proficiency !== 'string' || !VALIDATION_CONSTANTS.PROFICIENCY_LEVELS.includes(skill.proficiency)) {
      errors.push(`Skill proficiency must be one of: ${VALIDATION_CONSTANTS.PROFICIENCY_LEVELS.join(', ')}`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates skill category
 * @param {SkillCategory} skillCategory - Skill category to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateSkillCategory(skillCategory) {
  const errors = [];
  
  if (!hasRequiredFields(skillCategory, VALIDATION_CONSTANTS.REQUIRED_SKILL_CATEGORY_FIELDS)) {
    errors.push('Skill category missing required fields');
    return { isValid: false, errors };
  }
  
  if (typeof skillCategory.category !== 'string' || skillCategory.category.trim() === '') {
    errors.push('Category name must be a non-empty string');
  }
  
  if (!Array.isArray(skillCategory.skills) || skillCategory.skills.length === 0) {
    errors.push('Skills must be a non-empty array');
  } else {
    skillCategory.skills.forEach((skill, index) => {
      const skillValidation = validateSkill(skill);
      if (!skillValidation.isValid) {
        errors.push(`Skill ${index}: ${skillValidation.errors.join(', ')}`);
      }
    });
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates complete portfolio data
 * @param {PortfolioData} portfolioData - Portfolio data to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validatePortfolioData(portfolioData) {
  const errors = [];
  
  if (!portfolioData || typeof portfolioData !== 'object') {
    errors.push('Portfolio data must be an object');
    return { isValid: false, errors };
  }
  
  // Validate personal info
  if (!portfolioData.personal) {
    errors.push('Personal information is required');
  } else {
    const personalValidation = validatePersonalInfo(portfolioData.personal);
    if (!personalValidation.isValid) {
      errors.push(`Personal info: ${personalValidation.errors.join(', ')}`);
    }
  }
  
  // Validate experience array
  if (!Array.isArray(portfolioData.experience)) {
    errors.push('Experience must be an array');
  } else {
    portfolioData.experience.forEach((exp, index) => {
      const expValidation = validateExperience(exp);
      if (!expValidation.isValid) {
        errors.push(`Experience ${index}: ${expValidation.errors.join(', ')}`);
      }
    });
  }
  
  // Validate projects array
  if (!Array.isArray(portfolioData.projects)) {
    errors.push('Projects must be an array');
  } else {
    portfolioData.projects.forEach((project, index) => {
      const projectValidation = validateProject(project);
      if (!projectValidation.isValid) {
        errors.push(`Project ${index}: ${projectValidation.errors.join(', ')}`);
      }
    });
  }
  
  // Validate skills array
  if (!Array.isArray(portfolioData.skills)) {
    errors.push('Skills must be an array');
  } else {
    portfolioData.skills.forEach((skillCategory, index) => {
      const skillCategoryValidation = validateSkillCategory(skillCategory);
      if (!skillCategoryValidation.isValid) {
        errors.push(`Skill category ${index}: ${skillCategoryValidation.errors.join(', ')}`);
      }
    });
  }
  
  return { isValid: errors.length === 0, errors };
}

// Export functions and constants for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    VALIDATION_CONSTANTS,
    validatePortfolioData,
    validatePersonalInfo,
    validateExperience,
    validateProject,
    validateSkill,
    validateSkillCategory,
    validateContactInfo,
    isValidEmail,
    isValidUrl,
    hasRequiredFields
  };
} else {
  // Browser environment
  window.PortfolioTypes = {
    VALIDATION_CONSTANTS,
    validatePortfolioData,
    validatePersonalInfo,
    validateExperience,
    validateProject,
    validateSkill,
    validateSkillCategory,
    validateContactInfo,
    isValidEmail,
    isValidUrl,
    hasRequiredFields
  };
}