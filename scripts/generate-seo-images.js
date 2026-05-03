const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateImages() {
  const publicDir = path.join(__dirname, '../public');
  
  // 1. Generate square icon (favicon/apple icon) using the No-D logo (just the mark)
  try {
    if (fs.existsSync(path.join(publicDir, 'Darrow-No-D.png'))) {
      await sharp(path.join(publicDir, 'Darrow-No-D.png'))
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent
        })
        .toFile(path.join(publicDir, 'icon-square.png'));
      console.log('Created icon-square.png (512x512)');
    } else {
      console.log('Darrow-No-D.png not found, using DR-LOGO.png for icon');
      await sharp(path.join(publicDir, 'DR-LOGO.png'))
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(path.join(publicDir, 'icon-square.png'));
    }
  } catch (err) {
    console.error('Error generating icon:', err);
  }

  // 2. Generate OpenGraph Image (1200x630) using the full logo
  try {
    await sharp(path.join(publicDir, 'DR-LOGO.png'))
      .resize(800, 400, {
        fit: 'contain',
        background: { r: 20, g: 22, b: 46, alpha: 1 } // Match the dark background #14162e
      })
      .extend({
        top: 115,
        bottom: 115,
        left: 200,
        right: 200,
        background: { r: 20, g: 22, b: 46, alpha: 1 }
      })
      .toFile(path.join(publicDir, 'og-image.jpg'));
    console.log('Created og-image.jpg (1200x630)');
  } catch (err) {
    console.error('Error generating OG image:', err);
  }
}

generateImages();
