/**
 * @fileoverview Unit tests for portfolio data type validation
 * These tests validate the type checking and validation functions
 */

// Import the validation functions
let PortfolioTypes;
if (typeof require !== 'undefined') {
  // Node.js environment
  PortfolioTypes = require('./types.js');
} else {
  // Browser environment - assume types.js is already loaded
  PortfolioTypes = window.PortfolioTypes;
}

// Test utilities
const TestRunner = {
  tests: [],
  passed: 0,
  failed: 0,
  
  test(name, testFn) {
    this.tests.push({ name, testFn });
  },
  
  expect(actual) {
    return {
      toBe(expected) {
        if (actual === expected) {
          return { passed: true };
        }
        return { passed: false, message: `Expected ${expected}, got ${actual}` };
      },
      
      toEqual(expected) {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
          return { passed: true };
        }
        return { passed: false, message: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` };
      },
      
      toBeTrue() {
        return this.toBe(true);
      },
      
      toBeFalse() {
        return this.toBe(false);
      },
      
      toContain(expected) {
        if (Array.isArray(actual) && actual.includes(expected)) {
          return { passed: true };
        }
        if (typeof actual === 'string' && actual.includes(expected)) {
          return { passed: true };
        }
        return { passed: false, message: `Expected ${JSON.stringify(actual)} to contain ${expected}` };
      }
    };
  },
  
  run() {
    console.log('Running portfolio data validation tests...\n');
    
    this.tests.forEach(({ name, testFn }) => {
      try {
        const result = testFn();
        if (result.passed) {
          this.passed++;
          console.log(`✓ ${name}`);
        } else {
          this.failed++;
          console.log(`✗ ${name}: ${result.message}`);
        }
      } catch (error) {
        this.failed++;
        console.log(`✗ ${name}: ${error.message}`);
      }
    });
    
    console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }
};

// Test data
const validContactInfo = {
  email: 'test@example.com',
  linkedin: 'https://linkedin.com/in/test',
  github: 'https://github.com/test',
  behance: 'https://behance.net/test'
};

const validPersonalInfo = {
  name: 'John Doe',
  title: 'Software Engineer',
  bio: 'A passionate software engineer',
  summary: 'Experienced in web development',
  contact: validContactInfo,
  headshot: 'images/profile/headshot.jpg'
};

const validExperience = {
  id: 'exp1',
  company: 'Tech Corp',
  title: 'Senior Developer',
  duration: '2020-2023',
  achievements: ['Built awesome features', 'Led team of 5'],
  technologies: ['JavaScript', 'React']
};

const validProject = {
  id: 'proj1',
  title: 'Awesome Project',
  description: 'A really cool project',
  tools: ['React', 'Node.js'],
  outcomes: ['Increased efficiency by 50%', 'Reduced costs'],
  images: ['image1.jpg'],
  links: [{ name: 'GitHub', url: 'https://github.com/test/project' }]
};

const validSkill = {
  name: 'JavaScript',
  icon: 'js-icon',
  proficiency: 'expert'
};

const validSkillCategory = {
  category: 'Programming',
  skills: [validSkill]
};

const validPortfolioData = {
  personal: validPersonalInfo,
  experience: [validExperience],
  projects: [validProject],
  skills: [validSkillCategory]
};

// Email validation tests
TestRunner.test('isValidEmail - valid email', () => {
  return TestRunner.expect(PortfolioTypes.isValidEmail('test@example.com')).toBeTrue();
});

TestRunner.test('isValidEmail - invalid email', () => {
  return TestRunner.expect(PortfolioTypes.isValidEmail('invalid-email')).toBeFalse();
});

TestRunner.test('isValidEmail - empty string', () => {
  return TestRunner.expect(PortfolioTypes.isValidEmail('')).toBeFalse();
});

// URL validation tests
TestRunner.test('isValidUrl - valid HTTP URL', () => {
  return TestRunner.expect(PortfolioTypes.isValidUrl('http://example.com')).toBeTrue();
});

TestRunner.test('isValidUrl - valid HTTPS URL', () => {
  return TestRunner.expect(PortfolioTypes.isValidUrl('https://example.com')).toBeTrue();
});

TestRunner.test('isValidUrl - invalid URL', () => {
  return TestRunner.expect(PortfolioTypes.isValidUrl('not-a-url')).toBeFalse();
});

// Contact info validation tests
TestRunner.test('validateContactInfo - valid contact info', () => {
  const result = PortfolioTypes.validateContactInfo(validContactInfo);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validateContactInfo - missing email', () => {
  const invalidContact = { ...validContactInfo };
  delete invalidContact.email;
  const result = PortfolioTypes.validateContactInfo(invalidContact);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateContactInfo - invalid email', () => {
  const invalidContact = { ...validContactInfo, email: 'invalid-email' };
  const result = PortfolioTypes.validateContactInfo(invalidContact);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateContactInfo - invalid URL', () => {
  const invalidContact = { ...validContactInfo, github: 'not-a-url' };
  const result = PortfolioTypes.validateContactInfo(invalidContact);
  return TestRunner.expect(result.isValid).toBeFalse();
});

// Personal info validation tests
TestRunner.test('validatePersonalInfo - valid personal info', () => {
  const result = PortfolioTypes.validatePersonalInfo(validPersonalInfo);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validatePersonalInfo - missing name', () => {
  const invalidPersonal = { ...validPersonalInfo };
  delete invalidPersonal.name;
  const result = PortfolioTypes.validatePersonalInfo(invalidPersonal);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validatePersonalInfo - empty name', () => {
  const invalidPersonal = { ...validPersonalInfo, name: '' };
  const result = PortfolioTypes.validatePersonalInfo(invalidPersonal);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validatePersonalInfo - invalid contact', () => {
  const invalidPersonal = { 
    ...validPersonalInfo, 
    contact: { ...validContactInfo, email: 'invalid' }
  };
  const result = PortfolioTypes.validatePersonalInfo(invalidPersonal);
  return TestRunner.expect(result.isValid).toBeFalse();
});

// Experience validation tests
TestRunner.test('validateExperience - valid experience', () => {
  const result = PortfolioTypes.validateExperience(validExperience);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validateExperience - missing company', () => {
  const invalidExp = { ...validExperience };
  delete invalidExp.company;
  const result = PortfolioTypes.validateExperience(invalidExp);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateExperience - empty achievements', () => {
  const invalidExp = { ...validExperience, achievements: [] };
  const result = PortfolioTypes.validateExperience(invalidExp);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateExperience - invalid achievement type', () => {
  const invalidExp = { ...validExperience, achievements: ['valid', 123] };
  const result = PortfolioTypes.validateExperience(invalidExp);
  return TestRunner.expect(result.isValid).toBeFalse();
});

// Project validation tests
TestRunner.test('validateProject - valid project', () => {
  const result = PortfolioTypes.validateProject(validProject);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validateProject - missing title', () => {
  const invalidProject = { ...validProject };
  delete invalidProject.title;
  const result = PortfolioTypes.validateProject(invalidProject);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateProject - empty tools', () => {
  const invalidProject = { ...validProject, tools: [] };
  const result = PortfolioTypes.validateProject(invalidProject);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateProject - invalid link URL', () => {
  const invalidProject = { 
    ...validProject, 
    links: [{ name: 'GitHub', url: 'not-a-url' }]
  };
  const result = PortfolioTypes.validateProject(invalidProject);
  return TestRunner.expect(result.isValid).toBeFalse();
});

// Skill validation tests
TestRunner.test('validateSkill - valid skill', () => {
  const result = PortfolioTypes.validateSkill(validSkill);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validateSkill - missing name', () => {
  const invalidSkill = { ...validSkill };
  delete invalidSkill.name;
  const result = PortfolioTypes.validateSkill(invalidSkill);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateSkill - invalid proficiency', () => {
  const invalidSkill = { ...validSkill, proficiency: 'invalid-level' };
  const result = PortfolioTypes.validateSkill(invalidSkill);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateSkill - valid without optional fields', () => {
  const minimalSkill = { name: 'JavaScript' };
  const result = PortfolioTypes.validateSkill(minimalSkill);
  return TestRunner.expect(result.isValid).toBeTrue();
});

// Skill category validation tests
TestRunner.test('validateSkillCategory - valid skill category', () => {
  const result = PortfolioTypes.validateSkillCategory(validSkillCategory);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validateSkillCategory - missing category', () => {
  const invalidCategory = { ...validSkillCategory };
  delete invalidCategory.category;
  const result = PortfolioTypes.validateSkillCategory(invalidCategory);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateSkillCategory - empty skills', () => {
  const invalidCategory = { ...validSkillCategory, skills: [] };
  const result = PortfolioTypes.validateSkillCategory(invalidCategory);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validateSkillCategory - invalid skill in category', () => {
  const invalidCategory = { 
    ...validSkillCategory, 
    skills: [{ name: '' }] // Invalid skill with empty name
  };
  const result = PortfolioTypes.validateSkillCategory(invalidCategory);
  return TestRunner.expect(result.isValid).toBeFalse();
});

// Portfolio data validation tests
TestRunner.test('validatePortfolioData - valid portfolio data', () => {
  const result = PortfolioTypes.validatePortfolioData(validPortfolioData);
  return TestRunner.expect(result.isValid).toBeTrue();
});

TestRunner.test('validatePortfolioData - missing personal info', () => {
  const invalidData = { ...validPortfolioData };
  delete invalidData.personal;
  const result = PortfolioTypes.validatePortfolioData(invalidData);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validatePortfolioData - invalid experience array', () => {
  const invalidData = { ...validPortfolioData, experience: 'not-an-array' };
  const result = PortfolioTypes.validatePortfolioData(invalidData);
  return TestRunner.expect(result.isValid).toBeFalse();
});

TestRunner.test('validatePortfolioData - invalid project in array', () => {
  const invalidData = { 
    ...validPortfolioData, 
    projects: [{ ...validProject, title: '' }] // Invalid project
  };
  const result = PortfolioTypes.validatePortfolioData(invalidData);
  return TestRunner.expect(result.isValid).toBeFalse();
});

// Required fields validation tests
TestRunner.test('hasRequiredFields - valid object', () => {
  const obj = { name: 'test', email: 'test@example.com' };
  const result = PortfolioTypes.hasRequiredFields(obj, ['name', 'email']);
  return TestRunner.expect(result).toBeTrue();
});

TestRunner.test('hasRequiredFields - missing field', () => {
  const obj = { name: 'test' };
  const result = PortfolioTypes.hasRequiredFields(obj, ['name', 'email']);
  return TestRunner.expect(result).toBeFalse();
});

TestRunner.test('hasRequiredFields - null value', () => {
  const obj = { name: 'test', email: null };
  const result = PortfolioTypes.hasRequiredFields(obj, ['name', 'email']);
  return TestRunner.expect(result).toBeFalse();
});

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  TestRunner.run();
} else if (typeof window !== 'undefined') {
  // Browser environment - expose test runner
  window.PortfolioTestRunner = TestRunner;
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestRunner;
}