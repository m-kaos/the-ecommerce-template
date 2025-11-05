const fs = require('fs');
const path = require('path');

const storeFrontDir = path.join(__dirname, 'storefront');

// Files to clean
const filesToClean = [
  'components/SearchBar.tsx',
  'app/checkout/page.tsx',
  'app/checkout/success/page.tsx',
  'contexts/AuthContext.tsx',
  'app/login/page.tsx',
  'app/page.tsx',
  'app/search/page.tsx',
  'app/products/page.tsx',
  'components/ProductsWithFilters.tsx',
  'app/account/orders/page.tsx',
  'app/account/page.tsx',
  'app/products/[slug]/page.tsx',
  'contexts/CartContext.tsx',
];

function removeConsoleLogs(filePath) {
  const fullPath = path.join(storeFrontDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalLength = content.length;

  // Remove console.log statements (single line and multiline)
  // Match console.log(...); including multiline
  content = content.replace(/console\.log\([^;]*\);?\n?/gs, '');

  // Remove standalone console.error for non-critical errors (keep ones in catch blocks)
  // But keep console.error in catch blocks - we'll be more selective

  // Remove console.warn
  content = content.replace(/console\.warn\([^;]*\);?\n?/gs, '');

  // Clean up extra blank lines (max 2 consecutive blank lines)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (content.length !== originalLength) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Cleaned ${filePath} (removed ${originalLength - content.length} characters)`);
  } else {
    console.log(`- No changes needed for ${filePath}`);
  }
}

console.log('Removing console.log statements from storefront...\n');

filesToClean.forEach(removeConsoleLogs);

console.log('\n✓ Done! Console logs have been removed.');
console.log('Note: console.error statements in catch blocks have been preserved for error tracking.');
