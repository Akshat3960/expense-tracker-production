const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
  async optimizeForOCR(inputPath) {
    try {
      const outputPath = inputPath.replace('.', '_optimized.');
      
      await sharp(inputPath)
        .grayscale() // Convert to grayscale
        .normalize() // Normalize contrast
        .sharpen() // Sharpen image
        .resize(2000, 2000, { // Resize for better OCR
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error('Image optimization error:', error);
      throw error;
    }
  }

  async cleanup(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new ImageProcessor();