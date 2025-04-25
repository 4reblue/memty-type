
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chunk]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTypedText(value);
    
    const targetText = chunk.text;
    if (value === targetText.substring(0, value.length)) {
      setCurrentPosition(value.length);
      
      if (value === targetText) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }
  };

  const renderText = () => {
    const targetText = chunk.text;
    const completed = targetText.substring(0, currentPosition);
    const remaining = targetText.substring(currentPosition);

    return (
      <div className="typing-display select-none text-center">
        <span className="text-primary">{completed}</span>
        <span className="text-muted-foreground">{remaining}</span>
        {!isCompleted && <span className="cursor-blink"></span>}
      </div>
    );
  };

  return (
    <div className="typing-container">
      {renderText()}
      
      <div className="relative mt-8">
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleTyping}
          disabled={isCompleted}
          className="w-full h-24 p-3 bg-background/50 border-none rounded-md resize-none focus:outline-none focus:ring-0 opacity-0"
          placeholder="Start typing..."
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
      
      <div className="mt-8 flex justify-between items-center text-sm text-muted-foreground">
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
