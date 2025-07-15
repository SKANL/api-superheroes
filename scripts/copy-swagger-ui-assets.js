// Script para copiar assets de Swagger UI a la carpeta pública custom (ESM)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../node_modules/swagger-ui-dist');
const destDir = path.join(__dirname, '../src/infrastructure/web/public/swagger-custom');

const files = [
  'swagger-ui.css',
  'swagger-ui-bundle.js',
  'swagger-ui-standalone-preset.js'
];

for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${file} to ${dest}`);
}
console.log('Swagger UI assets copied successfully.');
