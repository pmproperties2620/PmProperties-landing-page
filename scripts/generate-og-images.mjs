import sharp from 'sharp';
import fs from 'fs';

async function generateOGImages() {
  console.log('Generating Open Graph images for WhatsApp and social sharing...');

  // 1. Trim the master logo
  const trimmedLogo = await sharp('public/images/logo.png')
    .trim()
    .png()
    .toBuffer();
  
  const logoMeta = await sharp(trimmedLogo).metadata();
  console.log('Trimmed logo size:', logoMeta.width, logoMeta.height);

  // -------------------------------------------------------------
  // Image 1: Square OG Image (600x600 px) - WhatsApp thumbnail gold standard
  // -------------------------------------------------------------
  // Clean white card with subtle luxury border and shadow, logo centered
  const logoResizedSquare = await sharp(trimmedLogo)
    .resize(460, 460, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const squareMeta = await sharp(logoResizedSquare).metadata();

  const squareSvg = `
    <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="600" fill="#ffffff" />
      <rect x="16" y="16" width="568" height="568" rx="28" fill="#ffffff" stroke="#f1f1f4" stroke-width="4" />
      <!-- Subtle top brand accent line -->
      <path d="M 200 24 L 400 24" stroke="#491612" stroke-width="3" stroke-linecap="round" />
    </svg>
  `;
  const squareBg = await sharp(Buffer.from(squareSvg)).png().toBuffer();

  const ogSquareJpg = await sharp(squareBg)
    .composite([
      {
        input: logoResizedSquare,
        left: Math.round((600 - squareMeta.width) / 2),
        top: Math.round((600 - squareMeta.height) / 2),
      }
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  fs.writeFileSync('public/og-image-square.jpg', ogSquareJpg);
  console.log('Saved public/og-image-square.jpg, size:', ogSquareJpg.length, 'bytes');

  // -------------------------------------------------------------
  // Image 2: Universal 1200x630 OG Banner (Facebook, LinkedIn, Twitter, WhatsApp Web)
  // -------------------------------------------------------------
  // High-end executive banner with PM Properties branding and property aesthetics
  const bannerSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a0d0a" />
          <stop offset="45%" stop-color="#491612" />
          <stop offset="100%" stop-color="#180705" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#fafafa" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.4" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGrad)" />

      <!-- Subtle architectural geometric lines -->
      <path d="M 0 550 L 1200 350" stroke="#ffffff" stroke-opacity="0.04" stroke-width="2" />
      <path d="M 0 450 L 1200 250" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1.5" />
      <circle cx="1080" cy="120" r="300" fill="#ffffff" fill-opacity="0.02" />

      <!-- Left / Center Card for Logo -->
      <rect x="70" y="75" width="480" height="480" rx="32" fill="url(#cardGrad)" filter="url(#shadow)" stroke="#ffffff" stroke-width="1.5" />

      <!-- Right Content Side -->
      <!-- Category Badge -->
      <g transform="translate(600, 110)">
        <rect width="210" height="36" rx="18" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.2" />
        <text x="105" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">
          RERA VERIFIED CONSULTANCY
        </text>
      </g>

      <!-- Main Headline -->
      <text x="600" y="205" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
        The PM Properties
      </text>

      <!-- Subtitle -->
      <text x="600" y="250" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500" fill="#e2e8f0">
        Premium Real Estate Advisory &amp; Services
      </text>

      <!-- Bullet points / Features -->
      <g transform="translate(600, 310)">
        <circle cx="8" cy="8" r="5" fill="#eab308" />
        <text x="26" y="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600" fill="#ffffff">
          0% Brokerage on New Projects
        </text>

        <circle cx="8" cy="48" r="5" fill="#eab308" />
        <text x="26" y="53" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600" fill="#ffffff">
          Luxury Residences in Dombivli &amp; Kalyan
        </text>

        <circle cx="8" cy="88" r="5" fill="#eab308" />
        <text x="26" y="93" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600" fill="#ffffff">
          End-to-End Home Loan &amp; Legal Support
        </text>
      </g>

      <!-- Divider line -->
      <line x1="600" y1="460" x2="1120" y2="460" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1" />

      <!-- Footer details -->
      <text x="600" y="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">
        MahaRERA Reg No: <tspan fill="#f1f5f9" font-weight="700">A51700019203</tspan>
      </text>
      <text x="600" y="530" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#facc15">
        www.thepmproperties.in
      </text>
    </svg>
  `;

  const bannerBg = await sharp(Buffer.from(bannerSvg)).png().toBuffer();

  // Logo to put inside the white card (card is 480x480 at left:70, top:75)
  const logoForCard = await sharp(trimmedLogo)
    .resize(380, 380, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const cMeta = await sharp(logoForCard).metadata();

  const ogBannerJpg = await sharp(bannerBg)
    .composite([
      {
        input: logoForCard,
        left: 70 + Math.round((480 - cMeta.width) / 2),
        top: 75 + Math.round((480 - cMeta.height) / 2),
      }
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync('public/og-image.jpg', ogBannerJpg);
  fs.writeFileSync('src/app/opengraph-image.jpg', ogBannerJpg);
  console.log('Saved public/og-image.jpg, size:', ogBannerJpg.length, 'bytes');
  console.log('Saved src/app/opengraph-image.jpg, size:', ogBannerJpg.length, 'bytes');

  console.log('Open Graph images created successfully!');
}

generateOGImages().catch(console.error);
