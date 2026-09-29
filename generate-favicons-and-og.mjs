import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const assetsDir = path.resolve('src/assets');

// 1. Generate high-resolution PNG favicons and apple-touch-icon from favicon.svg
const svgBuffer = fs.readFileSync(path.join(publicDir, 'favicon.svg'));

await sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'favicon.png'));

await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));

await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(path.join(publicDir, 'favicon-32x32.png'));

await sharp(svgBuffer)
  .resize(16, 16)
  .png()
  .toFile(path.join(publicDir, 'favicon-16x16.png'));

// Also overwrite favicon.ico with the 64x64 PNG format (standard modern browsers support PNG favicon.ico)
await sharp(svgBuffer)
  .resize(64, 64)
  .png()
  .toFile(path.join(publicDir, 'favicon.ico'));

console.log('✓ Favicons and Apple touch icons generated successfully!');

// 2. Generate 1200x630 Open Graph (og-image.jpg) for social link previews
const heroBgPath = path.join(assetsDir, 'spa-reserve.webp');

const ogSvgOverlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="overlayGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A110B" stop-opacity="0.92"/>
      <stop offset="50%" stop-color="#2D1D12" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#1A110B" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#overlayGrad)"/>
  <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#E5C378" stroke-width="2" stroke-opacity="0.4"/>
  <circle cx="600" cy="180" r="60" fill="#4A3423" stroke="#E5C378" stroke-width="3" stroke-opacity="0.8"/>
  
  <!-- Flower Icon -->
  <g transform="translate(565, 145) scale(3)" stroke="#E5C378" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1m3 2a3 3 0 1 1-3 3m3-3h-1m-2 3a3 3 0 1 1-3-3m3 3v-1m-3-2a3 3 0 1 1 3-3m-3 3h1m1-3a3 3 0 0 1 3 3m-3-3a3 3 0 0 0-3 3m3-3v1m3 2a3 3 0 0 1-3 3m3-3h-1m-2 3a3 3 0 0 1-3-3m3 3v-1m-3-2a3 3 0 0 1 3-3m-3 3h1" />
    <circle cx="12" cy="12" r="2" fill="#E5C378" />
  </g>

  <!-- Brand Titles -->
  <text x="600" y="300" text-anchor="middle" font-family="serif" font-size="64" font-weight="bold" fill="#FDFBF7" letter-spacing="2">Febiola Lovely Spa</text>
  <text x="600" y="360" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="600" fill="#E5C378" letter-spacing="6">PREMIER LUXURY SANCTUARY &amp; WELLNESS</text>
  
  <line x1="450" y1="395" x2="750" y2="395" stroke="#E5C378" stroke-width="1.5" stroke-opacity="0.6"/>
  
  <text x="600" y="445" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="400" fill="#E0D6CD">In-Home Therapeutic Bodywork &amp; Organic Botanical Rituals</text>
  
  <!-- Badge -->
  <rect x="420" y="490" width="360" height="44" rx="22" fill="#E5C378"/>
  <text x="600" y="520" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#1A110B" letter-spacing="2">SERVING ALL 50 US STATES NATIONWIDE</text>
</svg>
`;

await sharp(heroBgPath)
  .resize(1200, 630, { fit: 'cover' })
  .composite([
    {
      input: Buffer.from(ogSvgOverlay),
      top: 0,
      left: 0,
    },
  ])
  .jpeg({ quality: 90 })
  .toFile(path.join(publicDir, 'og-image.jpg'));

// Also write a PNG version
await sharp(path.join(publicDir, 'og-image.jpg'))
  .png()
  .toFile(path.join(publicDir, 'og-image.png'));

console.log('✓ Open Graph preview image (og-image.jpg & og-image.png) created successfully!');
