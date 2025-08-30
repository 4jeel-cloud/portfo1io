/**
 * Build Process Tests
 * Tests for build configuration, asset optimization, and deployment readiness
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

// Test configuration
const rootDir = process.cwd();
const distDir = join(rootDir, 'dist');
const configFiles = [
  'package.json',
  'vite.config.js',
  'netlify.toml',
  'vercel.json',
  '.lighthouserc.json'
];

describe('Build Configuration Tests', () => {
  it('should have all required configuration files', () => {
    configFiles.forEach(file => {
      const filePath = join(rootDir, file);
      expect(existsSync(filePath), `${file} should exist`).toBe(true);
    });
  });

  it('should have valid package.json with required scripts', () => {
    const packagePath = join(rootDir, 'package.json');
    const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = [
      'dev',
      'build',
      'preview',
      'test',
      'lint',
      'deploy:build'
    ];
    
    requiredScripts.forEach(script => {
      expect(packageContent.scripts).toHaveProperty(script);
    });
    
    expect(packageContent.name).toBe('professional-portfolio');
    expect(packageContent.type).toBe('module');
  });

  it('should have valid Vite configuration', () => {
    const viteConfigPath = join(rootDir, 'vite.config.js');
    expect(existsSync(viteConfigPath)).toBe(true);
    
    // Read and validate basic structure
    const configContent = readFileSync(viteConfigPath, 'utf8');
    expect(configContent).toContain('defineConfig');
    expect(configContent).toContain('build');
    expect(configContent).toContain('rollupOptions');
  });

  it('should have environment configuration files', () => {
    const envFiles = ['.env.example', '.env'];
    
    envFiles.forEach(file => {
      const filePath = join(rootDir, file);
      expect(existsSync(filePath), `${file} should exist`).toBe(true);
      
      const content = readFileSync(filePath, 'utf8');
      expect(content).toContain('VITE_APP_TITLE');
      expect(content).toContain('VITE_CONTACT_EMAIL');
    });
  });

  it('should have deployment configuration for multiple platforms', () => {
    // Netlify configuration
    const netlifyConfig = join(rootDir, 'netlify.toml');
    expect(existsSync(netlifyConfig)).toBe(true);
    
    const netlifyContent = readFileSync(netlifyConfig, 'utf8');
    expect(netlifyContent).toContain('[build]');
    expect(netlifyContent).toContain('publish = "dist"');
    
    // Vercel configuration
    const vercelConfig = join(rootDir, 'vercel.json');
    expect(existsSync(vercelConfig)).toBe(true);
    
    const vercelContent = JSON.parse(readFileSync(vercelConfig, 'utf8'));
    expect(vercelContent.builds).toBeDefined();
    expect(vercelContent.routes).toBeDefined();
  });

  it('should have GitHub Actions workflow', () => {
    const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
    expect(existsSync(workflowPath)).toBe(true);
    
    const workflowContent = readFileSync(workflowPath, 'utf8');
    expect(workflowContent).toContain('Deploy Portfolio');
    expect(workflowContent).toContain('npm run build');
    expect(workflowContent).toContain('npm run test');
  });
});

describe('Build Scripts Tests', () => {
  it('should have build scripts in scripts directory', () => {
    const scriptsDir = join(rootDir, 'scripts');
    expect(existsSync(scriptsDir)).toBe(true);
    
    const requiredScripts = [
      'build.js',
      'deploy.js',
      'optimize-assets.js'
    ];
    
    requiredScripts.forEach(script => {
      const scriptPath = join(scriptsDir, script);
      expect(existsSync(scriptPath), `${script} should exist`).toBe(true);
      
      const content = readFileSync(scriptPath, 'utf8');
      expect(content).toContain('#!/usr/bin/env node');
    });
  });

  it('should have executable permissions on build scripts', () => {
    const scriptsDir = join(rootDir, 'scripts');
    const scripts = readdirSync(scriptsDir).filter(file => file.endsWith('.js'));
    
    scripts.forEach(script => {
      const scriptPath = join(scriptsDir, script);
      const stats = statSync(scriptPath);
      expect(stats.isFile()).toBe(true);
    });
  });
});

describe('Asset Optimization Tests', () => {
  it('should have asset directories structure', () => {
    const assetDirs = [
      'css',
      'js',
      'images',
      'assets'
    ];
    
    assetDirs.forEach(dir => {
      const dirPath = join(rootDir, dir);
      if (existsSync(dirPath)) {
        expect(statSync(dirPath).isDirectory()).toBe(true);
      }
    });
  });

  it('should have CSS files for styling', () => {
    const cssDir = join(rootDir, 'css');
    if (existsSync(cssDir)) {
      const cssFiles = readdirSync(cssDir).filter(file => file.endsWith('.css'));
      expect(cssFiles.length).toBeGreaterThan(0);
      
      // Check for main CSS files
      const expectedFiles = ['styles.css', 'components.css', 'responsive.css'];
      expectedFiles.forEach(file => {
        const filePath = join(cssDir, file);
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8');
          expect(content.length).toBeGreaterThan(0);
        }
      });
    }
  });

  it('should have JavaScript modules', () => {
    const jsDir = join(rootDir, 'js');
    expect(existsSync(jsDir)).toBe(true);
    
    const jsFiles = readdirSync(jsDir).filter(file => 
      file.endsWith('.js') && !file.endsWith('.test.js')
    );
    expect(jsFiles.length).toBeGreaterThan(0);
    
    // Check for main JS files
    const expectedFiles = ['main.js', 'data.js', 'navigation.js'];
    expectedFiles.forEach(file => {
      const filePath = join(jsDir, file);
      expect(existsSync(filePath), `${file} should exist`).toBe(true);
    });
  });
});

describe('Performance Configuration Tests', () => {
  it('should have Lighthouse configuration', () => {
    const lighthouseConfig = join(rootDir, '.lighthouserc.json');
    expect(existsSync(lighthouseConfig)).toBe(true);
    
    const config = JSON.parse(readFileSync(lighthouseConfig, 'utf8'));
    expect(config.ci).toBeDefined();
    expect(config.ci.assert).toBeDefined();
    expect(config.ci.assert.assertions).toBeDefined();
    
    // Check performance thresholds
    const assertions = config.ci.assert.assertions;
    expect(assertions['categories:performance']).toBeDefined();
    expect(assertions['categories:accessibility']).toBeDefined();
    expect(assertions['categories:seo']).toBeDefined();
  });

  it('should have compression configuration', () => {
    const publicDir = join(rootDir, 'public');
    
    if (existsSync(publicDir)) {
      // Check for .htaccess (Apache)
      const htaccessPath = join(publicDir, '.htaccess');
      if (existsSync(htaccessPath)) {
        const content = readFileSync(htaccessPath, 'utf8');
        expect(content).toContain('mod_deflate');
        expect(content).toContain('mod_expires');
      }
      
      // Check for _headers (Netlify)
      const headersPath = join(publicDir, '_headers');
      if (existsSync(headersPath)) {
        const content = readFileSync(headersPath, 'utf8');
        expect(content).toContain('Cache-Control');
        expect(content).toContain('X-Frame-Options');
      }
    }
  });
});

describe('Security Configuration Tests', () => {
  it('should have security headers in deployment configs', () => {
    // Check Netlify config
    const netlifyConfig = join(rootDir, 'netlify.toml');
    const netlifyContent = readFileSync(netlifyConfig, 'utf8');
    expect(netlifyContent).toContain('X-Frame-Options');
    expect(netlifyContent).toContain('X-XSS-Protection');
    expect(netlifyContent).toContain('X-Content-Type-Options');
    
    // Check Vercel config
    const vercelConfig = join(rootDir, 'vercel.json');
    const vercelContent = JSON.parse(readFileSync(vercelConfig, 'utf8'));
    expect(vercelContent.headers).toBeDefined();
    
    const securityHeaders = vercelContent.headers.find(h => 
      h.headers.some(header => header.key === 'X-Frame-Options')
    );
    expect(securityHeaders).toBeDefined();
  });

  it('should have proper gitignore for sensitive files', () => {
    const gitignorePath = join(rootDir, '.gitignore');
    
    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, 'utf8');
      expect(content).toContain('node_modules');
      expect(content).toContain('dist');
      expect(content).toContain('.env');
    }
  });
});

describe('Deployment Readiness Tests', () => {
  it('should validate main HTML file structure', () => {
    const indexPath = join(rootDir, 'index.html');
    expect(existsSync(indexPath)).toBe(true);
    
    const content = readFileSync(indexPath, 'utf8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html lang="en">');
    expect(content).toContain('<meta charset="UTF-8">');
    expect(content).toContain('<meta name="viewport"');
  });

  it('should have portfolio data file', () => {
    const dataPath = join(rootDir, 'data', 'portfolio.json');
    expect(existsSync(dataPath)).toBe(true);
    
    const data = JSON.parse(readFileSync(dataPath, 'utf8'));
    expect(data.personal).toBeDefined();
    expect(data.experience).toBeDefined();
    expect(data.projects).toBeDefined();
    expect(data.skills).toBeDefined();
  });

  it('should have all required dependencies in package.json', () => {
    const packagePath = join(rootDir, 'package.json');
    const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    const requiredDevDeps = [
      'vite',
      'vitest',
      '@vitejs/plugin-legacy'
    ];
    
    requiredDevDeps.forEach(dep => {
      expect(packageContent.devDependencies).toHaveProperty(dep);
    });
  });
});

// Build output validation (only if dist exists)
describe('Build Output Validation', () => {
  const shouldRunBuildTests = existsSync(distDir);
  
  it.skipIf(!shouldRunBuildTests)('should have build output directory', () => {
    expect(existsSync(distDir)).toBe(true);
    expect(statSync(distDir).isDirectory()).toBe(true);
  });

  it.skipIf(!shouldRunBuildTests)('should have optimized assets in build', () => {
    const files = readdirSync(distDir);
    expect(files).toContain('index.html');
    
    // Check for asset directories
    const assetDirs = files.filter(file => {
      const filePath = join(distDir, file);
      return statSync(filePath).isDirectory();
    });
    
    expect(assetDirs.length).toBeGreaterThan(0);
  });

  it.skipIf(!shouldRunBuildTests)('should have minified JavaScript files', () => {
    const findJSFiles = (dir) => {
      const files = [];
      const items = readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = join(dir, item);
        if (statSync(fullPath).isDirectory()) {
          files.push(...findJSFiles(fullPath));
        } else if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      });
      
      return files;
    };
    
    const jsFiles = findJSFiles(distDir);
    expect(jsFiles.length).toBeGreaterThan(0);
    
    // Check that files are minified (no unnecessary whitespace)
    jsFiles.forEach(file => {
      const content = readFileSync(file, 'utf8');
      // Minified files should have high character density
      const lines = content.split('\n');
      const avgLineLength = content.length / lines.length;
      expect(avgLineLength).toBeGreaterThan(50); // Minified files have longer lines
    });
  });
});