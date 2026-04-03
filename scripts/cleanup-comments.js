// scripts/cleanup-comments.js
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const ARGS = process.argv.slice(2);
const TARGET_DIR = ARGS[0] || '.';
const DRY_RUN = ARGS.includes('--dry-run');

// Padrões para remover
const PATTERNS = {
  js: [
    // Comentários de linha
    /\/\/.*(?<!http:)(?<!https:)$/gm,
    // Comentários de bloco (não JSDoc)
    /\/\*[\s\S]*?\*\//g,
    // Console.log em produção (opcional)
    /console\.(log|debug|info)\([^)]*\);?/g,
    // Código comentado (linhas que começam com // seguido de código)
    /^.*\/\/\s*(const|let|var|function|class|import|export)\s+.*$/gm,
  ],
  ts: [
    /\/\/.*(?<!http:)(?<!https:)$/gm,
    /\/\*[\s\S]*?\*\//g,
    /console\.(log|debug|info)\([^)]*\);?/g,
  ],
  jsx: [
    /\/\/.*(?<!http:)(?<!https:)$/gm,
    /\/\*[\s\S]*?\*\//g,
    /{?\/\*[\s\S]*?\*\/}?/g,
  ],
};

function isCodeFile(file) {
  return ['.js', '.ts', '.jsx', '.tsx'].includes(extname(file));
}

function cleanupContent(content, ext) {
  const extKey = ext.replace('.', '');
  const patterns = PATTERNS[extKey] || PATTERNS.js;
  
  let cleaned = content;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Remover linhas vazias múltiplas
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return cleaned.trim() + '\n';
}

function processDirectory(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Pular pastas ignoradas
      if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(file)) {
        continue;
      }
      processDirectory(fullPath);
    } else if (isCodeFile(file) && !file.includes('.test.') && !file.includes('.spec.')) {
      const content = readFileSync(fullPath, 'utf-8');
      const cleaned = cleanupContent(content, extname(file));
      
      if (content !== cleaned) {
        const removed = content.split('\n').length - cleaned.split('\n').length;
        console.log(`🧹 ${fullPath}: -${removed} linhas`);
        
        if (!DRY_RUN) {
          writeFileSync(fullPath, cleaned, 'utf-8');
        }
      }
    }
  }
}

// Executar
console.log(`Processando: ${TARGET_DIR}${DRY_RUN ? ' (DRY RUN)' : ''}`);
processDirectory(TARGET_DIR);
console.log('Limpeza concluída!');