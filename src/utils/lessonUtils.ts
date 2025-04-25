
import { LessonPage, ContentChunk } from '@/types';

/**
 * Splits a text into paragraphs, then chunks each paragraph.
 * Each paragraph becomes a page, and each page has multiple chunks.
 */
export function generateLessonChunks(text: string): LessonPage[] {
  // Split text into paragraphs (pages)
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0);
  
  return paragraphs.map((paragraph, pageIndex) => {
    // Create chunks from the paragraph
    const chunks = chunkParagraph(paragraph);
    
    return {
      id: `page-${pageIndex + 1}`,
      pageNumber: pageIndex + 1,
      chunks
    };
  });
}

/**
 * Splits a paragraph into multiple chunks of roughly 16-20 words each
 */
function chunkParagraph(paragraph: string): ContentChunk[] {
  // Split paragraph into sentences
  const sentences = paragraph
    .replace(/([.?!])\s+/g, '$1|')
    .split('|')
    .filter(s => s.trim().length > 0);
  
  const chunks: ContentChunk[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  
  // Aim for ~16-20 words per chunk
  const targetWordCount = 16;
  
  for (const sentence of sentences) {
    const words = sentence.split(' ');
    
    if (currentWordCount + words.length <= targetWordCount || currentChunk.length === 0) {
      // Add sentence to current chunk
      currentChunk.push(sentence);
      currentWordCount += words.length;
    } else {
      // Create a new chunk with the current sentence
      chunks.push(createChunk(currentChunk.join(' ')));
      currentChunk = [sentence];
      currentWordCount = words.length;
    }
  }
  
  // Add the last chunk if there's anything left
  if (currentChunk.length > 0) {
    chunks.push(createChunk(currentChunk.join(' ')));
  }
  
  return chunks;
}

/**
 * Creates a content chunk with the given text
 * Also generates a recall version with blanks
 */
function createChunk(text: string): ContentChunk {
  // Generate recall text with blanks
  const words = text.split(' ');
  const recallText = generateRecallWithBlanks(words);
  
  return {
    id: `chunk-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    text,
    recallText
  };
}

/**
 * Generates a recall version of the text with blanks for important words
 */
function generateRecallWithBlanks(words: string[]): string {
  // Skip short words and words with punctuation only
  const candidates = words.map((word, idx) => {
    return {
      index: idx,
      word,
      length: word.replace(/[.,;:!?()]/g, '').length,
      isAlphanumeric: /[a-zA-Z0-9]/.test(word)
    };
  }).filter(w => w.length > 3 && w.isAlphanumeric);
  
  // If we don't have enough words, just return original text
  if (candidates.length < 2) {
    return words.join(' ');
  }
  
  // Create blanks for 15-25% of words, at least 1, at most 5
  const blankCount = Math.max(1, Math.min(5, Math.floor(candidates.length * 0.2)));
  
  // Select random words to blank out
  const selectedForBlanks = new Set<number>();
  
  // Ensure we don't select too many blank words
  while (selectedForBlanks.size < blankCount && selectedForBlanks.size < candidates.length) {
    const randomIndex = Math.floor(Math.random() * candidates.length);
    selectedForBlanks.add(candidates[randomIndex].index);
  }
  
  // Create the recall text with blanks
  return words.map((word, idx) => 
    selectedForBlanks.has(idx) ? '____' : word
  ).join(' ');
}
