# UI Components Documentation

This document describes the foundational UI components and design system for the professional portfolio.

## Overview

The component system is built with vanilla CSS and follows a utility-first approach with semantic component classes. All components are responsive, accessible, and follow the established design tokens.

## Design Tokens

### Colors
- `--color-primary`: #000000 (Black)
- `--color-secondary`: #ffffff (White)  
- `--color-accent`: #f97316 (Orange)
- `--color-gray-*`: Gray scale from 50-900

### Typography Scale
- `--font-size-display`: 4rem (64px)
- `--font-size-h1`: 3rem (48px)
- `--font-size-h2`: 2.25rem (36px)
- `--font-size-h3`: 1.875rem (30px)
- `--font-size-body-large`: 1.125rem (18px)
- `--font-size-body`: 1rem (16px)
- `--font-size-small`: 0.875rem (14px)

### Spacing System
- Base unit: 0.25rem (4px)
- Scale: `--space-1` through `--space-32`

## Typography Components

### Classes
- `.typography-display` - Hero titles (64px)
- `.typography-h1` - Section headers (48px)
- `.typography-h2` - Subsection headers (36px)
- `.typography-h3` - Card titles (30px)
- `.typography-body-large` - Important body text (18px)
- `.typography-body` - Standard body text (16px)
- `.typography-small` - Captions and metadata (14px)

### Modifiers
- `.typography-muted` - Gray text color
- `.typography-accent` - Accent color text

### Usage
```html
<h1 class="typography-h1">Section Title</h1>
<p class="typography-body-large typography-muted">Subtitle text</p>
<p class="typography-body">Regular paragraph text</p>
```

## Button Components

### Base Class
- `.btn` - Base button styling with flexbox layout

### Variants
- `.btn-primary` - Black background, white text
- `.btn-secondary` - Transparent background, black border
- `.btn-accent` - Orange background, white text

### Sizes
- `.btn-small` - Smaller padding and font size
- `.btn-large` - Larger padding and font size
- `.btn-icon` - Square aspect ratio for icon buttons

### States
- `:hover` - Lift effect and color changes
- `:focus` - Accent color outline
- `:disabled` - Reduced opacity and disabled pointer events

### Usage
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary btn-large">Large Secondary</button>
<button class="btn btn-accent btn-small">Small Accent</button>
```

## Card Components

### Base Class
- `.card` - Base card with background, border-radius, and shadow

### Variants
- `.card-elevated` - Enhanced shadow for prominence

### Structure Classes
- `.card-header` - Top section with padding
- `.card-body` - Main content area
- `.card-footer` - Bottom section with border

### Content Classes
- `.card-image` - Full-width image (200px height)
- `.card-title` - Card heading
- `.card-subtitle` - Secondary heading
- `.card-text` - Body text content

### Usage
```html
<div class="card card-elevated">
  <div class="card-image" style="background: url('image.jpg');"></div>
  <div class="card-body">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Subtitle</p>
    <p class="card-text">Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-small">Action</button>
  </div>
</div>
```

## Layout Components

### Container Classes
- `.container` - Max-width 1200px, centered
- `.container-narrow` - Max-width 800px, centered
- `.container-wide` - Max-width 1400px, centered
- `.container-fluid` - Full width with padding

### Grid System
- `.grid` - CSS Grid container
- `.grid-cols-1` through `.grid-cols-4` - Column definitions
- `.grid-auto-fit` - Auto-fit columns (min 300px)
- `.grid-auto-fill` - Auto-fill columns (min 300px)

### Grid Gaps
- `.grid-gap-2` through `.grid-gap-8` - Gap spacing

### Stack Components (Flexbox)
- `.stack` - Vertical flex container
- `.stack-horizontal` - Horizontal flex container
- `.stack-center` - Center align items
- `.stack-between` - Space between items
- `.stack-center-all` - Center both axes
- `.stack-responsive` - Vertical on mobile, horizontal on tablet+

### Stack Gaps
- `.stack-gap-2` through `.stack-gap-8` - Gap spacing

### Usage
```html
<!-- Grid Layout -->
<div class="grid grid-cols-3 grid-gap-6">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>

<!-- Stack Layout -->
<div class="stack-horizontal stack-between">
  <span>Left content</span>
  <span>Right content</span>
</div>
```

## Tag/Badge Components

### Base Class
- `.tag` - Base tag styling with rounded corners

### Variants
- `.tag-primary` - Black background
- `.tag-accent` - Orange background
- `.tag-outline` - Transparent with border

### Sizes
- `.tag-large` - Larger padding and font size

### Usage
```html
<span class="tag">JavaScript</span>
<span class="tag tag-accent">Featured</span>
<span class="tag tag-large">Large Tag</span>
```

## Responsive Behavior

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Grid Responsive Behavior
- 4 columns → 2 columns → 1 column
- 3 columns → 2 columns → 1 column
- Auto-fit grids become single column on mobile

### Component Adaptations
- Typography scales down on mobile
- Buttons become full-width on mobile (except in horizontal stacks)
- Cards get reduced padding on mobile
- Stack components switch orientation

## Accessibility Features

### Focus Management
- All interactive elements have visible focus indicators
- Focus outline uses accent color with 2px offset

### Screen Reader Support
- `.sr-only` class for screen reader only content
- Semantic HTML structure maintained

### Color Contrast
- All text meets WCAG AA contrast requirements
- High contrast mode support included

### Reduced Motion
- Respects `prefers-reduced-motion` setting
- Animations disabled for users who prefer reduced motion

## Testing

### Test Files
- `test-components.html` - Interactive test runner
- `js/components.test.js` - Automated component tests
- `component-showcase.html` - Visual component showcase

### Test Coverage
- Typography rendering and sizing
- Button variants and interactions
- Card structure and styling
- Layout system behavior
- Responsive breakpoints
- Accessibility features

### Running Tests
1. Open `test-components.html` in a browser
2. Click "Run Component Tests" to execute automated tests
3. View `component-showcase.html` for visual verification

## Usage Guidelines

### Component Composition
- Combine base classes with modifiers
- Use semantic HTML elements as foundation
- Apply utility classes for spacing and alignment

### Customization
- Modify CSS custom properties for theme changes
- Extend components with additional modifier classes
- Maintain consistent naming conventions

### Performance
- Components use CSS-only animations
- Minimal JavaScript required for functionality
- Optimized for fast rendering and smooth interactions

## Requirements Mapping

This component system addresses the following requirements:

- **1.3**: Minimalist aesthetic with clean typography
- **1.4**: Black/white/gray color palette with accent color
- **2.3**: Consistent navigation styling
- **4.4**: Scannable formatting with visual hierarchy
- **5.3**: Clean visual hierarchy for experience cards
- **6.4**: Consistent styling for project cards
- **7.3**: Clear organization for skills display
- **8.3**: Clear call-to-action styling for contact elements