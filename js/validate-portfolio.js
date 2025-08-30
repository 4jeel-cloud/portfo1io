/**
 * @fileoverview Script to validate the existing portfolio data
 * This script loads the portfolio.json file and validates it against our type definitions
 */

const fs = require('fs');
const path = require('path');
const PortfolioTypes = require('./types.js');

// Load portfolio data
const portfolioPath = path.join(__dirname, '../data/portfolio.json');

try {
  const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));
  
  console.log('Validating portfolio data from:', portfolioPath);
  console.log('=====================================\n');
  
  const validation = PortfolioTypes.validatePortfolioData(portfolioData);
  
  if (validation.isValid) {
    console.log('✓ Portfolio data is valid!');
    console.log('\nData structure summary:');
    console.log(`- Personal info: ${portfolioData.personal.name} (${portfolioData.personal.title})`);
    console.log(`- Experience entries: ${portfolioData.experience.length}`);
    console.log(`- Projects: ${portfolioData.projects.length}`);
    console.log(`- Skill categories: ${portfolioData.skills.length}`);
    
    // Count total skills
    const totalSkills = portfolioData.skills.reduce((total, category) => total + category.skills.length, 0);
    console.log(`- Total skills: ${totalSkills}`);
  } else {
    console.log('✗ Portfolio data validation failed!');
    console.log('\nErrors found:');
    validation.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
} catch (error) {
  console.error('Error loading or parsing portfolio data:', error.message);
  process.exit(1);
}