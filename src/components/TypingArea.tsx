
import React, { useState, useEffect, useRef } from 'react';
import { ContentChunk } from '../types';
import { Button } from '@/components/ui/button';
import { ChevronRight, Type } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TypingAreaProps {
  chunk: ContentChunk;
  onComplete: () => void;
}

export function TypingArea({ chunk, onComplete }: TypingAreaProps) {
  const [typedText, setTypedText] = useState<string>('');
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errors, setErrors] = useState<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when chunk changes
    setTypedText('');
    setCurrentPosition(0);
    setIsCompleted(false);
    setErrors(0);
    setAccuracy(100);
    
    // Focus the input on mount and when chunk changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chunk]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const targetText = chunk.text;
    
    // Compare current character with target
    if (value.length > 0) {
      const lastTypedChar = value[value.length - 1];
      const expectedChar = targetText[value.length - 1];
      
      if (lastTypedChar !== expectedChar && value.length > typedText.length) {
        setErrors(prev => prev + 1);
        // Calculate accuracy
        const totalChars = value.length;
        const newAccuracy = Math.round(((totalChars - errors - 1) / totalChars) * 100);
        setAccuracy(Math.max(0, newAccuracy));
      }
    }
    
    // Only allow typing that matches the target text
    if (value === targetText.substring(0, value.length)) {
      setTypedText(value);
      setCurrentPosition(value.length);
      
      if (value === targetText) {
        setIsCompleted(true);
        // Add points based on accuracy
        const points = Math.round(accuracy / 10);
        toast({
          title: "Chunk completed!",
          description: `You earned ${points} points with ${accuracy}% accuracy.`,
        });
        
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderText = () => {
    const targetText = chunk.text;
    const completed = targetText.substring(0, currentPosition);
    const remaining = targetText.substring(currentPosition);

    return (
      <div className="typing-display select-none">
        <span className="text-primary">{completed}</span>
        <span className="text-muted-foreground">{remaining}</span>
        {!isCompleted && <span className="cursor-blink"></span>}
      </div>
    );
  };

  return (
    <div className="typing-container" onClick={handleContainerClick}>
      {renderText()}
      
      <div className="relative mt-8">
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleTyping}
          disabled={isCompleted}
          className="w-full h-24 p-3 bg-background/50 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary opacity-10"
          placeholder="Start typing..."
          aria-label="Typing input"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
      
      {!isFocused && (
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-muted-foreground flex items-center gap-1.5"
            onClick={handleContainerClick}
          >
            <Type className="h-3.5 w-3.5" />
            <span>Click to type</span>
          </Button>
        </div>
      )}
      
      <div className="mt-8 flex justify-between items-center text-sm text-muted-foreground">
        <div>
          {currentPosition}/{chunk.text.length} characters
        </div>
        <div>
          Accuracy: {accuracy}%
        </div>
      </div>
    </div>
  );
}
