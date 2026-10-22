// Build script thuần Node.js (KHÔNG dùng npm package, KHÔNG cần package.json)
// Tự động ghép các file HTML thành phần trong thư mục sections/ thành index.html hoàn chỉnh.

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'sections');
const layoutPath = path.join(sectionsDir, '00-layout.html');
const outputPath = path.join(__dirname, 'index.html');

console.log('[HTML BUILDER] Bắt đầu ghép các section HTML...');

if (!fs.existsSync(layoutPath)) {
  console.error('[LỖI] Không tìm thấy file sections/00-layout.html');
  process.exit(1);
}

let resultHtml = fs.readFileSync(layoutPath, 'utf8');

const sectionFiles = [
  '01-topbar',
  '02-header',
  '03-slider',
  '04-about',
  '05-panel',
  '06-services',
  '07-projects',
  '08-gallery',
  '09-news',
  '10-partners',
  '11-footer',
  '12-modals'
];

sectionFiles.forEach(sec => {
  const filePath = path.join(sectionsDir, `${sec}.html`);
  if (fs.existsSync(filePath)) {
    const secContent = fs.readFileSync(filePath, 'utf8');
    resultHtml = resultHtml.replace(`{{${sec}}}`, secContent);
    console.log(`+ Đã ghép: ${sec}.html`);
  } else {
    console.warn(`! Cảnh báo: Không tìm thấy ${sec}.html`);
  }
});

fs.writeFileSync(outputPath, resultHtml, 'utf8');
console.log(`[THÀNH CÔNG] Đã tạo index.html (${(Buffer.byteLength(resultHtml, 'utf8') / 1024).toFixed(2)} KB)`);
