#!/usr/bin/env node

/**
 * Deployment script for static hosting platforms
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
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

function checkPrerequisites() {
  log('🔍 Checking deployment prerequisites...', 'yellow');
  
  // Check if dist folder exists
  const distPath = join(rootDir, 'dist');
  if (!existsSync(distPath)) {
    log('❌ Build output not found. Run "npm run build" first.', 'red');
    process.exit(1);
  }
  
  // Check if package.json exists
  const packagePath = join(rootDir, 'package.json');
  if (!existsSync(packagePath)) {
    log('❌ package.json not found.', 'red');
    process.exit(1);
  }
  
  log('✅ Prerequisites check passed', 'green');
}

function deployToNetlify() {
  log('🚀 Deploying to Netlify...', 'cyan');
  
  try {
    // Check if Netlify CLI is installed
    execSync('netlify --version', { stdio: 'pipe' });
  } catch (error) {
    log('❌ Netlify CLI not found. Install it with: npm install -g netlify-cli', 'red');
    process.exit(1);
  }
  
  try {
    // Deploy to Netlify
    execSync('netlify deploy --prod --dir=dist', {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    log('✅ Successfully deployed to Netlify!', 'green');
  } catch (error) {
    log('❌ Netlify deployment failed', 'red');
    process.exit(1);
  }
}

function deployToVercel() {
  log('🚀 Deploying to Vercel...', 'cyan');
  
  try {
    // Check if Vercel CLI is installed
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    log('❌ Vercel CLI not found. Install it with: npm install -g vercel', 'red');
    process.exit(1);
  }
  
  try {
    // Deploy to Vercel
    execSync('vercel --prod', {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    log('✅ Successfully deployed to Vercel!', 'green');
  } catch (error) {
    log('❌ Vercel deployment failed', 'red');
    process.exit(1);
  }
}

function deployToGitHubPages() {
  log('🚀 Deploying to GitHub Pages...', 'cyan');
  
  try {
    // Check if gh-pages is installed
    execSync('npx gh-pages --version', { stdio: 'pipe' });
  } catch (error) {
    log('❌ gh-pages not found. Install it with: npm install --save-dev gh-pages', 'red');
    process.exit(1);
  }
  
  try {
    // Deploy to GitHub Pages
    execSync('npx gh-pages -d dist', {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    log('✅ Successfully deployed to GitHub Pages!', 'green');
  } catch (error) {
    log('❌ GitHub Pages deployment failed', 'red');
    process.exit(1);
  }
}

function showDeploymentOptions() {
  log('📋 Available deployment options:', 'bright');
  log('', 'reset');
  log('1. Netlify:', 'cyan');
  log('   npm run deploy:netlify', 'reset');
  log('', 'reset');
  log('2. Vercel:', 'cyan');
  log('   npm run deploy:vercel', 'reset');
  log('', 'reset');
  log('3. GitHub Pages:', 'cyan');
  log('   npm run deploy:github', 'reset');
  log('', 'reset');
  log('4. Manual deployment:', 'cyan');
  log('   Upload the "dist" folder to your hosting provider', 'reset');
  log('', 'reset');
}

async function main() {
  const platform = process.argv[2];
  
  if (!platform) {
    log('🚀 Portfolio Deployment Script', 'bright');
    log('', 'reset');
    showDeploymentOptions();
    return;
  }
  
  checkPrerequisites();
  
  switch (platform.toLowerCase()) {
    case 'netlify':
      deployToNetlify();
      break;
    case 'vercel':
      deployToVercel();
      break;
    case 'github':
    case 'gh-pages':
      deployToGitHubPages();
      break;
    default:
      log(`❌ Unknown platform: ${platform}`, 'red');
      showDeploymentOptions();
      process.exit(1);
  }
}

main();