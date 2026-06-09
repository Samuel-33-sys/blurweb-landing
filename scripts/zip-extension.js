import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionDir = path.join(__dirname, '..', 'public', 'extension');
const outputPath = path.join(__dirname, '..', 'public', 'extension-beta.zip');

function addFolderToZip(zipInstance, folderPath, rootDir) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const relativePath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFolderToZip(zipInstance, fullPath, rootDir);
    } else {
      const content = fs.readFileSync(fullPath);
      // Use forward slashes for zip internal paths to ensure compatibility with Windows/macOS/Linux
      const normalizedPath = relativePath.split(path.sep).join('/');
      zipInstance.file(normalizedPath, content);
      console.log(`Added: ${normalizedPath}`);
    }
  }
}

async function createZip() {
  console.log('Zipping extension from:', extensionDir);
  console.log('Outputting zip to:', outputPath);

  if (!fs.existsSync(extensionDir)) {
    console.error('Error: public/extension folder does not exist!');
    process.exit(1);
  }

  const zip = new JSZip();
  addFolderToZip(zip, extensionDir, extensionDir);

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(outputPath, content);
  console.log('Successfully created extension-beta.zip!');
}

createZip().catch((err) => {
  console.error('Error zipping extension:', err);
  process.exit(1);
});
