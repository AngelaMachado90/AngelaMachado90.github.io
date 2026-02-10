// scripts/consolidate-animations.js
/**
 * Encontra e consolida todas as @keyframes do projeto em um único arquivo
 */

import fs from "fs";
import path from "path";

async function consolidateAnimations() {
  console.log("🔍 Buscando animações em todos os arquivos CSS...\n");

  const cssFiles = await findCSSFiles("./css");
  const allAnimations = new Map(); // Nome -> Conteúdo (evita duplicatas)

  // Coletar todas as animações
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, "utf8");
    const animations = extractAnimations(content);

    animations.forEach(({ name, content: animationContent }) => {
      if (!allAnimations.has(name)) {
        allAnimations.set(name, {
          content: animationContent,
          source: path.relative("./css", file),
        });
      }
    });
  }

  console.log(`📊 Encontradas ${allAnimations.size} animações únicas:\n`);

  // Criar arquivo consolidado
  const animationsPath = "./css/animations.css";
  let consolidatedContent = `/* ============================================================================
   ANIMATIONS.CSS - Sistema Unificado de Animações
   Arquivo consolidado de ${allAnimations.size} animações
   Data: ${new Date().toLocaleDateString()}
   ============================================================================ */

/* VARIÁVEIS DE CONTROLE */
:root {
  /* Durações padronizadas */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  --duration-slowest: 1000ms;
  
  /* Easing functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ============================================================================
   ANIMAÇÕES CONSOLIDADAS
   ============================================================================ */

`;

  // Adicionar animações em ordem alfabética
  const sortedNames = Array.from(allAnimations.keys()).sort();

  sortedNames.forEach((name) => {
    const { content, source } = allAnimations.get(name);
    consolidatedContent += `/* Origem: ${source} */\n${content}\n\n`;
    console.log(`  • ${name} (de: ${source})`);
  });

  // Adicionar classes utilitárias
  consolidatedContent += `/* ============================================================================
   CLASSES UTILITÁRIAS
   ============================================================================ */

.animate-fade-in {
  animation: fadeIn var(--duration-base) var(--ease-out) both;
}

.animate-fade-up {
  animation: fadeUp var(--duration-base) var(--ease-out) both;
}

.animate-pulse {
  animation: pulse var(--duration-slower) var(--ease-in-out) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsividade */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}`;

  // Salvar arquivo
  fs.writeFileSync(animationsPath, consolidatedContent);

  // Remover @keyframes dos arquivos originais (opcional)
  console.log("\n🔄 Removendo @keyframes dos arquivos originais...");

  for (const file of cssFiles) {
    if (file === animationsPath) continue; // Não modificar o novo arquivo

    let content = fs.readFileSync(file, "utf8");
    const originalLength = content.length;

    // Remover @keyframes
    sortedNames.forEach((name) => {
      const keyframeRegex = new RegExp(
        `@keyframes ${name}[^{]*{[^}]*}[^}]*}`,
        "gs",
      );
      content = content.replace(keyframeRegex, "");
    });

    // Remover linhas vazias extras
    content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

    if (content.length !== originalLength) {
      fs.writeFileSync(file, content);
      console.log(`  ✓ Limpado: ${path.relative("./css", file)}`);
    }
  }

  console.log("\n✅ Animações consolidadas em:", animationsPath);
  console.log("\n📝 Próximos passos:");
  console.log("   1. Verifique se todas as animações estão funcionando");
  console.log("   2. Teste performance (especialmente em mobile)");
  console.log("   3. Atualize imports no main.css");
}

async function findCSSFiles(dir) {
  const files = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      // Ignorar node_modules e outras pastas
      if (
        ["node_modules", ".git", "dist", "build", "_legacy"].includes(item.name)
      ) {
        continue;
      }

      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        files.push(...(await findCSSFiles(fullPath)));
      } else if (item.name.endsWith(".css")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Erro ao acessar ${dir}:`, error.message);
  }

  return files;
}

function extractAnimations(content) {
  const animations = [];
  const keyframeRegex = /@keyframes\s+([^{]+)\s*{([^}]+(?:\{[^}]*\}[^}]*)*)}/gs;

  let match;
  while ((match = keyframeRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const body = match[2];
    animations.push({
      name,
      content: `@keyframes ${name} {${body}}`,
    });
  }

  return animations;
}

// Executar consolidação
consolidateAnimations();
