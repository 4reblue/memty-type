
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface UserProgressDisplayProps {
  overallProgress: number;
  currentPage: number;
  totalPages: number;
}

export function UserProgressDisplay({ overallProgress, currentPage, totalPages }: UserProgressDisplayProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <div className="text-sm font-medium">Overall Progress</div>
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>Page {currentPage} of {totalPages}</span>
        </Badge>
      </div>
      
      <Progress 
        value={overallProgress} 
        className="h-2 mb-1" 
      />
      
      <div className="text-xs text-muted-foreground text-right">
        {overallProgress}% complete
      </div>
    </div>
  );
}
