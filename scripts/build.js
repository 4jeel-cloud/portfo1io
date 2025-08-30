#!/usr/bin/env node

/**
 * Production build script with optimization and validation
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
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

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(currentPath) {
    const stats = statSync(currentPath);
    
    if (stats.isDirectory()) {
      const files = readdirSync(currentPath);
      files.forEach(file => {
        calculateSize(join(currentPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  if (existsSync(dirPath)) {
    calculateSize(dirPath);
  }
  
  return totalSize;
}

async function runBuild() {
  try {
    log('🚀 Starting production build process...', 'cyan');
    log('', 'reset');
    
    // Step 1: Clean previous build
    log('📁 Cleaning previous build...', 'yellow');
    const distPath = join(rootDir, 'dist');
    if (existsSync(distPath)) {
      rmSync(distPath, { recursive: true, force: true });
      log('✅ Previous build cleaned', 'green');
    } else {
      log('ℹ️  No previous build found', 'blue');
    }
    log('', 'reset');
    
    // Step 2: Run linting
    log('🔍 Running code linting...', 'yellow');
    try {
      execSync('npm run lint', { 
        stdio: 'inherit', 
        cwd: rootDir,
        encoding: 'utf8'
      });
      log('✅ Linting passed', 'green');
    } catch (error) {
      log('❌ Linting failed', 'red');
      process.exit(1);
    }
    log('', 'reset');
    
    // Step 3: Run tests
    log('🧪 Running tests...', 'yellow');
    try {
      execSync('npm run test', { 
        stdio: 'inherit', 
        cwd: rootDir,
        encoding: 'utf8'
      });
      log('✅ All tests passed', 'green');
    } catch (error) {
      log('❌ Tests failed', 'red');
      process.exit(1);
    }
    log('', 'reset');
    
    // Step 4: Build application
    log('🏗️  Building application...', 'yellow');
    const buildStart = Date.now();
    
    try {
      execSync('vite build', { 
        stdio: 'inherit', 
        cwd: rootDir,
        encoding: 'utf8'
      });
      
      const buildTime = Date.now() - buildStart;
      log(`✅ Build completed in ${buildTime}ms`, 'green');
    } catch (error) {
      log('❌ Build failed', 'red');
      process.exit(1);
    }
    log('', 'reset');
    
    // Step 5: Analyze build output
    log('📊 Analyzing build output...', 'yellow');
    
    if (existsSync(distPath)) {
      const totalSize = getDirectorySize(distPath);
      log(`📦 Total build size: ${formatBytes(totalSize)}`, 'cyan');
      
      // List main files
      const files = readdirSync(distPath, { withFileTypes: true });
      const mainFiles = files
        .filter(file => file.isFile())
        .map(file => {
          const filePath = join(distPath, file.name);
          const stats = statSync(filePath);
          return {
            name: file.name,
            size: stats.size
          };
        })
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);
      
      log('📋 Largest files:', 'blue');
      mainFiles.forEach(file => {
        log(`   ${file.name}: ${formatBytes(file.size)}`, 'reset');
      });
    }
    log('', 'reset');
    
    // Step 6: Success message
    log('🎉 Build process completed successfully!', 'green');
    log('', 'reset');
    log('Next steps:', 'bright');
    log('• Run "npm run preview" to test the production build locally', 'reset');
    log('• Deploy the "dist" folder to your hosting provider', 'reset');
    log('• Run "npm run deploy:netlify" or "npm run deploy:vercel" for automated deployment', 'reset');
    
  } catch (error) {
    log('❌ Build process failed:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run the build process
runBuild();