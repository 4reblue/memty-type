
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
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return;
    
    // Handle backspace
    if (e.key === 'Backspace' && typedText.length > 0) {
      setTypedText(prev => prev.slice(0, -1));
      setCurrentPosition(prev => prev - 1);
      return;
    }
    
    // Ignore modifier keys and other non-printable characters
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    
    const targetText = chunk.text;
    const expectedChar = targetText[currentPosition];
    const typedChar = e.key;
    
    // Add the character to typedText regardless of correctness
    const newTypedText = typedText + typedChar;
    setTypedText(newTypedText);
    setCurrentPosition(prev => prev + 1);
    
    // Check if the typed character is correct
    if (typedChar !== expectedChar) {
      setErrors(prev => prev + 1);
      // Calculate accuracy
      const totalChars = newTypedText.length;
      const newAccuracy = Math.round(((totalChars - errors - 1) / totalChars) * 100);
      setAccuracy(Math.max(0, newAccuracy));
    }
    
    // Check if typing is completed
    if (currentPosition + 1 === targetText.length) {
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
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderText = () => {
    const targetText = chunk.text;
    
    return (
      <div className="monkeytype-text">
        {targetText.split('').map((char, index) => {
          let className = "monkeytype-char";
          
          if (index < currentPosition) {
            // Character has been typed
            const isCorrect = typedText[index] === char;
            className += isCorrect ? " correct" : " incorrect";
          } else if (index === currentPosition) {
            // Current character
            className += " current";
          }
          
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
        {currentPosition === targetText.length && !isCompleted && (
          <span className="cursor-blink"></span>
        )}
      </div>
    );
  };

  return (
    <div 
      className="typing-container monkeytype-container" 
      onClick={handleContainerClick}
      tabIndex={-1}
    >
      {renderText()}
      
      <input
        ref={inputRef}
        type="text"
        className="monkeytype-hidden-input"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onKeyDown={handleTyping}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
