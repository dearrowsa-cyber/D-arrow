const fs = require('fs');
const content = fs.readFileSync('./node_modules/react-icons/tb/index.js', 'utf8');
const tiktokMatch = content.match(/TbBrandTiktok[^\]]+\]/);
const waMatch = content.match(/TbBrandWhatsapp[^\]]+\]/);
console.log('Tiktok:', tiktokMatch ? tiktokMatch[0].substring(0,200) : 'not found');
console.log('Whatsapp:', waMatch ? waMatch[0].substring(0,200) : 'not found');
