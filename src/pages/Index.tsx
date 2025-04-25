
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LessonCard } from '@/components/LessonCard';
import { LessonUpload } from '@/components/LessonUpload';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Award, TrendingUp, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleLesson } from '@/data/sampleLesson';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lesson } from '@/types';

const Index = () => {
  const { getUserStats, streak } = useUserProgress();
  const stats = getUserStats();
  const [lessons, setLessons] = useState<Lesson[]>([sampleLesson]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Load lessons from localStorage on component mount
  useEffect(() => {
    try {
      const savedLessons = localStorage.getItem('memty-lessons');
      if (savedLessons) {
        const parsedLessons = JSON.parse(savedLessons);
        // Merge with sample lessons, avoiding duplicates
        const allLessons = [
          sampleLesson,
          ...parsedLessons.filter((l: Lesson) => l.id !== sampleLesson.id)
        ];
        setLessons(allLessons);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-screen-xl">
          {/* Welcome section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Welcome to Memty</h1>
              
              <Dialog open={isUploading} onOpenChange={setIsUploading}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Upload Lesson</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                  </DialogHeader>
                  <LessonUpload />
                </DialogContent>
              </Dialog>
            </div>
            
            <p className="text-foreground/70 max-w-3xl mb-6">
              Reinforce your learning through interactive typing exercises, active recall, and comprehension quizzes. 
              Turn any lesson material into an engaging memory retention tool.
            </p>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-medium text-foreground/60">Lesson Progress</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-memty-blue mr-2" />
                    <div className="text-2xl font-bold">
                      {stats.completedLessons}/{stats.totalLessons || lessons.length}
                    </div>
                  </div>
                  <CardDescription>Lessons completed</CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-medium text-foreground/60">Current Streak</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-memty-green mr-2" />
                    <div className="text-2xl font-bold">{streak}</div>
                  </div>
                  <CardDescription>Days in a row</CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-medium text-foreground/60">Badges Earned</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-memty-yellow mr-2" />
                    <div className="text-2xl font-bold">{stats.badges.length}</div>
                  </div>
                  <CardDescription>For lesson completion</CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Lessons section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Your Lessons</h2>
            
            {lessons.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-10 text-center">
                <X className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first lesson by clicking the "Upload Lesson" button above.
                </p>
                <Button onClick={() => setIsUploading(true)}>Create Lesson</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <LessonCard 
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    description={lesson.content.substring(0, 120) + (lesson.content.length > 120 ? '...' : '')}
                    progress={0}
                    isNew={lesson.id !== sampleLesson.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
