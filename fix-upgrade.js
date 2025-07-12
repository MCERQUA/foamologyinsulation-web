#!/usr/bin/env node

console.log('🔧 Fixing ComfortCo Website after Astro v5 upgrade...\n');

const { execSync } = require('child_process');

try {
  // Clean install to ensure all dependencies are correct
  console.log('📦 Cleaning and reinstalling dependencies...');
  execSync('npm ci', { stdio: 'inherit' });
  
  console.log('\n✅ Setup complete!\n');
  console.log('To start the development server, run:');
  console.log('  npm run dev\n');
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  console.log('\nTry running these commands manually:');
  console.log('  npm install');
  console.log('  npm run dev');
}
