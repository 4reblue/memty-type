
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  progress?: number;
  lastAccessed?: string;
  isNew?: boolean;
}

export function LessonCard({ id, title, description, progress = 0, lastAccessed, isNew = false }: LessonCardProps) {
  // Format the last accessed date if provided
  const formattedDate = lastAccessed ? new Date(lastAccessed).toLocaleDateString() : null;
  
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {isNew && (
            <span className="text-xs font-medium bg-memty-green/20 text-memty-green px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {progress > 0 ? (
          <div className="space-y-1">
            <div className="text-xs text-foreground/60 flex justify-between">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="h-7"></div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-xs text-foreground/60">
          {formattedDate ? (
            <>
              <Clock className="h-3 w-3 mr-1" />
              <span>Last accessed {formattedDate}</span>
            </>
          ) : (
            <>
              <Book className="h-3 w-3 mr-1" />
              <span>Not started</span>
            </>
          )}
        </div>
        
        <Button asChild size="sm" variant={progress > 0 ? "outline" : "default"}>
          <Link to={`/lesson/${id}`}>
            {progress > 0 ? 'Continue' : 'Start'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
