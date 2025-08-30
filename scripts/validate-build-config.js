#!/usr/bin/env node

/**
 * Build Configuration Validation Script
 * Validates that all build and deployment configurations are properly set up
 */

import { existsSync, readFileSync, statSync } from 'fs';
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

function checkFile(filePath, description) {
  if (existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
}

function validateJSON(filePath, description) {
  if (!existsSync(filePath)) {
    log(`❌ ${description} - File not found: ${filePath}`, 'red');
    return false;
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    JSON.parse(content);
    log(`✅ ${description} - Valid JSON`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} - Invalid JSON: ${error.message}`, 'red');
    return false;
  }
}

function validatePackageJson() {
  log('\n📦 Validating package.json...', 'cyan');
  
  const packagePath = join(rootDir, 'package.json');
  if (!validateJSON(packagePath, 'package.json exists and is valid')) {
    return false;
  }
  
  const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));
  
  // Check required fields
  const requiredFields = ['name', 'version', 'scripts', 'devDependencies'];
  let valid = true;
  
  requiredFields.forEach(field => {
    if (packageContent[field]) {
      log(`✅ package.json has ${field}`, 'green');
    } else {
      log(`❌ package.json missing ${field}`, 'red');
      valid = false;
    }
  });
  
  // Check required scripts
  const requiredScripts = ['dev', 'build', 'preview', 'test', 'lint'];
  requiredScripts.forEach(script => {
    if (packageContent.scripts && packageContent.scripts[script]) {
      log(`✅ Script '${script}' defined`, 'green');
    } else {
      log(`❌ Script '${script}' missing`, 'red');
      valid = false;
    }
  });
  
  return valid;
}

function validateViteConfig() {
  log('\n⚡ Validating Vite configuration...', 'cyan');
  
  const viteConfigPath = join(rootDir, 'vite.config.js');
  if (!checkFile(viteConfigPath, 'vite.config.js exists')) {
    return false;
  }
  
  const content = readFileSync(viteConfigPath, 'utf8');
  
  const requiredConfigs = [
    'defineConfig',
    'build',
    'rollupOptions',
    'terserOptions',
    'legacy('
  ];
  
  let valid = true;
  requiredConfigs.forEach(config => {
    if (content.includes(config)) {
      log(`✅ Vite config includes ${config}`, 'green');
    } else {
      log(`❌ Vite config missing ${config}`, 'red');
      valid = false;
    }
  });
  
  return valid;
}

function validateEnvironmentConfig() {
  log('\n🌍 Validating environment configuration...', 'cyan');
  
  let valid = true;
  
  // Check .env.example
  const envExamplePath = join(rootDir, '.env.example');
  if (checkFile(envExamplePath, '.env.example exists')) {
    const content = readFileSync(envExamplePath, 'utf8');
    const requiredVars = [
      'VITE_APP_TITLE',
      'VITE_APP_DESCRIPTION',
      'VITE_CONTACT_EMAIL'
    ];
    
    requiredVars.forEach(varName => {
      if (content.includes(varName)) {
        log(`✅ Environment variable ${varName} defined`, 'green');
      } else {
        log(`❌ Environment variable ${varName} missing`, 'red');
        valid = false;
      }
    });
  } else {
    valid = false;
  }
  
  // Check .env
  const envPath = join(rootDir, '.env');
  checkFile(envPath, '.env exists');
  
  return valid;
}

function validateDeploymentConfigs() {
  log('\n🚀 Validating deployment configurations...', 'cyan');
  
  let valid = true;
  
  // Netlify
  const netlifyConfigPath = join(rootDir, 'netlify.toml');
  if (checkFile(netlifyConfigPath, 'netlify.toml exists')) {
    const content = readFileSync(netlifyConfigPath, 'utf8');
    if (content.includes('[build]') && content.includes('publish = "dist"')) {
      log('✅ Netlify build configuration valid', 'green');
    } else {
      log('❌ Netlify build configuration invalid', 'red');
      valid = false;
    }
  } else {
    valid = false;
  }
  
  // Vercel
  const vercelConfigPath = join(rootDir, 'vercel.json');
  if (validateJSON(vercelConfigPath, 'vercel.json exists and is valid')) {
    const config = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
    if (config.builds && config.routes) {
      log('✅ Vercel configuration valid', 'green');
    } else {
      log('❌ Vercel configuration missing required fields', 'red');
      valid = false;
    }
  } else {
    valid = false;
  }
  
  // GitHub Actions
  const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
  if (checkFile(workflowPath, 'GitHub Actions workflow exists')) {
    const content = readFileSync(workflowPath, 'utf8');
    if (content.includes('Deploy Portfolio') && content.includes('npm run build')) {
      log('✅ GitHub Actions workflow valid', 'green');
    } else {
      log('❌ GitHub Actions workflow invalid', 'red');
      valid = false;
    }
  } else {
    valid = false;
  }
  
  return valid;
}

function validateBuildScripts() {
  log('\n🔧 Validating build scripts...', 'cyan');
  
  const scriptsDir = join(rootDir, 'scripts');
  let valid = true;
  
  if (!existsSync(scriptsDir)) {
    log('❌ Scripts directory missing', 'red');
    return false;
  }
  
  const requiredScripts = [
    'build.js',
    'deploy.js',
    'optimize-assets.js',
    'validate-build-config.js'
  ];
  
  requiredScripts.forEach(script => {
    const scriptPath = join(scriptsDir, script);
    if (checkFile(scriptPath, `${script} exists`)) {
      const content = readFileSync(scriptPath, 'utf8');
      if (content.includes('#!/usr/bin/env node')) {
        log(`✅ ${script} has proper shebang`, 'green');
      } else {
        log(`❌ ${script} missing shebang`, 'red');
        valid = false;
      }
    } else {
      valid = false;
    }
  });
  
  return valid;
}

function validatePerformanceConfig() {
  log('\n⚡ Validating performance configuration...', 'cyan');
  
  let valid = true;
  
  // Lighthouse config
  const lighthouseConfigPath = join(rootDir, '.lighthouserc.json');
  if (validateJSON(lighthouseConfigPath, 'Lighthouse configuration')) {
    const config = JSON.parse(readFileSync(lighthouseConfigPath, 'utf8'));
    if (config.ci && config.ci.assert && config.ci.assert.assertions) {
      log('✅ Lighthouse assertions configured', 'green');
    } else {
      log('❌ Lighthouse assertions missing', 'red');
      valid = false;
    }
  } else {
    valid = false;
  }
  
  return valid;
}

function validateSecurityConfig() {
  log('\n🔒 Validating security configuration...', 'cyan');
  
  let valid = true;
  
  // Check .gitignore
  const gitignorePath = join(rootDir, '.gitignore');
  if (checkFile(gitignorePath, '.gitignore exists')) {
    const content = readFileSync(gitignorePath, 'utf8');
    const sensitivePatterns = ['node_modules', '.env', 'dist'];
    
    sensitivePatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        log(`✅ .gitignore includes ${pattern}`, 'green');
      } else {
        log(`❌ .gitignore missing ${pattern}`, 'red');
        valid = false;
      }
    });
  } else {
    valid = false;
  }
  
  // Check for security headers in deployment configs
  const netlifyConfigPath = join(rootDir, 'netlify.toml');
  if (existsSync(netlifyConfigPath)) {
    const content = readFileSync(netlifyConfigPath, 'utf8');
    if (content.includes('X-Frame-Options')) {
      log('✅ Security headers configured in Netlify', 'green');
    } else {
      log('❌ Security headers missing in Netlify config', 'red');
      valid = false;
    }
  }
  
  return valid;
}

function validateCodeQuality() {
  log('\n📝 Validating code quality configuration...', 'cyan');
  
  let valid = true;
  
  // ESLint config
  const eslintConfigPath = join(rootDir, '.eslintrc.json');
  if (validateJSON(eslintConfigPath, 'ESLint configuration')) {
    log('✅ ESLint configuration valid', 'green');
  } else {
    valid = false;
  }
  
  // Prettier config
  const prettierConfigPath = join(rootDir, '.prettierrc');
  if (validateJSON(prettierConfigPath, 'Prettier configuration')) {
    log('✅ Prettier configuration valid', 'green');
  } else {
    valid = false;
  }
  
  return valid;
}

async function main() {
  log('🔍 Build Configuration Validation', 'bright');
  log('=====================================', 'bright');
  
  const validations = [
    validatePackageJson,
    validateViteConfig,
    validateEnvironmentConfig,
    validateDeploymentConfigs,
    validateBuildScripts,
    validatePerformanceConfig,
    validateSecurityConfig,
    validateCodeQuality
  ];
  
  let allValid = true;
  
  for (const validation of validations) {
    const result = validation();
    if (!result) {
      allValid = false;
    }
  }
  
  log('\n📊 Validation Summary', 'cyan');
  log('====================', 'cyan');
  
  if (allValid) {
    log('🎉 All build configurations are valid!', 'green');
    log('', 'reset');
    log('✅ Ready for deployment', 'green');
    log('', 'reset');
    log('Next steps:', 'bright');
    log('1. Install dependencies: npm install', 'reset');
    log('2. Run development server: npm run dev', 'reset');
    log('3. Build for production: npm run build', 'reset');
    log('4. Deploy: npm run deploy:netlify (or vercel/github)', 'reset');
  } else {
    log('❌ Some configurations are invalid or missing', 'red');
    log('Please fix the issues above before proceeding', 'yellow');
    process.exit(1);
  }
}

main();