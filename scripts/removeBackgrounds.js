const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '../public/icon');

async function removeBackground(imagePath) {
  try {
    const filename = path.basename(imagePath);
    console.log(`Processing ${filename}...`);
    
    // Read the image, convert to RGBA, extract pixels, and process
    const buffer = await sharp(imagePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = buffer;
    
    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // If pixel is white or near white, make it transparent
      // Checking if R, G, B are all high (> 240) and alpha is high
      if (r > 240 && g > 240 && b > 240 && a > 200) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    // Write the modified image back
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      }
    })
    .png()
    .toFile(imagePath);
    
    console.log(`✓ ${filename} processed successfully`);
  } catch (error) {
    console.error(`✗ Error processing ${imagePath}:`, error.message);
  }
}

async function processAllIcons() {
  try {
    const files = fs.readdirSync(iconDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));
    
    console.log(`Found ${pngFiles.length} PNG files to process\n`);
    
    for (const file of pngFiles) {
      const filePath = path.join(iconDir, file);
      await removeBackground(filePath);
    }
    
    console.log('\n✓ All icons processed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

processAllIcons();
