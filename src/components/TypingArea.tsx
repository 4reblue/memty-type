
import React, { useState, useEffect, useRef } from 'react';
import { ContentChunk } from '../types';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface TypingAreaProps {
  chunk: ContentChunk;
  onComplete: () => void;
}

export function TypingArea({ chunk, onComplete }: TypingAreaProps) {
  const [typedText, setTypedText] = useState<string>('');
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chunk]);

  // Check if the typed text matches the target text at the current position
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTypedText(value);

    const targetText = chunk.text;
    
    // Check if the typed text matches the target text up to the current position
    if (value === targetText.substring(0, value.length)) {
      setCurrentPosition(value.length);
      
      // If the user has completed typing the entire chunk
      if (value === targetText) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }
  };

  // Render the text with highlighting for completed portion
  const renderText = () => {
    const targetText = chunk.text;
    const completed = targetText.substring(0, currentPosition);
    const remaining = targetText.substring(currentPosition);

    return (
      <div className="typing-text font-mono mb-6 select-none">
        <span className="text-primary">{completed}</span>
        <span>{remaining}</span>
        {!isCompleted && <span className="cursor-blink"></span>}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground/60 mb-2">Type the following text:</h3>
        {renderText()}
      </div>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleTyping}
          disabled={isCompleted}
          className="w-full h-24 p-3 bg-background border border-border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Start typing here..."
          aria-label="Typing input"
        />
        
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
            <Button onClick={onComplete} className="flex items-center gap-1">
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-foreground/60">
        <div>
          {currentPosition}/{chunk.text.length} characters
        </div>
        <div>
          {Math.floor((currentPosition / chunk.text.length) * 100)}% completed
        </div>
      </div>
    </div>
  );
}
