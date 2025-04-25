
import { Lesson, ContentChunk } from '../types';

// Function to split text into chunks
const chunkText = (text: string): ContentChunk[] => {
  // Split text into words
  const words = text.split(/\s+/);
  const chunks: ContentChunk[] = [];
  
  // Create chunks of approximately 16 words each
  for (let i = 0; i < words.length; i += 16) {
    const chunkWords = words.slice(i, i + 16);
    const chunkText = chunkWords.join(' ');
    
    chunks.push({
      id: `chunk-${i/16}`,
      text: chunkText,
      recallText: generateRecallText(chunkText),
    });
  }
  
  return chunks;
};

// Function to generate text with blanks for recall phase
const generateRecallText = (text: string): string => {
  const words = text.split(' ');
  // Select about 20% of significant words to blank out
  const totalBlanks = Math.max(1, Math.floor(words.length * 0.2));
  const blankIndices = new Set<number>();
  
  // Skip very short words (likely articles, prepositions, etc.)
  const eligibleIndices = words.map((word, index) => 
    word.length > 3 ? index : null).filter(i => i !== null) as number[];
  
  // Select random indices to blank out
  while (blankIndices.size < totalBlanks && eligibleIndices.length > 0) {
    const randomIndex = Math.floor(Math.random() * eligibleIndices.length);
    blankIndices.add(eligibleIndices[randomIndex]);
    eligibleIndices.splice(randomIndex, 1);
  }
  
  // Replace selected words with blanks
  const recallWords = words.map((word, index) => 
    blankIndices.has(index) ? '____' : word
  );
  
  return recallWords.join(' ');
};

// Sample lesson content
const sampleText = `
Learning to type efficiently is an essential skill in today's digital world. Typing is not just about pressing keys; it's about communicating your thoughts quickly and accurately. With regular practice, you can improve your typing speed and reduce errors significantly.

The standard QWERTY keyboard layout was designed in the 1870s for mechanical typewriters. Despite being created to prevent jamming rather than for ergonomic efficiency, it remains the dominant layout worldwide. Alternative layouts like Dvorak claim to offer better ergonomics and speed, but few people make the switch due to the learning curve.

Touch typing is the technique of typing without looking at the keyboard. It relies on muscle memory, with each finger responsible for specific keys. The home row (ASDF for the left hand and JKL; for the right) serves as the anchor position. With consistent practice, touch typing becomes second nature, allowing you to focus on content rather than the typing process itself.

Speed is important, but accuracy matters more in professional settings. Errors can change the meaning of your text or create confusion. The goal should be to develop a balanced approach where you type quickly without sacrificing precision. Most professionals aim for 60-80 words per minute with minimal errors.

Regular practice with proper technique yields better results than sporadic, intensive sessions. Dedicated typing tutors and games can make the learning process more engaging. They provide immediate feedback and track your progress over time, helping you identify areas for improvement.

Ergonomics plays a crucial role in typing comfort and health. Proper posture, with feet flat on the floor and wrists straight, can prevent repetitive strain injuries. Your screen should be at eye level, and your elbows should form a 90-degree angle. Investing in a quality keyboard can also enhance your typing experience and reduce strain.
`;

// Create a sample lesson with multiple pages
export const sampleLesson: Lesson = {
  id: 'lesson-1',
  title: 'Introduction to Efficient Typing',
  content: sampleText,
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      chunks: chunkText(sampleText),
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Sample quiz questions for the lesson
export const sampleQuizQuestions = [
  {
    question: 'What is touch typing?',
    options: [
      'Typing with touchscreen devices',
      'Typing without looking at the keyboard',
      'Typing with only two fingers',
      'Typing while touching the screen'
    ],
    correctAnswer: 'Typing without looking at the keyboard'
  },
  {
    question: 'When was the QWERTY keyboard layout designed?',
    options: [
      '1970s',
      '1920s',
      '1870s',
      '1990s'
    ],
    correctAnswer: '1870s'
  },
  {
    question: 'What is more important in professional typing?',
    options: [
      'Speed',
      'Accuracy',
      'Keyboard type',
      'Number of fingers used'
    ],
    correctAnswer: 'Accuracy'
  },
  {
    question: 'What is the home row on a QWERTY keyboard?',
    options: [
      'QWERTY',
      'ZXCVB',
      'ASDF JKL;',
      '12345'
    ],
    correctAnswer: 'ASDF JKL;'
  },
  {
    question: 'What can proper typing ergonomics prevent?',
    options: [
      'Computer viruses',
      'Repetitive strain injuries',
      'Power outages',
      'Software crashes'
    ],
    correctAnswer: 'Repetitive strain injuries'
  }
];
