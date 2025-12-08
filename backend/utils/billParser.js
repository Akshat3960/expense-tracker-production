const Tesseract = require('tesseract.js');

class BillParser {
  constructor() {
    console.log('BillParser initialized with Tesseract OCR');
  }

  /**
   * Extract text from image URL using Tesseract OCR
   */
  async extractText(imageUrl) {
    try {
      console.log('Starting OCR for image:', imageUrl);
      
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      console.log(`OCR completed. Confidence: ${result.data.confidence}%`);

      return {
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      console.error('Tesseract OCR error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Parse total amount from text
   */
  parseAmount(text) {
    const normalizedText = text.replace(/\s+/g, ' ').toLowerCase();

    // Priority patterns
    const patterns = [
      { regex: /total[:\s]*\$?\s*(\d+[.,]\d{2})/i, priority: 1 },
      { regex: /grand\s*total[:\s]*\$?\s*(\d+[.,]\d{2})/i, priority: 1 },
      { regex: /amount\s*due[:\s]*\$?\s*(\d+[.,]\d{2})/i, priority: 1 },
      { regex: /balance[:\s]*\$?\s*(\d+[.,]\d{2})/i, priority: 2 },
      { regex: /amount[:\s]*\$?\s*(\d+[.,]\d{2})/i, priority: 3 }
    ];

    for (const pattern of patterns) {
      const match = normalizedText.match(pattern.regex);
      if (match) {
        const amount = parseFloat(match[1].replace(',', '.'));
        if (amount > 0 && amount < 999999) {
          console.log(`Amount found: $${amount}`);
          return amount;
        }
      }
    }

    // Fallback: find largest amount
    const allAmounts = [];
    const dollarMatches = text.match(/\$\s*(\d+[.,]\d{2})/g);
    
    if (dollarMatches) {
      dollarMatches.forEach(match => {
        const amount = parseFloat(match.replace('$', '').replace(',', '.').trim());
        if (amount > 0 && amount < 999999) {
          allAmounts.push(amount);
        }
      });
    }

    if (allAmounts.length > 0) {
      const maxAmount = Math.max(...allAmounts);
      console.log(`Amount found (largest): $${maxAmount}`);
      return maxAmount;
    }

    console.warn('No amount found in text');
    return null;
  }

  /**
   * Parse date from text
   */
  parseDate(text) {
    const datePatterns = [
      {
        regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
        parse: (m) => new Date(m[3], m[1] - 1, m[2])
      },
      {
        regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
        parse: (m) => new Date(m[1], m[2] - 1, m[3])
      },
      {
        regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i,
        parse: (m) => new Date(`${m[1]} ${m[2]}, ${m[3]}`)
      }
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        try {
          const date = pattern.parse(match);
          if (!isNaN(date.getTime()) && date.getFullYear() > 2000 && date.getFullYear() <= new Date().getFullYear() + 1) {
            console.log(`Date found: ${date.toLocaleDateString()}`);
            return date;
          }
        } catch (error) {
          continue;
        }
      }
    }

    console.warn('No valid date found, using current date');
    return new Date();
  }

  /**
   * Parse merchant name from text
   */
  parseMerchant(text) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      
      if (line.length < 3 || line.length > 50) continue;
      if (/^\d+\s+[a-z]/i.test(line)) continue;
      if (/\(\d{3}\)|\d{3}[-.\s]\d{3}[-.\s]\d{4}/.test(line)) continue;
      if (/^\d+$/.test(line)) continue;
      if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(line)) continue;
      if (/^(receipt|invoice|bill|tax|total|subtotal|customer)$/i.test(line)) continue;
      
      console.log(`Merchant found: ${line}`);
      return line;
    }

    if (lines.length > 0) {
      console.log(`Merchant (fallback): ${lines[0]}`);
      return lines[0];
    }

    console.warn('No merchant found');
    return 'Unknown Merchant';
  }

  /**
   * Categorize item based on description
   */
  categorizeItem(description) {
    const categories = {
      'Food': ['food', 'meal', 'restaurant', 'cafe', 'grocery', 'market'],
      'Transport': ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking'],
      'Shopping': ['store', 'shop', 'retail', 'amazon', 'walmart'],
      'Health': ['pharmacy', 'medical', 'doctor', 'hospital', 'cvs'],
      'Entertainment': ['movie', 'cinema', 'game', 'concert', 'netflix'],
      'Bills': ['electric', 'water', 'internet', 'phone', 'utility']
    };

    const lowerDesc = description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          return category;
        }
      }
    }

    return 'Other';
  }

  /**
   * Parse line items from receipt
   */
  parseLineItems(text) {
    const lines = text.split('\n');
    const items = [];
    const seenAmounts = new Set();

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.length < 3) continue;
      if (/^\d+$/.test(trimmedLine)) continue;
      
      const patterns = [
        /^(.+?)\s+\$\s*(\d+\.\d{2})$/,
        /^(.+?)\s+(\d+\.\d{2})$/,
        /^(.+?)\s{2,}\$?\s*(\d+\.\d{2})\s*$/,
      ];

      for (const pattern of patterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          const description = match[1].trim();
          const amount = parseFloat(match[2]);
          
          if (description.length > 2 && 
              description.length < 100 && 
              amount > 0 && 
              amount < 10000 &&
              !seenAmounts.has(amount) &&
              !/^(total|subtotal|tax|tip|balance|amount|payment)/i.test(description)) {
            
            seenAmounts.add(amount);
            
            items.push({
              description: description,
              amount: amount,
              category: this.categorizeItem(description)
            });
            
            break;
          }
        }
      }
    }

    console.log(`Found ${items.length} line items`);
    return items;
  }

  /**
   * Main parsing function
   */
  async parseBill(imageUrl) {
    try {
      console.log(`Starting bill parsing for: ${imageUrl}`);
      const startTime = Date.now();

      // Extract text from image
      const { text, confidence } = await this.extractText(imageUrl);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text extracted from image');
      }

      console.log(`Text extracted (${text.length} characters, ${confidence}% confidence)`);
      
      // Parse components
      const totalAmount = this.parseAmount(text);
      const date = this.parseDate(text);
      const merchantName = this.parseMerchant(text);
      const items = this.parseLineItems(text);
      
      const result = {
        merchantName,
        totalAmount,
        date,
        items,
        rawText: text,
        confidence: confidence,
        processingTime: Date.now() - startTime,
        ocrEngine: 'Tesseract OCR'
      };

      console.log(`Bill parsing completed in ${result.processingTime}ms`);
      console.log(`Merchant: ${result.merchantName}`);
      console.log(`Amount: $${result.totalAmount?.toFixed(2) || 'N/A'}`);
      console.log(`Date: ${result.date.toLocaleDateString()}`);
      console.log(`Items: ${result.items.length}`);

      return result;
    } catch (error) {
      console.error('Bill parsing error:', error);
      throw error;
    }
  }
}

module.exports = new BillParser();