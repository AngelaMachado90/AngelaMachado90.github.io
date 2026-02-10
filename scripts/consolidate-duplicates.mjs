// scripts/consolidate-duplicates.js
import fs from 'fs';
import path from 'path';

async function consolidateDuplicates() {
  console.log('🔍 Consolidando seletores duplicados...\n');
  
  // Mapeamento de onde cada seletor deve ficar
  const selectorLocations = {
    // Layout helpers → components/_layout-helpers.css
    '.modern-card': 'components/_layout-helpers.css',
    '.solutions-grid': 'components/_layout-helpers.css',
    '.diferenciais-grid': 'components/_layout-helpers.css',
    '.timeline': 'components/_layout-helpers.css',
    '.timeline::before': 'components/_layout-helpers.css',
    '.timeline-number': 'components/_layout-helpers.css',
    '.timeline-item': 'components/_layout-helpers.css',
    '.timeline-content': 'components/_layout-helpers.css',
    '.features-list': 'components/_layout-helpers.css',
    
    // Components específicos
    '.cta-buttons': 'components/_buttons.css',
    '.form-group': 'components/_forms.css',
    
    // Demos (manter apenas nos demos se forem diferentes)
    'section.cta-section': 'DONT_CONSOLIDATE', // Mantém em cada demo
    'h2.section-title': 'DONT_CONSOLIDATE', // Mantém em cada demo
  };
  
  const files = findCSSFiles('./css');
  const selectorMap = new Map();
  
  // Coletar todos os seletores
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const selectors = extractSelectors(content);
    
    selectors.forEach(selector => {
      if (!selectorMap.has(selector.name)) {
        selectorMap.set(selector.name, []);
      }
      selectorMap.get(selector.name).push({
        file,
        content: selector.content
      });
    });
  });
  
  // Identificar duplicações problemáticas
  const problematic = Array.from(selectorMap.entries())
    .filter(([name, occurrences]) => occurrences.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
  
  console.log(`📊 ${problematic.length} seletores com duplicações:\n`);
  
  problematic.forEach(([selector, occurrences]) => {
    const targetFile = selectorLocations[selector];
    
    if (targetFile === 'DONT_CONSOLIDATE') {
      console.log(`  • ${selector}: ${occurrences.length}x (MANTIDO em demos)`);
      return;
    }
    
    console.log(`  • ${selector}: ${occurrences.length}x → ${targetFile || 'DECIDIR'}`);
    
    if (targetFile) {
      // Consolidar no arquivo alvo
      consolidateSelector(selector, occurrences, targetFile);
      
      // Remover dos outros arquivos
      occurrences.forEach(occurrence => {
        if (!occurrence.file.includes(targetFile)) {
          removeSelector(occurrence.file, selector, occurrence.content);
        }
      });
    }
  });
}

function consolidateSelector(selector, occurrences, targetFile) {
  const targetPath = `./css/${targetFile}`;
  let targetContent = fs.existsSync(targetPath) 
    ? fs.readFileSync(targetPath, 'utf8')
    : '';
  
  // Verificar se já existe no alvo
  if (!targetContent.includes(selector)) {
    // Adicionar o primeiro exemplo
    const bestOccurrence = occurrences.find(o => o.file.includes('components')) || occurrences[0];
    targetContent += `\n\n/* Consolidadode de ${occurrences.length} lugares */\n${bestOccurrence.content}`;
    fs.writeFileSync(targetPath, targetContent);
    console.log(`    ✓ Consolidado em ${targetFile}`);
  }
}

function removeSelector(filePath, selector, content) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Remover o seletor (cuidado para não remover comentários úteis)
  const lines = fileContent.split('\n');
  let inSelector = false;
  let braceCount = 0;
  let newContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes(selector) && line.includes('{')) {
      inSelector = true;
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      continue; // Pula esta linha
    }
    
    if (inSelector) {
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      if (braceCount <= 0) {
        inSelector = false;
      }
      continue;
    }
    
    newContent.push(line);
  }
  
  fs.writeFileSync(filePath, newContent.join('\n'));
}

// Funções auxiliares (findCSSFiles, extractSelectors) similares às anteriores

consolidateDuplicates();