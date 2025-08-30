/**
 * Component Tests for Portfolio UI Components
 * Tests the foundational UI components and design system
 */

// Test utilities
function createElement(tag, className, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}

function testComponentExists(selector, description) {
    const element = document.querySelector(selector);
    console.assert(element !== null, `❌ ${description}: Element with selector "${selector}" should exist`);
    if (element) {
        console.log(`✅ ${description}: Found element with selector "${selector}"`);
    }
    return element;
}

function testCSSProperty(element, property, expectedValue, description) {
    if (!element) return false;
    const computedStyle = window.getComputedStyle(element);
    const actualValue = computedStyle.getPropertyValue(property);
    const matches = actualValue === expectedValue || actualValue.includes(expectedValue);
    
    if (matches) {
        console.log(`✅ ${description}: ${property} is correct`);
    } else {
        console.log(`❌ ${description}: Expected ${property} to be "${expectedValue}", got "${actualValue}"`);
    }
    return matches;
}

// Typography Component Tests
function testTypographyComponents() {
    console.log('\n=== Typography Component Tests ===');
    
    // Create test elements
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    const typographyTests = [
        { class: 'typography-display', expectedSize: '4rem' },
        { class: 'typography-h1', expectedSize: '3rem' },
        { class: 'typography-h2', expectedSize: '2.25rem' },
        { class: 'typography-h3', expectedSize: '1.875rem' },
        { class: 'typography-body-large', expectedSize: '1.125rem' },
        { class: 'typography-body', expectedSize: '1rem' },
        { class: 'typography-small', expectedSize: '0.875rem' }
    ];
    
    typographyTests.forEach(test => {
        const element = createElement('div', test.class, 'Test text');
        testContainer.appendChild(element);
        testCSSProperty(element, 'font-size', test.expectedSize, `Typography ${test.class}`);
    });
    
    // Test typography modifiers
    const mutedElement = createElement('div', 'typography-body typography-muted', 'Muted text');
    testContainer.appendChild(mutedElement);
    
    const accentElement = createElement('div', 'typography-body typography-accent', 'Accent text');
    testContainer.appendChild(accentElement);
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Button Component Tests
function testButtonComponents() {
    console.log('\n=== Button Component Tests ===');
    
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    // Test button variants
    const buttonTests = [
        { class: 'btn btn-primary', description: 'Primary button' },
        { class: 'btn btn-secondary', description: 'Secondary button' },
        { class: 'btn btn-accent', description: 'Accent button' }
    ];
    
    buttonTests.forEach(test => {
        const button = createElement('button', test.class, 'Test Button');
        testContainer.appendChild(button);
        
        // Test basic button properties
        testCSSProperty(button, 'display', 'inline-flex', test.description);
        testCSSProperty(button, 'cursor', 'pointer', test.description);
        testCSSProperty(button, 'border-radius', '6px', test.description);
    });
    
    // Test button sizes
    const smallButton = createElement('button', 'btn btn-primary btn-small', 'Small');
    const largeButton = createElement('button', 'btn btn-primary btn-large', 'Large');
    testContainer.appendChild(smallButton);
    testContainer.appendChild(largeButton);
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Card Component Tests
function testCardComponents() {
    console.log('\n=== Card Component Tests ===');
    
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    // Test basic card
    const card = createElement('div', 'card');
    const cardBody = createElement('div', 'card-body');
    const cardTitle = createElement('h3', 'card-title', 'Test Card');
    const cardText = createElement('p', 'card-text', 'Test content');
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);
    testContainer.appendChild(card);
    
    testCSSProperty(card, 'border-radius', '8px', 'Card border radius');
    testCSSProperty(card, 'background-color', 'rgb(255, 255, 255)', 'Card background');
    
    // Test elevated card
    const elevatedCard = createElement('div', 'card card-elevated');
    testContainer.appendChild(elevatedCard);
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Layout Component Tests
function testLayoutComponents() {
    console.log('\n=== Layout Component Tests ===');
    
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    // Test grid system
    const grid = createElement('div', 'grid grid-cols-3');
    testContainer.appendChild(grid);
    testCSSProperty(grid, 'display', 'grid', 'Grid display');
    
    // Test stack components
    const stack = createElement('div', 'stack');
    testContainer.appendChild(stack);
    testCSSProperty(stack, 'display', 'flex', 'Stack display');
    testCSSProperty(stack, 'flex-direction', 'column', 'Stack direction');
    
    const horizontalStack = createElement('div', 'stack-horizontal');
    testContainer.appendChild(horizontalStack);
    testCSSProperty(horizontalStack, 'flex-direction', 'row', 'Horizontal stack direction');
    
    // Test containers
    const container = createElement('div', 'container');
    testContainer.appendChild(container);
    testCSSProperty(container, 'max-width', '1200px', 'Container max-width');
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Tag Component Tests
function testTagComponents() {
    console.log('\n=== Tag Component Tests ===');
    
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    // Test basic tag
    const tag = createElement('span', 'tag', 'Test Tag');
    testContainer.appendChild(tag);
    testCSSProperty(tag, 'border-radius', '16px', 'Tag border radius');
    testCSSProperty(tag, 'display', 'inline-flex', 'Tag display');
    
    // Test tag variants
    const accentTag = createElement('span', 'tag tag-accent', 'Accent Tag');
    const primaryTag = createElement('span', 'tag tag-primary', 'Primary Tag');
    testContainer.appendChild(accentTag);
    testContainer.appendChild(primaryTag);
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Responsive Tests
function testResponsiveComponents() {
    console.log('\n=== Responsive Component Tests ===');
    
    // Test responsive stack
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    const responsiveStack = createElement('div', 'stack-responsive');
    testContainer.appendChild(responsiveStack);
    testCSSProperty(responsiveStack, 'display', 'flex', 'Responsive stack display');
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Accessibility Tests
function testAccessibilityFeatures() {
    console.log('\n=== Accessibility Tests ===');
    
    const testContainer = createElement('div', 'test-container');
    document.body.appendChild(testContainer);
    
    // Test button focus styles
    const button = createElement('button', 'btn btn-primary', 'Test Button');
    testContainer.appendChild(button);
    
    // Simulate focus
    button.focus();
    
    // Test screen reader classes
    const srOnly = createElement('span', 'sr-only', 'Screen reader only text');
    testContainer.appendChild(srOnly);
    testCSSProperty(srOnly, 'position', 'absolute', 'Screen reader only positioning');
    
    // Clean up
    document.body.removeChild(testContainer);
}

// Run all tests
function runComponentTests() {
    console.log('🧪 Starting UI Component Tests...\n');
    
    try {
        testTypographyComponents();
        testButtonComponents();
        testCardComponents();
        testLayoutComponents();
        testTagComponents();
        testResponsiveComponents();
        testAccessibilityFeatures();
        
        console.log('\n✅ All component tests completed!');
        console.log('📋 Check the component-showcase.html file to see all components in action.');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

// Export for use in other files or run immediately if in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runComponentTests,
        testTypographyComponents,
        testButtonComponents,
        testCardComponents,
        testLayoutComponents,
        testTagComponents,
        testResponsiveComponents,
        testAccessibilityFeatures
    };
} else if (typeof window !== 'undefined') {
    // Auto-run tests when loaded in browser
    document.addEventListener('DOMContentLoaded', runComponentTests);
}