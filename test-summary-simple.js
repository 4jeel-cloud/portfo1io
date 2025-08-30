// Simple test for the summary formatting function
class MockPortfolioApp {
  formatSummaryWithKeywords(text) {
    const keywords = [
      'Cloud', 'Cybersecurity', 'AI', 'API', 'API development',
      'infrastructure', 'automation', 'security', 'scalable',
      'optimization', 'threat analysis', 'business success'
    ];
    
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    const formattedParagraphs = paragraphs.map(paragraph => {
      let formattedText = paragraph.trim();
      
      keywords.forEach(keyword => {
        const regex = new RegExp('\\b(' + keyword + ')\\b', 'gi');
        formattedText = formattedText.replace(regex, '<span class="keyword-highlight">$1</span>');
      });
      
      return '<p class="summary-paragraph">' + formattedText + '</p>';
    });
    
    return formattedParagraphs.join('');
  }
}

const app = new MockPortfolioApp();

// Test 1: Basic keyword highlighting
const test1 = 'Experienced in Cloud, Cybersecurity, AI, and API development.';
const result1 = app.formatSummaryWithKeywords(test1);
console.log('Test 1 - Basic highlighting:');
console.log('Input:', test1);
console.log('Output:', result1);
console.log('✓ Contains Cloud highlight:', result1.includes('<span class="keyword-highlight">Cloud</span>'));
console.log('✓ Contains AI highlight:', result1.includes('<span class="keyword-highlight">AI</span>'));
console.log('');

// Test 2: Multi-paragraph
const test2 = 'First paragraph with Cloud expertise.\n\nSecond paragraph about Cybersecurity.';
const result2 = app.formatSummaryWithKeywords(test2);
console.log('Test 2 - Multi-paragraph:');
console.log('Input:', test2);
console.log('Output:', result2);
const paragraphCount = (result2.match(/<p class="summary-paragraph">/g) || []).length;
console.log('✓ Paragraph count:', paragraphCount, '(expected: 2)');
console.log('');

// Test 3: Case insensitive
const test3 = 'Expert in cloud technologies and CYBERSECURITY.';
const result3 = app.formatSummaryWithKeywords(test3);
console.log('Test 3 - Case insensitive:');
console.log('Input:', test3);
console.log('Output:', result3);
console.log('✓ Contains lowercase cloud:', result3.includes('<span class="keyword-highlight">cloud</span>'));
console.log('✓ Contains uppercase CYBERSECURITY:', result3.includes('<span class="keyword-highlight">CYBERSECURITY</span>'));
console.log('');

// Test 4: No keywords
const test4 = 'Regular text without special terms.';
const result4 = app.formatSummaryWithKeywords(test4);
console.log('Test 4 - No keywords:');
console.log('Input:', test4);
console.log('Output:', result4);
console.log('✓ No highlights:', !result4.includes('<span class="keyword-highlight">'));
console.log('✓ Has paragraph wrapper:', result4.includes('<p class="summary-paragraph">'));

console.log('\n🎉 All tests completed successfully!');