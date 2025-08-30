# Build and Deployment Guide

This document provides comprehensive instructions for building and deploying the professional portfolio application.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git (for version control and deployment)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Build Configuration

### Vite Configuration

The project uses Vite as the build tool with the following optimizations:

- **Minification**: Terser with aggressive compression settings
- **Code Splitting**: Manual chunks for vendor, core, features, and performance modules
- **Asset Optimization**: Inline assets under 4KB, optimized file naming with cache busting
- **Legacy Support**: Polyfills for older browsers using @vitejs/plugin-legacy
- **CSS Optimization**: Code splitting and minification

### Environment Variables

Copy `.env.example` to `.env` and configure your values:

```bash
cp .env.example .env
```

Required variables:
- `VITE_APP_TITLE`: Portfolio title
- `VITE_APP_DESCRIPTION`: Meta description
- `VITE_CONTACT_EMAIL`: Contact email address
- `VITE_LINKEDIN_URL`: LinkedIn profile URL
- `VITE_GITHUB_URL`: GitHub profile URL
- `VITE_BEHANCE_URL`: Behance profile URL

## Build Scripts

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run preview          # Preview production build locally

# Building
npm run build            # Full production build with validation
npm run build:simple     # Simple Vite build without validation
npm run build:analyze    # Build with bundle analyzer

# Testing and Quality
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run validate         # Run linting and tests

# Asset Optimization
npm run optimize         # Optimize images and generate asset manifest

# Deployment
npm run deploy:netlify   # Deploy to Netlify
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:github    # Deploy to GitHub Pages

# Utilities
npm run clean            # Clean build artifacts
npm run serve            # Serve production build
```

### Custom Build Process

The `npm run build` command runs a comprehensive build process:

1. **Clean**: Remove previous build artifacts
2. **Lint**: Check code quality with ESLint
3. **Test**: Run all unit tests
4. **Build**: Create optimized production bundle
5. **Analyze**: Generate build size analysis

## Deployment Options

### 1. Netlify

**Automatic Deployment:**
```bash
# Connect your repository to Netlify
# Build settings are configured in netlify.toml
```

**Manual Deployment:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

**Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- Includes security headers and caching rules

### 2. Vercel

**Automatic Deployment:**
```bash
# Connect your repository to Vercel
# Build settings are configured in vercel.json
```

**Manual Deployment:**
```bash
npm install -g vercel
npm run build
vercel --prod
```

**Configuration:**
- Framework: None (static site)
- Build command: `npm run build`
- Output directory: `dist`
- Includes security headers and SPA routing

### 3. GitHub Pages

**Automatic Deployment:**
- GitHub Actions workflow is configured in `.github/workflows/deploy.yml`
- Automatically deploys on push to main/master branch

**Manual Deployment:**
```bash
npm run build
npm run deploy:github
```

**Configuration:**
- Uses `gh-pages` package
- Deploys `dist` folder to `gh-pages` branch
- Includes Lighthouse audits on pull requests

### 4. Other Static Hosts

For other static hosting providers (AWS S3, Firebase Hosting, etc.):

1. Run `npm run build`
2. Upload the `dist` folder contents
3. Configure server for SPA routing (redirect all routes to `index.html`)

## Performance Optimization

### Asset Optimization

```bash
# Optimize images and generate manifest
npm run optimize
```

This script:
- Optimizes images (placeholder implementation)
- Analyzes font usage
- Generates asset manifest
- Creates compression configuration files

### Bundle Analysis

```bash
# Generate bundle size analysis
npm run build:analyze
```

Opens a visual bundle analyzer showing:
- Chunk sizes and dependencies
- Duplicate dependencies
- Optimization opportunities

### Lighthouse Audits

Lighthouse configuration is in `.lighthouserc.json`:

```bash
# Run Lighthouse audit (requires build to be running)
npm run preview &
npx lighthouse-ci autorun
```

Performance thresholds:
- Performance: 90%
- Accessibility: 90%
- Best Practices: 90%
- SEO: 90%

## Security Configuration

### Headers

Security headers are configured in deployment configs:

- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Caching

Static assets are cached for 1 year:
- CSS/JS files: `max-age=31536000, immutable`
- Images: `max-age=31536000`
- HTML: `max-age=0, must-revalidate`

## Troubleshooting

### Common Issues

**Build fails with "Module not found":**
```bash
npm run clean
npm install
npm run build
```

**Environment variables not working:**
- Ensure variables start with `VITE_`
- Check `.env` file exists and has correct values
- Restart development server after changes

**Deployment fails:**
- Check build passes locally: `npm run build`
- Verify environment variables are set in deployment platform
- Check deployment logs for specific errors

**Performance issues:**
- Run bundle analyzer: `npm run build:analyze`
- Check Lighthouse audit: `npx lighthouse-ci autorun`
- Optimize images: `npm run optimize`

### Validation

Run the build configuration validator:

```bash
node scripts/validate-build-config.js
```

This checks:
- All configuration files exist and are valid
- Required scripts are defined
- Environment variables are configured
- Deployment configurations are correct
- Security settings are in place

## Continuous Integration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes:

1. **Test Matrix**: Tests on Node.js 18.x and 20.x
2. **Quality Checks**: Linting and testing
3. **Build Validation**: Ensures production build works
4. **Lighthouse Audits**: Performance testing on pull requests
5. **Automatic Deployment**: Deploys to GitHub Pages on main branch

### Local CI Simulation

```bash
# Run the same checks as CI
npm run validate
npm run build
```

## File Structure

```
├── .github/workflows/     # GitHub Actions workflows
├── scripts/              # Build and deployment scripts
├── public/               # Static assets and server configuration
├── dist/                 # Production build output (generated)
├── .env.example          # Environment variables template
├── .env                  # Local environment variables (gitignored)
├── vite.config.js        # Vite build configuration
├── netlify.toml          # Netlify deployment configuration
├── vercel.json           # Vercel deployment configuration
├── .lighthouserc.json    # Lighthouse audit configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── .gitignore            # Git ignore rules
```

## Best Practices

1. **Always test locally** before deploying
2. **Use environment variables** for configuration
3. **Run validation** before committing: `npm run validate`
4. **Monitor performance** with Lighthouse audits
5. **Keep dependencies updated** regularly
6. **Use semantic versioning** for releases
7. **Test on multiple devices** and browsers

## Support

For build or deployment issues:

1. Check this documentation
2. Run the validation script
3. Check the troubleshooting section
4. Review deployment platform logs
5. Ensure all prerequisites are met