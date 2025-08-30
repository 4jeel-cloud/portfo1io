/**
 * Deployment Validation Tests
 * Tests for deployment readiness, configuration validation, and production checks
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Test configuration
const rootDir = process.cwd();

describe('Deployment Configuration Validation', () => {
  describe('Environment Variables', () => {
    it('should have environment configuration files', () => {
      const envExample = join(rootDir, '.env.example');
      const envLocal = join(rootDir, '.env');
      
      expect(existsSync(envExample)).toBe(true);
      expect(existsSync(envLocal)).toBe(true);
    });

    it('should have all required environment variables defined', () => {
      const envExample = join(rootDir, '.env.example');
      const content = readFileSync(envExample, 'utf8');
      
      const requiredVars = [
        'VITE_APP_TITLE',
        'VITE_APP_DESCRIPTION',
        'VITE_APP_URL',
        'VITE_CONTACT_EMAIL',
        'VITE_LINKEDIN_URL',
        'VITE_GITHUB_URL',
        'VITE_BEHANCE_URL'
      ];
      
      requiredVars.forEach(varName => {
        expect(content).toContain(varName);
      });
    });

    it('should not expose sensitive information in example file', () => {
      const envExample = join(rootDir, '.env.example');
      const content = readFileSync(envExample, 'utf8');
      
      // Should not contain real values
      expect(content).not.toContain('@gmail.com');
      expect(content).not.toContain('real-api-key');
      expect(content).not.toContain('production-secret');
    });
  });

  describe('Netlify Configuration', () => {
    it('should have valid netlify.toml configuration', () => {
      const netlifyConfig = join(rootDir, 'netlify.toml');
      expect(existsSync(netlifyConfig)).toBe(true);
      
      const content = readFileSync(netlifyConfig, 'utf8');
      
      // Build configuration
      expect(content).toContain('[build]');
      expect(content).toContain('command = "npm run build"');
      expect(content).toContain('publish = "dist"');
      
      // Environment
      expect(content).toContain('NODE_VERSION = "18"');
      
      // Redirects for SPA
      expect(content).toContain('[[redirects]]');
      expect(content).toContain('to = "/index.html"');
      expect(content).toContain('status = 200');
    });

    it('should have security headers configured', () => {
      const netlifyConfig = join(rootDir, 'netlify.toml');
      const content = readFileSync(netlifyConfig, 'utf8');
      
      const securityHeaders = [
        'X-Frame-Options = "DENY"',
        'X-XSS-Protection = "1; mode=block"',
        'X-Content-Type-Options = "nosniff"',
        'Referrer-Policy = "strict-origin-when-cross-origin"'
      ];
      
      securityHeaders.forEach(header => {
        expect(content).toContain(header);
      });
    });

    it('should have caching headers for static assets', () => {
      const netlifyConfig = join(rootDir, 'netlify.toml');
      const content = readFileSync(netlifyConfig, 'utf8');
      
      expect(content).toContain('/*.css');
      expect(content).toContain('/*.js');
      expect(content).toContain('/*.woff2');
      expect(content).toContain('Cache-Control = "public, max-age=31536000');
    });
  });

  describe('Vercel Configuration', () => {
    it('should have valid vercel.json configuration', () => {
      const vercelConfig = join(rootDir, 'vercel.json');
      expect(existsSync(vercelConfig)).toBe(true);
      
      const config = JSON.parse(readFileSync(vercelConfig, 'utf8'));
      
      expect(config.version).toBe(2);
      expect(config.builds).toBeDefined();
      expect(config.routes).toBeDefined();
      expect(config.headers).toBeDefined();
    });

    it('should have proper build configuration', () => {
      const vercelConfig = join(rootDir, 'vercel.json');
      const config = JSON.parse(readFileSync(vercelConfig, 'utf8'));
      
      expect(config.buildCommand).toBe('npm run build');
      expect(config.outputDirectory).toBe('dist');
      expect(config.installCommand).toBe('npm install');
    });

    it('should have SPA routing configuration', () => {
      const vercelConfig = join(rootDir, 'vercel.json');
      const config = JSON.parse(readFileSync(vercelConfig, 'utf8'));
      
      const catchAllRoute = config.routes.find(route => 
        route.src === '/(.*)'  && route.dest === '/index.html'
      );
      
      expect(catchAllRoute).toBeDefined();
    });

    it('should have security headers', () => {
      const vercelConfig = join(rootDir, 'vercel.json');
      const config = JSON.parse(readFileSync(vercelConfig, 'utf8'));
      
      const securityHeadersConfig = config.headers.find(h => 
        h.headers.some(header => header.key === 'X-Frame-Options')
      );
      
      expect(securityHeadersConfig).toBeDefined();
      
      const headers = securityHeadersConfig.headers;
      const headerKeys = headers.map(h => h.key);
      
      expect(headerKeys).toContain('X-Frame-Options');
      expect(headerKeys).toContain('X-XSS-Protection');
      expect(headerKeys).toContain('X-Content-Type-Options');
    });
  });

  describe('GitHub Actions Workflow', () => {
    it('should have deployment workflow', () => {
      const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
      expect(existsSync(workflowPath)).toBe(true);
      
      const content = readFileSync(workflowPath, 'utf8');
      expect(content).toContain('name: Deploy Portfolio');
    });

    it('should have proper job configuration', () => {
      const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
      const content = readFileSync(workflowPath, 'utf8');
      
      // Test job
      expect(content).toContain('jobs:');
      expect(content).toContain('test:');
      expect(content).toContain('npm run lint');
      expect(content).toContain('npm run test');
      expect(content).toContain('npm run build');
      
      // Deploy job
      expect(content).toContain('deploy-github-pages:');
      expect(content).toContain('needs: test');
    });

    it('should have multiple Node.js versions for testing', () => {
      const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
      const content = readFileSync(workflowPath, 'utf8');
      
      expect(content).toContain('strategy:');
      expect(content).toContain('matrix:');
      expect(content).toContain('node-version: [18.x, 20.x]');
    });

    it('should have Lighthouse audit job', () => {
      const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
      const content = readFileSync(workflowPath, 'utf8');
      
      expect(content).toContain('lighthouse-audit:');
      expect(content).toContain('lighthouse-ci-action');
    });
  });
});

describe('Performance Configuration', () => {
  describe('Lighthouse Configuration', () => {
    it('should have lighthouse configuration file', () => {
      const lighthouseConfig = join(rootDir, '.lighthouserc.json');
      expect(existsSync(lighthouseConfig)).toBe(true);
      
      const config = JSON.parse(readFileSync(lighthouseConfig, 'utf8'));
      expect(config.ci).toBeDefined();
    });

    it('should have performance thresholds configured', () => {
      const lighthouseConfig = join(rootDir, '.lighthouserc.json');
      const config = JSON.parse(readFileSync(lighthouseConfig, 'utf8'));
      
      const assertions = config.ci.assert.assertions;
      
      // Check performance thresholds
      expect(assertions['categories:performance']).toBeDefined();
      expect(assertions['categories:accessibility']).toBeDefined();
      expect(assertions['categories:best-practices']).toBeDefined();
      expect(assertions['categories:seo']).toBeDefined();
      
      // Verify minimum scores
      const perfScore = assertions['categories:performance'][1].minScore;
      expect(perfScore).toBeGreaterThanOrEqual(0.9);
    });

    it('should have proper collection configuration', () => {
      const lighthouseConfig = join(rootDir, '.lighthouserc.json');
      const config = JSON.parse(readFileSync(lighthouseConfig, 'utf8'));
      
      expect(config.ci.collect.url).toContain('http://localhost:3000');
      expect(config.ci.collect.startServerCommand).toBe('npm run preview');
      expect(config.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Vite Build Configuration', () => {
    it('should have optimized build settings', () => {
      const viteConfig = join(rootDir, 'vite.config.js');
      const content = readFileSync(viteConfig, 'utf8');
      
      // Build optimizations
      expect(content).toContain('minify: \'terser\'');
      expect(content).toContain('rollupOptions');
      expect(content).toContain('manualChunks');
      
      // Asset optimization
      expect(content).toContain('assetsInlineLimit');
      expect(content).toContain('cssCodeSplit');
    });

    it('should have legacy browser support', () => {
      const viteConfig = join(rootDir, 'vite.config.js');
      const content = readFileSync(viteConfig, 'utf8');
      
      expect(content).toContain('@vitejs/plugin-legacy');
      expect(content).toContain('legacy(');
    });

    it('should have proper chunk splitting configuration', () => {
      const viteConfig = join(rootDir, 'vite.config.js');
      const content = readFileSync(viteConfig, 'utf8');
      
      expect(content).toContain('manualChunks');
      expect(content).toContain('vendor');
      expect(content).toContain('core');
      expect(content).toContain('features');
    });
  });
});

describe('Security Validation', () => {
  it('should have gitignore for sensitive files', () => {
    const gitignorePath = join(rootDir, '.gitignore');
    
    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, 'utf8');
      
      const sensitivePatterns = [
        'node_modules',
        '.env',
        'dist',
        '*.log'
      ];
      
      sensitivePatterns.forEach(pattern => {
        expect(content).toContain(pattern);
      });
    }
  });

  it('should not have sensitive files in repository', () => {
    const sensitiveFiles = [
      '.env.local',
      '.env.production',
      'npm-debug.log',
      'yarn-error.log'
    ];
    
    sensitiveFiles.forEach(file => {
      const filePath = join(rootDir, file);
      expect(existsSync(filePath)).toBe(false);
    });
  });

  it('should have proper permissions policy headers', () => {
    const netlifyConfig = join(rootDir, 'netlify.toml');
    const content = readFileSync(netlifyConfig, 'utf8');
    
    expect(content).toContain('Permissions-Policy');
    expect(content).toContain('camera=()');
    expect(content).toContain('microphone=()');
    expect(content).toContain('geolocation=()');
  });
});

describe('Asset Optimization Validation', () => {
  it('should have asset optimization script', () => {
    const optimizeScript = join(rootDir, 'scripts', 'optimize-assets.js');
    expect(existsSync(optimizeScript)).toBe(true);
    
    const content = readFileSync(optimizeScript, 'utf8');
    expect(content).toContain('optimizeImages');
    expect(content).toContain('optimizeFonts');
    expect(content).toContain('generateAssetManifest');
  });

  it('should have compression configuration files', () => {
    const publicDir = join(rootDir, 'public');
    
    if (existsSync(publicDir)) {
      // Check for Apache .htaccess
      const htaccessPath = join(publicDir, '.htaccess');
      if (existsSync(htaccessPath)) {
        const content = readFileSync(htaccessPath, 'utf8');
        expect(content).toContain('mod_deflate');
        expect(content).toContain('AddOutputFilterByType DEFLATE');
      }
      
      // Check for Netlify _headers
      const headersPath = join(publicDir, '_headers');
      if (existsSync(headersPath)) {
        const content = readFileSync(headersPath, 'utf8');
        expect(content).toContain('Cache-Control');
        expect(content).toContain('max-age=31536000');
      }
    }
  });
});

describe('Build Script Validation', () => {
  it('should have comprehensive build script', () => {
    const buildScript = join(rootDir, 'scripts', 'build.js');
    expect(existsSync(buildScript)).toBe(true);
    
    const content = readFileSync(buildScript, 'utf8');
    
    // Should include all build steps
    expect(content).toContain('runBuild');
    expect(content).toContain('npm run lint');
    expect(content).toContain('npm run test');
    expect(content).toContain('vite build');
    expect(content).toContain('Analyzing build output');
  });

  it('should have deployment script', () => {
    const deployScript = join(rootDir, 'scripts', 'deploy.js');
    expect(existsSync(deployScript)).toBe(true);
    
    const content = readFileSync(deployScript, 'utf8');
    
    // Should support multiple platforms
    expect(content).toContain('deployToNetlify');
    expect(content).toContain('deployToVercel');
    expect(content).toContain('deployToGitHubPages');
  });

  it('should have proper error handling in scripts', () => {
    const buildScript = join(rootDir, 'scripts', 'build.js');
    const content = readFileSync(buildScript, 'utf8');
    
    expect(content).toContain('try {');
    expect(content).toContain('catch (error)');
    expect(content).toContain('process.exit(1)');
  });
});

describe('Production Readiness Checks', () => {
  it('should have all required meta tags in HTML', () => {
    const indexPath = join(rootDir, 'index.html');
    const content = readFileSync(indexPath, 'utf8');
    
    const requiredMeta = [
      'charset="UTF-8"',
      'name="viewport"',
      'name="description"',
      'name="author"',
      'name="keywords"'
    ];
    
    requiredMeta.forEach(meta => {
      expect(content).toContain(meta);
    });
  });

  it('should have proper HTML structure', () => {
    const indexPath = join(rootDir, 'index.html');
    const content = readFileSync(indexPath, 'utf8');
    
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html lang="en">');
    expect(content).toContain('<head>');
    expect(content).toContain('<body>');
    expect(content).toContain('<main');
  });

  it('should have accessibility features', () => {
    const indexPath = join(rootDir, 'index.html');
    const content = readFileSync(indexPath, 'utf8');
    
    expect(content).toContain('skip-link');
    expect(content).toContain('role="');
    expect(content).toContain('aria-');
    expect(content).toContain('alt="');
  });

  it('should have performance optimizations', () => {
    const indexPath = join(rootDir, 'index.html');
    const content = readFileSync(indexPath, 'utf8');
    
    expect(content).toContain('preload');
    expect(content).toContain('loading="lazy"');
  });
});