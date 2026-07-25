const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'D Arrow Projects');
const destDir = path.join(__dirname, '..', 'public', 'projects-showcase');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function copyClean(srcPath, destSubfolder, newName) {
  const targetFolder = path.join(destDir, destSubfolder);
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }
  const destPath = path.join(targetFolder, newName);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied: ${srcPath} -> ${destPath}`);
}

// 1. Althob & Alshemagh
const althobSrc = path.join(srcDir, 'Althob & Alshemagh');
if (fs.existsSync(althobSrc)) {
  copyClean(path.join(althobSrc, 'Elthob 1.png'), 'althob-alshemagh', 'cover.png');
  copyClean(path.join(althobSrc, 'D Arrow First Page(Elthob).png'), 'althob-alshemagh', '1.png');
  copyClean(path.join(althobSrc, 'Elthob 1.png'), 'althob-alshemagh', '2.png');
  copyClean(path.join(althobSrc, 'Elthob 2.png'), 'althob-alshemagh', '3.png');
  copyClean(path.join(althobSrc, 'Elthob 3.png'), 'althob-alshemagh', '4.png');
  copyClean(path.join(althobSrc, 'Elthob 4.png'), 'althob-alshemagh', '5.png');
  copyClean(path.join(althobSrc, 'Elthob 5.png'), 'althob-alshemagh', '6.png');
}

// 2. Cafe
const cafeSrc = path.join(srcDir, 'Cafe');
if (fs.existsSync(cafeSrc)) {
  copyClean(path.join(cafeSrc, 'Cafe D1.png'), 'cafe', 'cover.png');
  copyClean(path.join(cafeSrc, 'D Arrow First Page.png'), 'cafe', '1.png');
  copyClean(path.join(cafeSrc, 'Cafe D1.png'), 'cafe', '2.png');
  copyClean(path.join(cafeSrc, 'Cafe D2.png'), 'cafe', '3.png');
  copyClean(path.join(cafeSrc, 'Cafe D3.png'), 'cafe', '4.png');
  copyClean(path.join(cafeSrc, 'Cafe D4.png'), 'cafe', '5.png');
  copyClean(path.join(cafeSrc, 'Cafe D4 (1).png'), 'cafe', '6.png');
  copyClean(path.join(cafeSrc, 'Cafe D5.png'), 'cafe', '7.png');
  copyClean(path.join(cafeSrc, 'Cafe D6.png'), 'cafe', '8.png');
}

// 3. Car Workshop
const carSrc = path.join(srcDir, 'Car workshop');
if (fs.existsSync(carSrc)) {
  copyClean(path.join(carSrc, 'Car New1.png'), 'car-workshop', 'cover.png');
  copyClean(path.join(carSrc, 'D Arrow First Page(Car) (1).png'), 'car-workshop', '1.png');
  copyClean(path.join(carSrc, 'Car New1.png'), 'car-workshop', '2.png');
  copyClean(path.join(carSrc, 'Car New2.png'), 'car-workshop', '3.png');
  copyClean(path.join(carSrc, 'Car New3.png'), 'car-workshop', '4.png');
  copyClean(path.join(carSrc, 'Car New4.png'), 'car-workshop', '5.png');
  copyClean(path.join(carSrc, 'Car New5 (1).png'), 'car-workshop', '6.png');
}

// 4. Restaurant
const restSrc = path.join(srcDir, 'Resturant');
if (fs.existsSync(restSrc)) {
  copyClean(path.join(restSrc, '1.png'), 'restaurant', 'cover.png');
  copyClean(path.join(restSrc, 'D Arrow First Page(Resturant) (1).png'), 'restaurant', '1.png');
  copyClean(path.join(restSrc, '1.png'), 'restaurant', '2.png');
  copyClean(path.join(restSrc, '2.png'), 'restaurant', '3.png');
  copyClean(path.join(restSrc, '3.png'), 'restaurant', '4.png');
  copyClean(path.join(restSrc, '4.png'), 'restaurant', '5.png');
  copyClean(path.join(restSrc, '5.png'), 'restaurant', '6.png');
}

// 5. Shoes
const shoesSrc = path.join(srcDir, 'Shoes');
if (fs.existsSync(shoesSrc)) {
  copyClean(path.join(shoesSrc, 'Artboard 1.png'), 'shoes', 'cover.png');
  copyClean(path.join(shoesSrc, 'Artboard 1.png'), 'shoes', '1.png');
  copyClean(path.join(shoesSrc, 'Artboard 1 copy.png'), 'shoes', '2.png');
  copyClean(path.join(shoesSrc, 'Artboard 1 copy 2.png'), 'shoes', '3.png');
  copyClean(path.join(shoesSrc, 'Artboard 1 copy 3.png'), 'shoes', '4.png');
}

console.log('Finished copying images to clean paths!');
