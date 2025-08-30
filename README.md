# Professional Portfolio

A clean, minimalist professional portfolio website built with vanilla HTML, CSS, and JavaScript. Features a modern design with smooth animations, responsive layout, and accessibility compliance.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Aesthetics**: Clean, minimalist design with strategic use of whitespace
- **Smooth Animations**: CSS animations and JavaScript interactions for enhanced UX
- **Accessibility Compliant**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Fast loading with optimized assets and lazy loading
- **Easy to Customize**: Simple JSON data file for easy content updates

## Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Core styles and design tokens
│   ├── components.css      # Component-specific styles
│   └── responsive.css      # Responsive design and media queries
├── js/
│   ├── main.js            # Main application controller
│   ├── navigation.js      # Navigation functionality
│   ├── animations.js      # Animation effects
│   └── data.js           # Data management
├── data/
│   └── portfolio.json    # Portfolio content data
├── images/
│   ├── profile/          # Profile photos
│   └── projects/         # Project screenshots
└── assets/
    ├── icons/            # Custom icons
    └── fonts/            # Custom fonts
```

## Getting Started

### 1. Customize Your Content

Edit the `data/portfolio.json` file to add your personal information, experience, projects, and skills:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "bio": "Your professional bio...",
    "summary": "Your professional summary...",
    "contact": {
      "email": "your.email@example.com",
      "linkedin": "https://linkedin.com/in/yourprofile",
      "github": "https://github.com/yourusername",
      "behance": "https://behance.net/yourprofile"
    }
  }
}
```

### 2. Add Your Images

- Add your professional headshot as `images/profile/headshot.jpg`
- Add project screenshots to `images/projects/`
- Update the image paths in `portfolio.json`

### 3. Customize Colors and Styling

Edit the CSS custom properties in `css/styles.css` to match your brand:

```css
:root {
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-accent: #f97316;
  /* Add your custom colors */
}
```

### 4. Deploy

The portfolio is a static website that can be deployed to any web hosting service:

- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder or connect your Git repository
- **Vercel**: Import your project from Git or deploy directly
- **Traditional Web Hosting**: Upload files via FTP

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Optimized CSS with minimal unused styles
- Efficient JavaScript with no external dependencies
- Lazy loading for images
- Smooth scrolling and animations
- Responsive images and assets

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion support for users with vestibular disorders

## Customization Tips

### Adding New Sections

1. Add the HTML structure to `index.html`
2. Add corresponding styles to `css/components.css`
3. Update the navigation in the header
4. Add data handling in `js/main.js`

### Modifying Animations

Edit `js/animations.js` to customize:
- Scroll-triggered animations
- Hover effects
- Loading animations
- Transition timings

### Changing Layout

Modify `css/components.css` and `css/responsive.css` to adjust:
- Grid layouts
- Spacing and typography
- Component positioning
- Responsive breakpoints

## Development

For local development, you can use any local server. For example:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please check the documentation or create an issue in the repository.