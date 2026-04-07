import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const DIRS = [
  'public/images',
  'public/team',
];

const QUALITY = {
  webp: 80,
  jpeg: 80,
};

async function compressFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);
  
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const originalStats = await stat(filePath);
  const originalSize = originalStats.size;

  // Convert to WebP
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  
  try {
    await sharp(filePath)
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(webpPath);

    const newStats = await stat(webpPath);
    const newSize = newStats.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${name} → ${basename(webpPath)}`);
    console.log(`   ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);

    // Delete original
    await unlink(filePath);
    console.log(`   🗑️  Deleted original ${name}`);
  } catch (err) {
    console.error(`❌ Failed: ${name} — ${err.message}`);
  }
}

async function processDir(dir) {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      await compressFile(join(dir, file));
    }
  } catch (err) {
    console.error(`❌ Dir error: ${dir} — ${err.message}`);
  }
}

console.log('🖼️  Starting image compression...\n');

for (const dir of DIRS) {
  console.log(`📁 Processing ${dir}/`);
  await processDir(dir);
  console.log('');
}

console.log('🎉 Done! All images compressed to WebP.');
