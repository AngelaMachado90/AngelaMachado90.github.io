import fs from 'fs';
import path from 'path';

const cssRoot = path.resolve('css');

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.css')) out.push(p);
  }
  return out;
}

function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '');
}

const files = walk(cssRoot);

const definedVars = new Set();
const usedVars = new Set();
const keyframes = new Set();
const usedAnimations = new Set();

const selectorFiles = new Map();

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  text = stripComments(text);

  // :root variable definitions
  const roots = text.match(/:root\s*\{[\s\S]*?\}/g);
  if (roots) {
    for (const block of roots) {
      const defRe = /--([A-Za-z0-9_-]+)\s*:/g;
      let m;
      while ((m = defRe.exec(block))) definedVars.add(m[1]);
    }
  }

  // var(--x)
  const useRe = /var\(--([A-Za-z0-9_-]+)\)/g;
  let m;
  while ((m = useRe.exec(text))) usedVars.add(m[1]);

  // @keyframes
  const kfRe = /@keyframes\s+([A-Za-z0-9_-]+)/g;
  while ((m = kfRe.exec(text))) keyframes.add(m[1]);

  // animation: name ...;
  const animRe = /animation\s*:\s*([^;]+);/g;
  while ((m = animRe.exec(text))) {
    const parts = m[1].trim().split(/\s+/);
    if (!parts.length) continue;
    const name = parts[0];
    if (!name || name === 'none' || name.includes('var(')) continue;
    usedAnimations.add(name);
  }

  // selectors for duplicates
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      const selectorText = text.slice(start, i).trim();
      start = i + 1;
      if (!selectorText) continue;
      if (selectorText.startsWith('@')) continue;
      if (selectorText.includes('@')) continue;

      const selectors = selectorText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      for (const sel of selectors) {
        if (!selectorFiles.has(sel)) selectorFiles.set(sel, new Set());
        selectorFiles.get(sel).add(file);
      }
    } else if (ch === '}') {
      start = i + 1;
    }
  }
}

const undefinedVars = [...usedVars].filter((v) => !definedVars.has(v)).sort();
const missingKeyframes = [...usedAnimations].filter((a) => !keyframes.has(a)).sort();

const dup = [];
for (const [sel, set] of selectorFiles.entries()) {
  if (set.size > 1) dup.push([sel, [...set].map((f) => path.relative(process.cwd(), f)).sort()]);
}

dup.sort((a, b) => b[1].length - a[1].length);

function printList(title, arr, max = 30) {
  console.log(`\n${title}: ${arr.length}`);
  for (const item of arr.slice(0, max)) console.log(`- ${item}`);
  if (arr.length > max) console.log(`- ... +${arr.length - max} more`);
}

console.log('CSS Audit');
console.log(`Files scanned: ${files.length}`);

printList('Undefined CSS variables', undefinedVars);
printList('Missing keyframes', missingKeyframes);

console.log(`\nDuplicate selectors across files: ${dup.length}`);
for (const [sel, fl] of dup.slice(0, 20)) {
  console.log(`- ${sel}  (${fl.length})`);
  for (const f of fl.slice(0, 5)) console.log(`  - ${f}`);
  if (fl.length > 5) console.log(`  - ... +${fl.length - 5} more`);
}
