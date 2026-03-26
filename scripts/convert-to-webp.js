#!/usr/bin/env node

/**
 * Image to WebP Converter
 * Converts PNG and JPG images to WebP format for better compression
 * Usage: node scripts/convert-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promises: fsPromises } = require('fs');

const ICON_DIR = path.join(__dirname, '../public/icon');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized/images');
const SERVICE_IMAGES_DIR = path.join(__dirname, '../public/services');

async function ensureDir(dir) {
  try {
    await fsPromises.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function convertImage(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    let transformer = sharp(inputPath);
    
    // Add optimization based on file type
    if (ext === '.png') {
      transformer = transformer.png({ quality: 80 });
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      transformer = transformer.jpeg({ quality: 80 });
    }
    
    await transformer
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return false;
  }
}

async function getFileSizeInKB(filePath) {
  try {
    const stats = await fsPromises.stat(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 'N/A';
  }
}

async function convertDirectory(sourceDir, outputDir, pattern = /\.(png|jpg|jpeg)$/i) {
  try {
    const files = await fsPromises.readdir(sourceDir);
    const imageFiles = files.filter(file => pattern.test(file));
    
    if (imageFiles.length === 0) {
      console.log(`ℹ️  No image files found in ${sourceDir}`);
      return { converted: 0, failed: 0, totalSaved: 0 };
    }
    
    let converted = 0;
    let failed = 0;
    let totalSaved = 0;
    
    for (const file of imageFiles) {
      const inputPath = path.join(sourceDir, file);
      const outputFile = `${path.basename(file, path.extname(file))}.webp`;
      const outputPath = path.join(outputDir, outputFile);
      
      process.stdout.write(`Converting ${file}... `);
      
      const success = await convertImage(inputPath, outputPath);
      
      if (success) {
        const originalSize = await getFileSizeInKB(inputPath);
        const newSize = await getFileSizeInKB(outputPath);
        const saved = (originalSize - newSize).toFixed(2);
        
        console.log(`✅ Saved ${saved}KB (${originalSize}KB → ${newSize}KB)`);
        converted++;
        totalSaved += parseFloat(saved);
      } else {
        failed++;
      }
    }
    
    return { converted, failed, totalSaved };
  } catch (error) {
    console.error(`Error processing directory ${sourceDir}:`, error.message);
    return { converted: 0, failed: 0, totalSaved: 0 };
  }
}

async function main() {
  console.log('🖼️  Image to WebP Converter');
  console.log('==========================\n');
  
  try {
    // Ensure output directory exists
    await ensureDir(OUTPUT_DIR);
    
    console.log('📁 Converting Images...\n');
    
    // Convert icons
    console.log('📍 Processing /public/icon directory:');
    const iconResults = await convertDirectory(
      ICON_DIR,
      OUTPUT_DIR,
      /\.(png|jpg|jpeg)$/i
    );
    
    console.log(`\n   Converted: ${iconResults.converted} files`);
    console.log(`   Failed: ${iconResults.failed} files`);
    console.log(`   Total space saved: ${iconResults.totalSaved.toFixed(2)}KB\n`);
    
    // Convert service images if directory exists
    if (fs.existsSync(SERVICE_IMAGES_DIR)) {
      console.log('📍 Processing /public/services directory:');
      const serviceResults = await convertDirectory(
        SERVICE_IMAGES_DIR,
        OUTPUT_DIR,
        /\.(png|jpg|jpeg)$/i
      );
      
      console.log(`\n   Converted: ${serviceResults.converted} files`);
      console.log(`   Failed: ${serviceResults.failed} files`);
      console.log(`   Total space saved: ${serviceResults.totalSaved.toFixed(2)}KB\n`);
      
      // Combined totals
      const totalConverted = iconResults.converted + serviceResults.converted;
      const totalFailed = iconResults.failed + serviceResults.failed;
      const totalSaved = iconResults.totalSaved + serviceResults.totalSaved;
      
      console.log('📊 Combined Results:');
      console.log(`   Total files converted: ${totalConverted}`);
      console.log(`   Total files failed: ${totalFailed}`);
      console.log(`   Total space saved: ${totalSaved.toFixed(2)}KB\n`);
    } else {
      console.log('ℹ️  /public/services directory not found\n');
    }
    
    console.log('✅ Conversion complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify converted files in public/optimized/images/');
    console.log('2. Update image src paths in components to use .webp files');
    console.log('3. Test website to ensure images display correctly');
    console.log('4. Commit changes and deploy\n');
    
    console.log('💡 Performance Boost:');
    console.log('   • WebP images are typically 25-35% smaller than PNG/JPG');
    console.log('   • Supported in all modern browsers');
    console.log('   • Consider using <picture> tag for fallback to PNG/JPG for older browsers\n');
    
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
