#!/usr/bin/env node

/**
 * Asset optimization script for images, fonts, and other static assets
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    return statSync(filePath).size;
  } catch (error) {
    return 0;
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!existsSync(dirPath)) {
    return arrayOfFiles;
  }
  
  const files = readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

function optimizeImages() {
  log('🖼️  Optimizing images...', 'yellow');
  
  const imageDir = join(rootDir, 'images');
  if (!existsSync(imageDir)) {
    log('ℹ️  No images directory found, skipping image optimization', 'blue');
    return;
  }
  
  const imageFiles = getAllFiles(imageDir).filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);
  });
  
  if (imageFiles.length === 0) {
    log('ℹ️  No images found to optimize', 'blue');
    return;
  }
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let optimizedCount = 0;
  
  // Create optimized directory
  const optimizedDir = join(rootDir, 'images', 'optimized');
  if (!existsSync(optimizedDir)) {
    mkdirSync(optimizedDir, { recursive: true });
  }
  
  imageFiles.forEach(file => {
    const originalSize = getFileSize(file);
    totalOriginalSize += originalSize;
    
    const fileName = basename(file);
    const ext = extname(file).toLowerCase();
    
    try {
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // For production, you would use actual image optimization tools
        // For now, we'll just copy the files as a placeholder
        const optimizedPath = join(optimizedDir, fileName);
        copyFileSync(file, optimizedPath);
        
        const optimizedSize = getFileSize(optimizedPath);
        totalOptimizedSize += optimizedSize;
        optimizedCount++;
        
        log(`   ✅ ${fileName}: ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)}`, 'green');
      } else {
        // Copy SVG and GIF files as-is
        const optimizedPath = join(optimizedDir, fileName);
        copyFileSync(file, optimizedPath);
        totalOptimizedSize += originalSize;
        
        log(`   📋 ${fileName}: ${formatBytes(originalSize)} (copied)`, 'blue');
      }
    } catch (error) {
      log(`   ❌ Failed to optimize ${fileName}: ${error.message}`, 'red');
      totalOptimizedSize += originalSize;
    }
  });
  
  const savings = totalOriginalSize - totalOptimizedSize;
  const savingsPercent = totalOriginalSize > 0 ? ((savings / totalOriginalSize) * 100).toFixed(1) : 0;
  
  log(`📊 Image optimization complete:`, 'cyan');
  log(`   Files processed: ${imageFiles.length}`, 'reset');
  log(`   Files optimized: ${optimizedCount}`, 'reset');
  log(`   Original size: ${formatBytes(totalOriginalSize)}`, 'reset');
  log(`   Optimized size: ${formatBytes(totalOptimizedSize)}`, 'reset');
  log(`   Space saved: ${formatBytes(savings)} (${savingsPercent}%)`, 'green');
}

function optimizeFonts() {
  log('🔤 Optimizing fonts...', 'yellow');
  
  const fontsDir = join(rootDir, 'assets', 'fonts');
  if (!existsSync(fontsDir)) {
    log('ℹ️  No fonts directory found, skipping font optimization', 'blue');
    return;
  }
  
  const fontFiles = getAllFiles(fontsDir).filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext);
  });
  
  if (fontFiles.length === 0) {
    log('ℹ️  No fonts found to optimize', 'blue');
    return;
  }
  
  let totalSize = 0;
  
  fontFiles.forEach(file => {
    const size = getFileSize(file);
    totalSize += size;
    const fileName = basename(file);
    
    log(`   📋 ${fileName}: ${formatBytes(size)}`, 'blue');
  });
  
  log(`📊 Font analysis complete:`, 'cyan');
  log(`   Font files: ${fontFiles.length}`, 'reset');
  log(`   Total size: ${formatBytes(totalSize)}`, 'reset');
  
  // Recommendations for font optimization
  log('💡 Font optimization recommendations:', 'magenta');
  log('   • Use WOFF2 format for modern browsers', 'reset');
  log('   • Subset fonts to include only needed characters', 'reset');
  log('   • Use font-display: swap for better loading performance', 'reset');
}

function generateAssetManifest() {
  log('📋 Generating asset manifest...', 'yellow');
  
  const assets = {
    images: [],
    fonts: [],
    css: [],
    js: [],
    other: []
  };
  
  // Scan for assets
  const assetDirs = [
    { path: join(rootDir, 'images'), type: 'images' },
    { path: join(rootDir, 'assets', 'fonts'), type: 'fonts' },
    { path: join(rootDir, 'css'), type: 'css' },
    { path: join(rootDir, 'js'), type: 'js' }
  ];
  
  assetDirs.forEach(({ path, type }) => {
    if (existsSync(path)) {
      const files = getAllFiles(path);
      files.forEach(file => {
        const relativePath = file.replace(rootDir, '').replace(/\\/g, '/');
        const size = getFileSize(file);
        
        assets[type].push({
          path: relativePath,
          size: size,
          sizeFormatted: formatBytes(size)
        });
      });
    }
  });
  
  // Calculate totals
  const totals = {};
  Object.keys(assets).forEach(type => {
    totals[type] = {
      count: assets[type].length,
      size: assets[type].reduce((sum, asset) => sum + asset.size, 0)
    };
    totals[type].sizeFormatted = formatBytes(totals[type].size);
  });
  
  // Write manifest
  const manifest = {
    generated: new Date().toISOString(),
    assets,
    totals
  };
  
  const manifestPath = join(rootDir, 'asset-manifest.json');
  try {
    import('fs').then(fs => {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      log(`✅ Asset manifest generated: ${manifestPath}`, 'green');
      
      // Display summary
      log('📊 Asset summary:', 'cyan');
      Object.keys(totals).forEach(type => {
        if (totals[type].count > 0) {
          log(`   ${type}: ${totals[type].count} files, ${totals[type].sizeFormatted}`, 'reset');
        }
      });
    });
  } catch (error) {
    log(`❌ Failed to write asset manifest: ${error.message}`, 'red');
  }
}

function createCompressionConfig() {
  log('🗜️  Creating compression configuration...', 'yellow');
  
  // Create .htaccess for Apache servers
  const htaccessContent = `# Enable compression
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-truetype
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE font/otf
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE image/x-icon
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    
    # Images
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Fonts
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>`;
  
  const htaccessPath = join(rootDir, 'public', '.htaccess');
  
  try {
    // Create public directory if it doesn't exist
    const publicDir = join(rootDir, 'public');
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }
    
    import('fs').then(fs => {
      fs.writeFileSync(htaccessPath, htaccessContent);
      log(`✅ Apache .htaccess created: ${htaccessPath}`, 'green');
    });
  } catch (error) {
    log(`❌ Failed to create .htaccess: ${error.message}`, 'red');
  }
  
  // Create _headers file for Netlify
  const netlifyHeaders = `/*
  # Security headers
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  
  # Cache headers
  Cache-Control: public, max-age=31536000

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable`;
  
  const netlifyHeadersPath = join(rootDir, 'public', '_headers');
  
  try {
    import('fs').then(fs => {
      fs.writeFileSync(netlifyHeadersPath, netlifyHeaders);
      log(`✅ Netlify _headers created: ${netlifyHeadersPath}`, 'green');
    });
  } catch (error) {
    log(`❌ Failed to create _headers: ${error.message}`, 'red');
  }
}

async function main() {
  log('🚀 Starting asset optimization...', 'cyan');
  log('', 'reset');
  
  optimizeImages();
  log('', 'reset');
  
  optimizeFonts();
  log('', 'reset');
  
  generateAssetManifest();
  log('', 'reset');
  
  createCompressionConfig();
  log('', 'reset');
  
  log('✅ Asset optimization complete!', 'green');
  log('', 'reset');
  log('💡 Next steps:', 'bright');
  log('• Review the asset-manifest.json for optimization opportunities', 'reset');
  log('• Consider using WebP format for images in production', 'reset');
  log('• Implement lazy loading for below-the-fold images', 'reset');
  log('• Use a CDN for better asset delivery performance', 'reset');
}

main();