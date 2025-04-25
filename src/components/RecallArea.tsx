
import React, { useState, useEffect } from 'react';
import { ContentChunk } from '../types';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RecallAreaProps {
  chunk: ContentChunk;
  originalChunk: ContentChunk;
  onComplete: (success: boolean) => void;
}

export function RecallArea({ chunk, originalChunk, onComplete }: RecallAreaProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Process the original text to generate blanks if not provided
  useEffect(() => {
    if (!chunk.recallText) {
      // Wait 3 seconds before showing recall (simulating processing time)
      setTimeLeft(3);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [chunk]);
  
  // Split the recall text into parts (words and blanks)
  const recallText = chunk.recallText || createRecallText(originalChunk.text);
  const textParts = recallText.split('____') || [];
  
  // Function to create recall text with blanks for important words
  function createRecallText(text: string): string {
    const words = text.split(' ');
    // Create blanks for ~20% of words (typically nouns, verbs, key terms)
    let blankCount = 0;
    const maxBlanks = Math.max(1, Math.floor(words.length * 0.2));
    
    return words.map((word, i) => {
      // Skip short words, punctuation-only words, and limit total blanks
      if (word.length > 4 && !word.match(/^[.,;:!?]+$/) && blankCount < maxBlanks && Math.random() > 0.6) {
        blankCount++;
        return '____';
      }
      return word;
    }).join(' ');
  }
  
  // Function to extract blanks from original text and recall text
  const extractBlanks = () => {
    const originalWords = originalChunk.text.split(' ');
    const recallWords = recallText.split(' ') || [];
    
    const blanks = [];
    let blankIndex = 0;
    
    for (let i = 0; i < recallWords.length; i++) {
      if (recallWords[i] === '____') {
        blanks.push({
          index: blankIndex++,
          expectedWord: originalWords[i]
        });
      }
    }
    
    return blanks;
  };
  
  const blanks = extractBlanks();
  
  const handleInputChange = (index: number, value: string) => {
    setAnswers({ ...answers, [index]: value });
  };
  
  const checkAnswers = () => {
    setIsChecking(true);
    
    // Calculate accuracy
    let correctCount = 0;
    
    blanks.forEach(blank => {
      const userAnswer = answers[blank.index] || '';
      if (userAnswer.toLowerCase().trim() === blank.expectedWord.toLowerCase().trim()) {
        correctCount++;
      }
    });
    
    const calculatedAccuracy = blanks.length > 0 
      ? Math.round((correctCount / blanks.length) * 100) 
      : 100;
    
    setAccuracy(calculatedAccuracy);
    setIsCompleted(true);
    
    // Show toast with points
    const points = Math.round(calculatedAccuracy / 5);
    toast({
      title: `Recall completed!`,
      description: `You earned ${points} points with ${calculatedAccuracy}% accuracy.`,
    });
  };
  
  // Render the recall text with input fields for blanks
  const renderRecallText = () => {
    if (timeLeft !== null) {
      return (
        <div className="flex flex-col items-center justify-center h-32">
          <div className="text-xl font-medium mb-2">Preparing recall challenge</div>
          <div className="text-4xl font-bold">{timeLeft}</div>
          <div className="text-muted-foreground mt-2">Memorize what you just typed...</div>
        </div>
      );
    }
    
    if (!recallText) return null;
    
    let elements = [];
    
    for (let i = 0; i < textParts.length; i++) {
      // Add text part
      elements.push(<span key={`text-${i}`}>{textParts[i]}</span>);
      
      // Add input for blank (if not the last part)
      if (i < textParts.length - 1) {
        const blankIndex = i;
        const isCorrect = isChecking && answers[blankIndex]?.toLowerCase().trim() === blanks[blankIndex]?.expectedWord.toLowerCase().trim();
        const isIncorrect = isChecking && !isCorrect && answers[blankIndex];
        
        elements.push(
          <input
            key={`blank-${i}`}
            type="text"
            value={answers[blankIndex] || ''}
            onChange={(e) => handleInputChange(blankIndex, e.target.value)}
            disabled={isCompleted}
            className={`inline-block w-24 px-1 mx-1 border-b-2 focus:outline-none 
              ${isCorrect ? 'border-memty-green text-memty-green' : ''} 
              ${isIncorrect ? 'border-memty-red text-memty-red' : ''} 
              ${!isChecking ? 'border-primary' : ''}`}
          />
        );
        
        if (isChecking) {
          elements.push(
            <span 
              key={`icon-${i}`}
              className={`inline-flex ${isCorrect ? 'text-memty-green' : 'text-memty-red'}`}
            >
              {isCorrect ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </span>
          );
          
          if (isIncorrect) {
            elements.push(
              <span key={`correct-${i}`} className="text-xs text-memty-green mx-1">
                ({blanks[blankIndex]?.expectedWord})
              </span>
            );
          }
        }
      }
    }
    
    return <div className="typing-text mb-6 leading-loose">{elements}</div>;
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground/60 mb-2">Fill in the blanks:</h3>
        {renderRecallText()}
      </div>
      
      {!isChecking ? (
        <Button 
          onClick={checkAnswers} 
          className="w-full"
          disabled={timeLeft !== null}
        >
          Check Answers
        </Button>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl font-bold">
              Accuracy: <span className={accuracy > 70 ? 'text-memty-green' : 'text-memty-red'}>{accuracy}%</span>
            </div>
          </div>
          
          <Button onClick={() => onComplete(accuracy > 70)} className="w-full flex items-center justify-center gap-1">
            <span>Continue</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
