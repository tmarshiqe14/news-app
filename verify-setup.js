#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying AI News Hub Setup...\n');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  '.eslintrc.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/app/not-found.tsx',
  'src/app/article/[id]/page.tsx',
  'src/components/NewsCard.tsx',
  'src/components/AIChatbot.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/badge.tsx',
  'src/lib/utils.ts',
  'src/types/news.ts',
  'src/data/mockNews.ts',
  'README.md',
  'setup.md'
];

const requiredDirs = [
  'src',
  'src/app',
  'src/app/article',
  'src/app/article/[id]',
  'src/components',
  'src/components/ui',
  'src/lib',
  'src/types',
  'src/data'
];

let allGood = true;

console.log('📁 Checking directories...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING`);
    allGood = false;
  }
});

console.log('\n📄 Checking files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

console.log('\n📊 Summary:');
if (allGood) {
  console.log('🎉 All files and directories are present!');
  console.log('\n🚀 Next steps:');
  console.log('1. Install Node.js (see setup.md for instructions)');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run dev');
  console.log('4. Open: http://localhost:3000');
} else {
  console.log('⚠️  Some files are missing. Please check the errors above.');
}

console.log('\n📚 For detailed setup instructions, see setup.md');
