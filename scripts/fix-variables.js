// scripts/fix-variables.js
import fs from 'fs';
import path from 'path';

const migrationMap = {
  // Font weights (antigo → novo)
  '--fw-light': '--font-weight-light',
  '--fw-normal': '--font-weight-normal', 
  '--fw-medium': '--font-weight-medium',
  '--fw-semibold': '--font-weight-semibold',
  '--fw-bold': '--font-weight-bold',
  '--fw-extrabold': '--font-weight-extrabold',
  
  // Font sizes (antigo → novo)
  '--fs-xs': '--font-size-xs',
  '--fs-sm': '--font-size-sm',
  '--fs-base': '--font-size-base',
  '--fs-lg': '--font-size-lg',
  '--fs-xl': '--font-size-xl',
  '--fs-2xl': '--font-size-2xl',
  '--fs-3xl': '--font-size-3xl',
  '--fs-4xl': '--font-size-4xl',
  '--fs-5xl': '--font-size-5xl',
  
  // Cores antigas (error, info, success, warning)
  '--error-50': '--color-error-50',
  '--error-300': '--color-error-300',
  '--error-500': '--color-error-500',
  '--error-700': '--color-error-700',
  '--info-50': '--color-info-50',
  '--info-500': '--color-info-500',
  '--info-700': '--color-info-700',
  '--success-50': '--color-success-50',
  '--success-300': '--color-success-300',
  '--success-500': '--color-success-500',
  '--success-700': '--color-success-700',
  '--warning-50': '--color-warning-50',
  '--warning-100': '--color-warning-100',
  '--warning-300': '--color-warning-300',
  '--warning-500': '--color-warning-500',
  '--warning-600': '--color-warning-600',
  '--warning-700': '--color-warning-700',
  
  // Durations
  '--duration-200': '--duration-base',
  '--duration-300': '--duration-base',
  
  // Cores primárias
  '--color-secondary-50': '--color-neutral-50', // Ou defina no variables.css
  '--color-secondary-800': '--color-secondary-700',
  '--color-error-600': '--color-error-700',
  '--color-success-600': '--color-success-700',
  '--color-warning-100': '--color-warning-50',
  '--color-warning-600': '--color-warning-700',
};

function migrateVariables() {
  console.log('🔄 Migrando variáveis CSS antigas para novas...\n');
  
  const cssFiles = findCSSFiles('./css');
  let totalChanges = 0;
  
  cssFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changes = 0;
    
    Object.entries(migrationMap).forEach(([oldVar, newVar]) => {
      const regex = new RegExp(oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, newVar);
        changes += matches.length;
        console.log(`  ${file}: ${oldVar} → ${newVar} (${matches.length}x)`);
      }
    });
    
    if (changes > 0) {
      fs.writeFileSync(file, content);
      totalChanges += changes;
    }
  });
  
  console.log(`\n✅ ${totalChanges} variáveis migradas em ${cssFiles.length} arquivos`);
}

function findCSSFiles(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      if (['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
        continue;
      }
      
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        files.push(...findCSSFiles(fullPath));
      } else if (item.name.endsWith('.css')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignorar
  }
  
  return files;
}

migrateVariables();
