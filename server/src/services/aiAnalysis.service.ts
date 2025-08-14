import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface AnalysisResult {
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  category: string;
  keywords: string[];
  summary?: string;
}

// Predefined categories based on common note types (Turkish + English)
const CATEGORIES = {
  personal: [
    'personal', 'diary', 'journal', 'feeling', 'emotion', 'family', 'friend',
    'kişisel', 'günlük', 'his', 'duygu', 'aile', 'arkadaş', 'sevgili', 'ilişki',
    'güzel', 'gün', 'mutlu', 'sevinçli', 'keyifli'
  ],
  work: [
    'work', 'job', 'project', 'meeting', 'deadline', 'task', 'business', 'office',
    'iş', 'işe', 'proje', 'toplantı', 'görev', 'ofis', 'çalışma', 'maaş', 'patron'
  ],
  education: [
    'ders', 'okul', 'üniversite', 'sınav', 'ödev', 'araştırma', 'kitap', 'eğitim',
    'study', 'learn', 'school', 'university', 'exam', 'homework', 'research', 'book'
  ],
  health: [
    'sağlık', 'doktor', 'ilaç', 'egzersiz', 'diyet', 'spor', 'hastane',
    'health', 'doctor', 'medicine', 'exercise', 'diet', 'wellness', 'fitness'
  ],
  finance: [
    'para', 'bütçe', 'harcama', 'yatırım', 'banka', 'maliyet', 'fiyat', 'ücret',
    'money', 'budget', 'expense', 'investment', 'bank', 'financial', 'cost', 'price'
  ],
  travel: [
    'seyahat', 'tatil', 'uçak', 'otel', 'gezi', 'yolculuk', 'ülke', 'şehir',
    'travel', 'trip', 'vacation', 'flight', 'hotel', 'destination', 'journey'
  ],
  food: [
    'yemek', 'tarif', 'restoran', 'mutfak', 'kahvaltı', 'öğle', 'akşam', 'lezzetli',
    'food', 'recipe', 'restaurant', 'cooking', 'meal', 'dinner', 'lunch', 'breakfast'
  ],
  technology: [
    'teknoloji', 'yazılım', 'uygulama', 'bilgisayar', 'program', 'kod', 'dijital',
    'technology', 'software', 'app', 'computer', 'programming', 'code', 'digital'
  ],
  shopping: [
    'alışveriş', 'satın', 'mağaza', 'ürün', 'sipariş', 'teslimat', 'market',
    'shopping', 'buy', 'purchase', 'store', 'product', 'order', 'delivery'
  ],
  entertainment: [
    'film', 'müzik', 'oyun', 'eğlence', 'hobi', 'spor', 'sinema', 'konser',
    'movie', 'music', 'game', 'entertainment', 'fun', 'hobby', 'sport'
  ]
};

function analyzeSentiment(text: string) {
  const result = sentiment.analyze(text);
  
  // Add Turkish positive and negative words to enhance analysis
  const turkishPositiveWords = [
    'güzel', 'harika', 'mükemmel', 'muhteşem', 'süper', 'iyi', 'başarılı', 'mutlu', 
    'sevinçli', 'keyifli', 'hoş', 'tatlı', 'sevimli', 'eğlenceli', 'pozitif',
    'amazing', 'great', 'good', 'excellent', 'wonderful', 'fantastic',
    'happy', 'joy', 'love', 'perfect', 'awesome', 'brilliant', 'beautiful', 'nice'
  ];
  
  const turkishNegativeWords = [
    'kötü', 'berbat', 'korkunç', 'üzücü', 'kızgın', 'sinirli', 'mutsuz', 'zor',
    'problem', 'sorun', 'hata', 'yanlış', 'başarısız', 'negatif', 'kırık',
    'terrible', 'awful', 'bad', 'horrible', 'sad', 'angry', 'frustrated', 'disappointed'
  ];
  
  // Enhanced sentiment calculation
  let enhancedScore = result.score;
  const words = text.toLowerCase().split(/\s+/);
  
  // Check for Turkish words
  words.forEach(word => {
    if (turkishPositiveWords.some(pos => word.includes(pos) || pos.includes(word))) {
      enhancedScore += 2;
    }
    if (turkishNegativeWords.some(neg => word.includes(neg) || neg.includes(word))) {
      enhancedScore -= 2;
    }
  });
  
  // Normalize score to -1 to 1 range
  const normalizedScore = Math.max(-1, Math.min(1, enhancedScore / 5));
  
  let label: 'positive' | 'negative' | 'neutral';
  let confidence: number;
  
  // Lowered thresholds for better sensitivity
  if (enhancedScore > 0.5) {
    label = 'positive';
    confidence = Math.min(0.95, 0.6 + Math.abs(normalizedScore) * 0.35);
  } else if (enhancedScore < -0.5) {
    label = 'negative';
    confidence = Math.min(0.95, 0.6 + Math.abs(normalizedScore) * 0.35);
  } else {
    label = 'neutral';
    confidence = Math.max(0.4, 0.8 - Math.abs(normalizedScore) * 0.4);
  }
  
  return {
    score: normalizedScore,
    label,
    confidence: Math.round(confidence * 100) / 100
  };
}

function categorizeContent(text: string): string {
  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);
  
  const categoryScores: { [key: string]: number } = {};
  
  // Initialize scores
  Object.keys(CATEGORIES).forEach(category => {
    categoryScores[category] = 0;
  });
  
  // Score each category based on keyword matches
  Object.entries(CATEGORIES).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      const keywordCount = words.filter(word => 
        word.includes(keyword) || keyword.includes(word)
      ).length;
      categoryScores[category] += keywordCount;
    });
  });
  
  // Find the category with the highest score
  const bestCategory = Object.entries(categoryScores)
    .reduce((best, [category, score]) => 
      score > best.score ? { category, score } : best, 
      { category: 'general', score: 0 }
    );
  
  return bestCategory.score > 0 ? bestCategory.category : 'general';
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - remove common words and extract meaningful terms
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
    'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    // Turkish common words
    'bir', 'bu', 'şu', 've', 'ile', 'için', 'var', 'yok', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  // Count word frequency and return top keywords
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

function generateSummary(text: string): string | undefined {
  if (text.length < 100) return undefined;
  
  // Simple summary - take first sentence or truncate to reasonable length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 150) {
      return firstSentence.substring(0, 147) + '...';
    }
    return firstSentence;
  }
  
  return text.length > 150 ? text.substring(0, 147) + '...' : undefined;
}

export function analyzeContent(title: string, content: string): AnalysisResult {
  const fullText = `${title} ${content}`;
  
  const sentimentResult = analyzeSentiment(fullText);
  const category = categorizeContent(fullText);
  const keywords = extractKeywords(fullText);
  const summary = generateSummary(content);
  
  return {
    sentiment: sentimentResult,
    category,
    keywords,
    summary
  };
}
