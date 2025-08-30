// SEO Implementation Validation Script
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating SEO Implementation...\n');

// Test results tracking
let passedTests = 0;
let failedTests = 0;
const results = [];

function test(description, condition, details = '') {
  if (condition) {
    console.log(`✓ ${description}`);
    results.push({ status: 'PASS', description, details });
    passedTests++;
  } else {
    console.log(`✗ ${description}`);
    if (details) console.log(`  ${details}`);
    results.push({ status: 'FAIL', description, details });
    failedTests++;
  }
}

// 1. Check if SEO files exist
console.log('📁 File Structure Tests:');
test('SEO JavaScript file exists', fs.existsSync('js/seo.js'));
test('SEO test file exists', fs.existsSync('js/seo.test.js'));
test('SEO test HTML file exists', fs.existsSync('test-seo.html'));

// 2. Check SEO integration in main files
console.log('\n🔗 Integration Tests:');

const mainJsContent = fs.readFileSync('js/main.js', 'utf8');
test('SEO initialization method exists in main.js', 
  mainJsContent.includes('initializeSEO'),
  'initializeSEO method should be defined in App class');

test('SEO initialization called in main.js', 
  mainJsContent.includes('this.initializeSEO()'),
  'initializeSEO should be called during app initialization');

const indexHtmlContent = fs.readFileSync('index.html', 'utf8');
test('SEO script included in index.html', 
  indexHtmlContent.includes('js/seo.js'),
  'SEO script should be loaded before main.js');

test('SEO script loaded before main.js', 
  indexHtmlContent.indexOf('js/seo.js') < indexHtmlContent.indexOf('js/main.js'),
  'SEO script must be loaded before main.js for proper initialization');

// 3. Check basic meta tags in HTML
console.log('\n🏷️ Basic Meta Tags Tests:');
test('HTML has viewport meta tag', indexHtmlContent.includes('name="viewport"'));
test('HTML has description meta tag', indexHtmlContent.includes('name="description"'));
test('HTML has author meta tag', indexHtmlContent.includes('name="author"'));
test('HTML has keywords meta tag', indexHtmlContent.includes('name="keywords"'));
test('HTML has proper lang attribute', indexHtmlContent.includes('lang="en"'));

// 4. Check heading hierarchy in HTML
console.log('\n📝 Heading Hierarchy Tests:');
const h1Matches = indexHtmlContent.match(/<h1[^>]*>/g) || [];
test('Only one H1 tag in HTML', 
  h1Matches.length === 1,
  `Found ${h1Matches.length} H1 tags, should be exactly 1`);

const h2Matches = indexHtmlContent.match(/<h2[^>]*>/g) || [];
test('Multiple H2 tags for sections', 
  h2Matches.length >= 5,
  `Found ${h2Matches.length} H2 tags, should have at least 5 for main sections`);

// 5. Check SEO JavaScript implementation
console.log('\n⚙️ SEO Implementation Tests:');
const seoJsContent = fs.readFileSync('js/seo.js', 'utf8');

test('SEO Manager class exists', seoJsContent.includes('class SEOManager'));
test('Initialize method exists', seoJsContent.includes('initialize(portfolioData)'));
test('Open Graph implementation exists', seoJsContent.includes('addOpenGraphTags'));
test('Twitter Card implementation exists', seoJsContent.includes('addTwitterCardTags'));
test('Structured data implementation exists', seoJsContent.includes('addStructuredData'));
test('Heading hierarchy validation exists', seoJsContent.includes('validateHeadingHierarchy'));

// Check for specific SEO features
test('Dynamic title update implemented', seoJsContent.includes('updateTitle'));
test('Meta description update implemented', seoJsContent.includes('updateMetaTag'));
test('Keywords generation implemented', seoJsContent.includes('generateKeywords'));
test('Text truncation utility exists', seoJsContent.includes('truncateText'));

// 6. Check structured data schema implementation
console.log('\n🏗️ Structured Data Tests:');
test('Person schema implementation', seoJsContent.includes('"@type": "Person"'));
test('WebSite schema implementation', seoJsContent.includes('"@type": "WebSite"'));
test('Schema.org context used', seoJsContent.includes('https://schema.org'));
test('SameAs links implementation', seoJsContent.includes('getSameAsLinks'));
test('Skills mapping implementation', seoJsContent.includes('getSkillsArray'));

// 7. Check test coverage
console.log('\n🧪 Test Coverage Tests:');
const seoTestContent = fs.readFileSync('js/seo.test.js', 'utf8');

test('SEO Manager tests exist', seoTestContent.includes('describe(\'SEO Manager\''));
test('Initialization tests exist', seoTestContent.includes('describe(\'Initialization\''));
test('Meta tags tests exist', seoTestContent.includes('Dynamic Meta Tags'));
test('Open Graph tests exist', seoTestContent.includes('Open Graph Tags'));
test('Twitter Card tests exist', seoTestContent.includes('Twitter Card Tags'));
test('Structured data tests exist', seoTestContent.includes('Structured Data'));
test('Heading hierarchy tests exist', seoTestContent.includes('Heading Hierarchy'));
test('Error handling tests exist', seoTestContent.includes('Error Handling'));

// 8. Check requirements coverage
console.log('\n📋 Requirements Coverage Tests:');

// Requirement 1.1: Dynamic page titles and meta descriptions
test('Dynamic page titles implemented', 
  seoJsContent.includes('updateTitle') && seoJsContent.includes('dynamicTitle'),
  'Should update page title based on portfolio data');

test('Dynamic meta descriptions implemented', 
  seoJsContent.includes('updateMetaTag') && seoJsContent.includes('dynamicDescription'),
  'Should update meta description based on portfolio data');

// Requirement 3.4: Open Graph tags for social media sharing
test('Open Graph tags implemented', 
  seoJsContent.includes('og:title') && seoJsContent.includes('og:description'),
  'Should include comprehensive Open Graph tags');

// Requirement 4.2: Proper heading hierarchy and semantic structure
test('Heading hierarchy validation implemented', 
  seoJsContent.includes('validateHeadingHierarchy') && seoJsContent.includes('skipped'),
  'Should validate and report heading hierarchy issues');

// Requirement 8.4: Structured data markup for professional information
test('Professional structured data implemented', 
  seoJsContent.includes('Person') && seoJsContent.includes('jobTitle'),
  'Should include professional information in structured data');

// 9. Check accessibility and semantic HTML
console.log('\n♿ Accessibility Tests:');
test('Semantic HTML sections used', indexHtmlContent.includes('<section'));
test('ARIA labels present', indexHtmlContent.includes('aria-label'));
test('Skip link implemented', indexHtmlContent.includes('skip-link'));
test('Role attributes used', indexHtmlContent.includes('role='));

// 10. Performance considerations
console.log('\n⚡ Performance Tests:');
test('Preload critical resources', indexHtmlContent.includes('rel="preload"'));
test('Lazy loading implemented', indexHtmlContent.includes('loading="lazy"'));
test('Efficient meta tag management', 
  seoJsContent.includes('existing') && seoJsContent.includes('remove'),
  'Should efficiently manage existing meta tags');

// Summary
console.log('\n📊 Test Summary:');
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 All SEO implementation tests passed!');
  console.log('✓ Dynamic page titles and meta descriptions implemented');
  console.log('✓ Open Graph tags for social media sharing implemented');
  console.log('✓ Structured data markup for professional information implemented');
  console.log('✓ Proper heading hierarchy validation implemented');
  console.log('✓ Comprehensive test coverage provided');
} else {
  console.log('\n⚠️ Some tests failed. Please review the implementation.');
  
  const failedResults = results.filter(r => r.status === 'FAIL');
  console.log('\nFailed Tests:');
  failedResults.forEach(result => {
    console.log(`- ${result.description}`);
    if (result.details) console.log(`  ${result.details}`);
  });
}

// Generate test report
const report = {
  timestamp: new Date().toISOString(),
  totalTests: passedTests + failedTests,
  passed: passedTests,
  failed: failedTests,
  successRate: ((passedTests / (passedTests + failedTests)) * 100).toFixed(1),
  results: results
};

fs.writeFileSync('seo-test-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Test report saved to seo-test-report.json');

// Exit with appropriate code
process.exit(failedTests > 0 ? 1 : 0);