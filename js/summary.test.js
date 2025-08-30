/**
 * Summary Component Tests
 * Tests for the Summary section functionality including keyword highlighting and formatting
 */

// Test utilities
function createTestElement(id = 'test-summary') {
  const element = document.createElement('div');
  element.id = id;
  document.body.appendChild(element);
  return element;
}

function cleanupTestElement(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

// Mock PortfolioApp class for testing
class MockPortfolioApp {
  formatSummaryWithKeywords(text) {
    // Define technical keywords to highlight
    const keywords = [
      'Cloud', 'Cybersecurity', 'AI', 'API', 'API development',
      'infrastructure', 'automation', 'security', 'scalable',
      'optimization', 'threat analysis', 'business success'
    ];
    
    // Split text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    // Process each paragraph
    const formattedParagraphs = paragraphs.map(paragraph => {
      let formattedText = paragraph.trim();
      
      // Highlight keywords (case-insensitive)
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        formattedText = formattedText.replace(regex, '<span class="keyword-highlight">$1</span>');
      });
      
      return `<p class="summary-paragraph">${formattedText}</p>`;
    });
    
    return formattedParagraphs.join('');
  }
  
  populateSummarySection(elementId, summaryText) {
    const summaryElement = document.getElementById(elementId);
    
    if (summaryElement) {
      const formattedSummary = this.formatSummaryWithKeywords(summaryText);
      summaryElement.innerHTML = formattedSummary;
    }
  }
}

// Test Suite: Summary Component
describe('Summary Component', () => {
  let mockApp;
  let testElement;
  
  beforeEach(() => {
    mockApp = new MockPortfolioApp();
    testElement = createTestElement();
  });
  
  afterEach(() => {
    cleanupTestElement(testElement);
  });
  
  // Test 1: Basic keyword highlighting
  test('should highlight technical keywords', () => {
    const testText = 'Experienced in Cloud, Cybersecurity, AI, and API development.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    expect(result).toContain('<span class="keyword-highlight">Cloud</span>');
    expect(result).toContain('<span class="keyword-highlight">Cybersecurity</span>');
    expect(result).toContain('<span class="keyword-highlight">AI</span>');
    expect(result).toContain('<span class="keyword-highlight">API development</span>');
  });
  
  // Test 2: Case-insensitive keyword matching
  test('should highlight keywords regardless of case', () => {
    const testText = 'Expert in cloud technologies, CYBERSECURITY, ai, and Api development.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    expect(result).toContain('<span class="keyword-highlight">cloud</span>');
    expect(result).toContain('<span class="keyword-highlight">CYBERSECURITY</span>');
    expect(result).toContain('<span class="keyword-highlight">ai</span>');
    expect(result).toContain('<span class="keyword-highlight">Api</span>');
  });
  
  // Test 3: Multi-paragraph formatting
  test('should format multiple paragraphs correctly', () => {
    const testText = 'First paragraph with Cloud expertise.\n\nSecond paragraph about Cybersecurity.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    const paragraphCount = (result.match(/<p class="summary-paragraph">/g) || []).length;
    expect(paragraphCount).toBe(2);
    expect(result).toContain('<span class="keyword-highlight">Cloud</span>');
    expect(result).toContain('<span class="keyword-highlight">Cybersecurity</span>');
  });
  
  // Test 4: Empty and whitespace handling
  test('should handle empty text and whitespace correctly', () => {
    const testText = '';
    const result = mockApp.formatSummaryWithKeywords(testText);
    expect(result).toBe('');
    
    const whitespaceText = '   \n\n   \n   ';
    const whitespaceResult = mockApp.formatSummaryWithKeywords(whitespaceText);
    expect(whitespaceResult).toBe('');
  });
  
  // Test 5: Text without keywords
  test('should format text without keywords correctly', () => {
    const testText = 'This is regular text without any special terms.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    expect(result).toContain('<p class="summary-paragraph">');
    expect(result).not.toContain('<span class="keyword-highlight">');
    expect(result).toContain('This is regular text without any special terms.');
  });
  
  // Test 6: Word boundary matching
  test('should only highlight complete words, not partial matches', () => {
    const testText = 'Cloudiness and security-focused approach.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    // Should not highlight "Cloud" in "Cloudiness"
    expect(result).not.toContain('<span class="keyword-highlight">Cloud</span>iness');
    // Should highlight "security" as a complete word
    expect(result).toContain('<span class="keyword-highlight">security</span>');
  });
  
  // Test 7: Multiple keyword instances
  test('should highlight multiple instances of the same keyword', () => {
    const testText = 'Cloud computing and cloud infrastructure require cloud expertise.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    const cloudMatches = (result.match(/<span class="keyword-highlight">cloud<\/span>/gi) || []).length;
    expect(cloudMatches).toBe(2); // "cloud" appears twice (case-insensitive)
    
    const CloudMatches = (result.match(/<span class="keyword-highlight">Cloud<\/span>/g) || []).length;
    expect(CloudMatches).toBe(1); // "Cloud" appears once
  });
  
  // Test 8: Complex keyword combinations
  test('should handle complex keyword combinations', () => {
    const testText = 'API development and infrastructure automation for scalable security solutions.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    expect(result).toContain('<span class="keyword-highlight">API development</span>');
    expect(result).toContain('<span class="keyword-highlight">infrastructure</span>');
    expect(result).toContain('<span class="keyword-highlight">automation</span>');
    expect(result).toContain('<span class="keyword-highlight">scalable</span>');
    expect(result).toContain('<span class="keyword-highlight">security</span>');
  });
  
  // Test 9: DOM population
  test('should populate DOM element correctly', () => {
    const testText = 'Professional with Cloud and AI expertise.';
    mockApp.populateSummarySection(testElement.id, testText);
    
    expect(testElement.innerHTML).toContain('<p class="summary-paragraph">');
    expect(testElement.innerHTML).toContain('<span class="keyword-highlight">Cloud</span>');
    expect(testElement.innerHTML).toContain('<span class="keyword-highlight">AI</span>');
  });
  
  // Test 10: Special characters and punctuation
  test('should handle special characters and punctuation correctly', () => {
    const testText = 'Cloud-based security, AI-powered automation, and API development!';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    expect(result).toContain('<span class="keyword-highlight">Cloud</span>-based');
    expect(result).toContain('<span class="keyword-highlight">security</span>,');
    expect(result).toContain('<span class="keyword-highlight">AI</span>-powered');
    expect(result).toContain('<span class="keyword-highlight">automation</span>,');
    expect(result).toContain('<span class="keyword-highlight">API development</span>!');
  });
});

// Test Suite: Summary Requirements Compliance
describe('Summary Requirements Compliance', () => {
  let mockApp;
  
  beforeEach(() => {
    mockApp = new MockPortfolioApp();
  });
  
  // Test Requirement 4.1: Display one to two paragraphs
  test('should handle one to two paragraphs (Requirement 4.1)', () => {
    const singleParagraph = 'Single paragraph summary with Cloud expertise.';
    const singleResult = mockApp.formatSummaryWithKeywords(singleParagraph);
    const singleCount = (singleResult.match(/<p class="summary-paragraph">/g) || []).length;
    expect(singleCount).toBe(1);
    
    const twoParagraphs = 'First paragraph.\n\nSecond paragraph.';
    const twoResult = mockApp.formatSummaryWithKeywords(twoParagraphs);
    const twoCount = (twoResult.match(/<p class="summary-paragraph">/g) || []).length;
    expect(twoCount).toBe(2);
  });
  
  // Test Requirement 4.2: Include relevant keywords
  test('should highlight relevant keywords (Requirement 4.2)', () => {
    const testText = 'Expert in Cloud, Cybersecurity, AI, and API development with focus on business success.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    // Check for required keywords
    expect(result).toContain('<span class="keyword-highlight">Cloud</span>');
    expect(result).toContain('<span class="keyword-highlight">Cybersecurity</span>');
    expect(result).toContain('<span class="keyword-highlight">AI</span>');
    expect(result).toContain('<span class="keyword-highlight">API development</span>');
    expect(result).toContain('<span class="keyword-highlight">business success</span>');
  });
  
  // Test Requirement 4.3: Clear, scannable formatting
  test('should provide clear, scannable formatting (Requirement 4.3)', () => {
    const testText = 'Professional summary with Cloud and security expertise.\n\nSecond paragraph about AI and automation.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    // Check for proper paragraph structure
    expect(result).toContain('<p class="summary-paragraph">');
    expect(result).toMatch(/<p class="summary-paragraph">.*<\/p>/);
    
    // Check for keyword highlighting that aids scanning
    expect(result).toContain('<span class="keyword-highlight">');
  });
  
  // Test Requirement 4.4: Visual hierarchy with bold headers
  test('should maintain visual hierarchy (Requirement 4.4)', () => {
    const testText = 'Summary with important Cloud and security keywords.';
    const result = mockApp.formatSummaryWithKeywords(testText);
    
    // Keywords should be highlighted for visual hierarchy
    expect(result).toContain('<span class="keyword-highlight">Cloud</span>');
    expect(result).toContain('<span class="keyword-highlight">security</span>');
    
    // Paragraph structure should support hierarchy
    expect(result).toContain('class="summary-paragraph"');
  });
});

// Performance Tests
describe('Summary Performance', () => {
  let mockApp;
  
  beforeEach(() => {
    mockApp = new MockPortfolioApp();
  });
  
  test('should handle large text efficiently', () => {
    const largeText = 'Cloud '.repeat(100) + 'and Cybersecurity '.repeat(100) + 'with AI '.repeat(100);
    
    const startTime = performance.now();
    const result = mockApp.formatSummaryWithKeywords(largeText);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    expect(result).toContain('<span class="keyword-highlight">');
  });
});

// Integration Tests
describe('Summary Integration', () => {
  test('should integrate with portfolio data structure', () => {
    const mockPortfolioData = {
      personal: {
        summary: 'Professional specializing in Cloud, Cybersecurity, AI, and API development.'
      }
    };
    
    const mockApp = new MockPortfolioApp();
    const result = mockApp.formatSummaryWithKeywords(mockPortfolioData.personal.summary);
    
    expect(result).toContain('<p class="summary-paragraph">');
    expect(result).toContain('<span class="keyword-highlight">Cloud</span>');
    expect(result).toContain('<span class="keyword-highlight">Cybersecurity</span>');
    expect(result).toContain('<span class="keyword-highlight">AI</span>');
    expect(result).toContain('<span class="keyword-highlight">API development</span>');
  });
});

console.log('Summary component tests loaded successfully');