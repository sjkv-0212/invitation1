const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

const inputDir = __dirname;
const outputDir = path.join(__dirname, 'assets', 'photos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertAll() {
  const files = fs.readdirSync(inputDir).filter(f => f.toUpperCase().endsWith('.HEIC'));
  console.log(`Found ${files.length} HEIC files to convert...`);

  const galleryData = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const baseName = path.parse(file).name;
    const outputPath = path.join(outputDir, `${baseName}.jpg`);
    const relativeWebPath = `assets/photos/${baseName}.jpg`;

    if (fs.existsSync(outputPath)) {
      console.log(`[${i + 1}/${files.length}] Already exists: ${baseName}.jpg`);
      galleryData.push({
        id: i + 1,
        filename: `${baseName}.jpg`,
        src: relativeWebPath,
        caption: `Cherished Memory #${i + 1}`
      });
      continue;
    }

    try {
      console.log(`[${i + 1}/${files.length}] Converting ${file}...`);
      const inputBuffer = fs.readFileSync(path.join(inputDir, file));
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.82
      });

      fs.writeFileSync(outputPath, outputBuffer);
      galleryData.push({
        id: i + 1,
        filename: `${baseName}.jpg`,
        src: relativeWebPath,
        caption: `Cherished Memory #${i + 1}`
      });
    } catch (err) {
      console.error(`Error converting ${file}:`, err.message);
    }
  }

  // Save gallery manifest
  fs.writeFileSync(
    path.join(__dirname, 'assets', 'gallery-data.json'),
    JSON.stringify(galleryData, null, 2)
  );
  console.log(`Done! Saved ${galleryData.length} images to assets/photos and created gallery-data.json`);
}

convertAll();
