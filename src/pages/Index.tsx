
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LessonCard } from '@/components/LessonCard';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleLesson } from '@/data/sampleLesson';

const Index = () => {
  // Sample lessons data
  const lessons = [
    {
      id: sampleLesson.id,
      title: sampleLesson.title,
      description: 'Learn the basics of efficient typing, including proper technique and ergonomics.',
      isNew: true
    },
    {
      id: 'lesson-2',
      title: 'Advanced Typing Techniques',
      description: 'Take your typing skills to the next level with advanced exercises and practice.',
      progress: 45,
      lastAccessed: '2024-04-15T10:30:00'
    },
    {
      id: 'lesson-3',
      title: 'Keyboard Shortcuts Masterclass',
      description: 'Boost your productivity by mastering essential keyboard shortcuts.',
      progress: 12,
      lastAccessed: '2024-04-10T15:20:00'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-screen-xl">
          {/* Welcome section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Welcome to Memty</h1>
              
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Upload Lesson</span>
              </Button>
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
                    <div className="text-2xl font-bold">1/3</div>
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
                    <div className="text-2xl font-bold">2</div>
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
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <CardDescription>For lesson completion</CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Lessons section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Your Lessons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard 
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  description={lesson.description}
                  progress={lesson.progress}
                  lastAccessed={lesson.lastAccessed}
                  isNew={lesson.isNew}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
