import fs from 'fs';
import sharp from 'sharp';

// Multi-resolution ICO generator function (PNG-compressed entries)
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ico type (1 = icon)
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0); // width
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(currentOffset, 12); // offset of image data
    entries.push(entry);
    currentOffset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buffer)]);
}

async function main() {
  console.log('--- Generating PM Properties Favicon & App Icons ---');

  // Step 1: Isolate emblem from high-res logo
  console.log('1. Isolating emblem from public/images/logo.png...');
  // Extract top half containing only the emblem (crop out tagline and brand text)
  const emblemCrop = await sharp('public/images/logo.png')
    .extract({ left: 0, top: 0, width: 6250, height: 4700 })
    .toBuffer();

  // Trim transparent edges
  const trimmed = await sharp(emblemCrop).trim().png().toBuffer();
  
  // Cleanly erase the small TM mark (x: 1560 to 1920, y: 800 to 1010 in trimmed coordinates)
  const { data: rawData, info: rawInfo } = await sharp(trimmed).raw().toBuffer({ resolveWithObject: true });
  for (let y = 800; y <= 1010; y++) {
    for (let x = 1560; x <= 1920; x++) {
      const idx = (y * rawInfo.width + x) * 4;
      rawData[idx + 3] = 0; // transparent
    }
  }

  const pureEmblem = await sharp(rawData, { raw: rawInfo }).trim().png().toBuffer();
  const pureMeta = await sharp(pureEmblem).metadata();
  console.log(`   Emblem isolated: ${pureMeta.width}x${pureMeta.height} px (TM mark removed, aspect-ratio preserved)`);

  // Step 2: Create master 512x512 square canvas with Google-compliant balanced padding
  console.log('2. Creating master 512x512 emblem canvas...');
  // Scale emblem to fit 470x470 within 512x512 (approx 8% breathing room padding per Google Search icon guidelines)
  const contained470 = await sharp(pureEmblem)
    .resize(470, 470, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .toBuffer();

  const cMeta = await sharp(contained470).metadata();
  const padTop = Math.floor((512 - cMeta.height) / 2);
  const padBottom = 512 - cMeta.height - padTop;
  const padLeft = Math.floor((512 - cMeta.width) / 2);
  const padRight = 512 - cMeta.width - padLeft;

  const master512 = await sharp(contained470)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Step 3: Generate resolution variants
  console.log('3. Generating resized icon buffers...');
  const [b16, b32, b48, b72, b180, b192] = await Promise.all([
    // Sharpen 16x16 and 32x32 slightly to ensure razor-sharp edges in micro viewports
    sharp(master512).resize(16, 16, { kernel: 'lanczos3' }).sharpen({ sigma: 0.5, m1: 1.2, m2: 0.5 }).png().toBuffer(),
    sharp(master512).resize(32, 32, { kernel: 'lanczos3' }).sharpen({ sigma: 0.5, m1: 1.2, m2: 0.5 }).png().toBuffer(),
    sharp(master512).resize(48, 48, { kernel: 'lanczos3' }).png().toBuffer(),
    sharp(master512).resize(72, 72, { kernel: 'lanczos3' }).png().toBuffer(),
    sharp(master512).resize(180, 180, { kernel: 'lanczos3' }).png().toBuffer(),
    sharp(master512).resize(192, 192, { kernel: 'lanczos3' }).png().toBuffer(),
  ]);

  // Step 4: Build multi-resolution ICO file (16x16, 32x32, 48x48)
  console.log('4. Generating multi-resolution ICO (16x16, 32x32, 48x48)...');
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ]);

  // Step 5: Build Maskable PWA icon (emblem centered in 80% safe circle on #070b14 admin theme)
  console.log('5. Generating maskable icon for PWA...');
  const maskableSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#070b14" />
      <circle cx="256" cy="256" r="190" fill="#ffffff" />
    </svg>
  `;
  const maskableBase = await sharp(Buffer.from(maskableSvg)).png().toBuffer();
  const emblemForMask = await sharp(pureEmblem).resize(260, 260, { fit: 'contain' }).toBuffer();
  const maskableMeta = await sharp(emblemForMask).metadata();
  const maskable512 = await sharp(maskableBase)
    .composite([
      {
        input: emblemForMask,
        left: Math.round((512 - maskableMeta.width) / 2),
        top: Math.round((512 - maskableMeta.height) / 2),
      },
    ])
    .png()
    .toBuffer();

  // Step 6: Write files to designated locations
  console.log('6. Writing files...');
  // Next.js App Router icons
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/icon.png', master512);
  fs.writeFileSync('src/app/apple-icon.png', b180);

  // Static fallback files in public/
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('public/icon.png', master512);
  fs.writeFileSync('public/apple-icon.png', b180);

  // PWA icon consistency in public/icons/
  fs.writeFileSync('public/icons/icon-192x192.png', b192);
  fs.writeFileSync('public/icons/icon-512x512.png', master512);
  fs.writeFileSync('public/icons/icon-maskable-512x512.png', maskable512);
  fs.writeFileSync('public/icons/badge-72x72.png', b72);

  console.log('--- Favicon & App Icon Generation Complete ---');
  console.log('Files generated:');
  console.log('  [App Router]  src/app/favicon.ico   (16, 32, 48 multi-size ICO)');
  console.log('  [App Router]  src/app/icon.png      (512x512 PNG)');
  console.log('  [App Router]  src/app/apple-icon.png(180x180 PNG)');
  console.log('  [Static]      public/favicon.ico    (16, 32, 48 multi-size ICO)');
  console.log('  [Static]      public/icon.png       (512x512 PNG)');
  console.log('  [Static]      public/apple-icon.png (180x180 PNG)');
  console.log('  [PWA]         public/icons/icon-192x192.png');
  console.log('  [PWA]         public/icons/icon-512x512.png');
  console.log('  [PWA]         public/icons/icon-maskable-512x512.png');
  console.log('  [PWA]         public/icons/badge-72x72.png');
}

main().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
