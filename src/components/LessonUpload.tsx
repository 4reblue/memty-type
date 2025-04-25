
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateLessonChunks } from '@/utils/lessonUtils';
import { Lesson } from '@/types';

export function LessonUpload() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your lesson.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would call an API to process the content and create chunks
      const lesson = await processCourse({
        title,
        content
      });
      
      // Save the lesson to localStorage for now (would be a database in real app)
      const lessons = JSON.parse(localStorage.getItem('memty-lessons') || '[]');
      lessons.push(lesson);
      localStorage.setItem('memty-lessons', JSON.stringify(lessons));
      
      toast({
        title: "Lesson created!",
        description: `"${title}" has been successfully created and is ready to start.`,
      });
      
      // Reset form
      setTitle('');
      setContent('');
      
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Error creating lesson",
        description: "There was a problem processing your lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Simulate processing a course (in a real app, this would use AI to chunk content)
  const processCourse = async ({ title, content }: { title: string, content: string }): Promise<Lesson> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate chunks using our utility
    const pages = generateLessonChunks(content);
    
    return {
      id: `lesson-${Date.now()}`,
      title,
      content,
      pages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your lesson"
              disabled={isProcessing}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Lesson Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your lesson content here..."
              className="min-h-[200px]"
              disabled={isProcessing}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Lesson...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create Lesson
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
