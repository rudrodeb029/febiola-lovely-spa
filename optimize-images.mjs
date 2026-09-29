import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const assetsDir = path.resolve('src/assets');
const files = fs.readdirSync(assetsDir);

console.log('Optimizing images in:', assetsDir);

for (const file of files) {
  if (/\.(jpe?g|png)$/i.test(file)) {
    const inputPath = path.join(assetsDir, file);
    const parsed = path.parse(file);
    const webpPath = path.join(assetsDir, `${parsed.name}.webp`);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let pipeline = sharp(inputPath);
    if (metadata.width && metadata.width > 1600) {
      pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
    }

    await pipeline
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    const oldStat = fs.statSync(inputPath);
    const newStat = fs.statSync(webpPath);
    const savings = (((oldStat.size - newStat.size) / oldStat.size) * 100).toFixed(1);

    console.log(`Converted ${file} (${(oldStat.size / 1024).toFixed(0)} KB) -> ${parsed.name}.webp (${(newStat.size / 1024).toFixed(0)} KB) [Saved ${savings}%]`);
  }
}

console.log('All images optimized successfully to WebP!');
