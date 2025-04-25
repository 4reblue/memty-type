
import React from 'react';

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
  currentChunk: number;
  totalChunks: number;
  phase: 'typing' | 'recall' | 'quiz';
}

export function ProgressBar({ currentPage, totalPages, currentChunk, totalChunks, phase }: ProgressBarProps) {
  // Calculate overall progress percentage
  const progressPercent = Math.floor((currentChunk / totalChunks) * 100);
  
  // Determine the current phase in the process
  const getPhaseLabel = () => {
    switch(phase) {
      case 'typing': return 'Typing';
      case 'recall': return 'Recall';
      case 'quiz': return 'Quiz';
      default: return '';
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2 text-sm text-foreground/60">
        <div>
          Page {currentPage}/{totalPages}
        </div>
        <div>
          {getPhaseLabel()} Phase
        </div>
        <div>
          {progressPercent}% Complete
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
