
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TypingArea } from '@/components/TypingArea';
import { RecallArea } from '@/components/RecallArea';
import { QuizArea } from '@/components/QuizArea';
import { ProgressBar } from '@/components/ProgressBar';
import { UserProgressDisplay } from '@/components/UserProgressDisplay';
import { sampleLesson, sampleQuizQuestions } from '@/data/sampleLesson';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useUserProgress } from '@/hooks/useUserProgress';
import { ContentChunk, LessonPage as LessonPageType } from '@/types';

enum LessonPhase {
  TYPING = 'typing',
  RECALL = 'recall',
  QUIZ = 'quiz',
  COMPLETED = 'completed'
}

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentChunk, setCurrentChunk] = useState<number>(0);
  const [phase, setPhase] = useState<LessonPhase>(LessonPhase.TYPING);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [lastResult, setLastResult] = useState<{ quizScore: number, recallAccuracy: number } | null>(null);
  const [lessonData, setLessonData] = useState(sampleLesson); // In a real app, fetch based on lessonId
  const { updateProgress, addPoints } = useUserProgress();
  
  const totalPages = lessonData.pages.length;
  const currentPageData = lessonData.pages[currentPage];
  const totalChunks = currentPageData?.chunks.length || 0;
  const currentChunkData = currentPageData?.chunks[currentChunk] || null;
  
  // Calculate overall progress percentage
  const overallProgress = Math.round(((currentPage * 100) + 
    (currentChunk / totalChunks * 100)) / totalPages);

  // When component mounts, try to resume progress
  useEffect(() => {
    // In a real app, you'd fetch the saved progress from server/localStorage
    const savedProgress = localStorage.getItem(`lesson-progress-${lessonId}`);
    
    if (savedProgress) {
      try {
        const { page, chunk, phaseString } = JSON.parse(savedProgress);
        setCurrentPage(page);
        setCurrentChunk(chunk);
        setPhase(phaseString as LessonPhase);
        
        toast({
          title: "Progress restored",
          description: "Continuing where you left off.",
        });
      } catch (e) {
        console.error("Error restoring progress:", e);
      }
    }
  }, [lessonId]);
  
  // Save progress when it changes
  useEffect(() => {
    if (phase === LessonPhase.COMPLETED) return;
    
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify({
      page: currentPage,
      chunk: currentChunk,
      phaseString: phase
    }));
    
    updateProgress(lessonId || '', {
      currentPage,
      currentChunk,
      phase,
      overallProgress
    });
  }, [currentPage, currentChunk, phase, lessonId, updateProgress, overallProgress]);
  
  // Handle completion of the typing phase
  const handleTypingComplete = () => {
    // Add points for completing typing
    addPoints(10);
    setPhase(LessonPhase.RECALL);
  };
  
  // Handle completion of the recall phase
  const handleRecallComplete = (success: boolean) => {
    // Add points based on success
    addPoints(success ? 20 : 5);
    
    // If this is the last chunk in the page, go to quiz phase
    if (currentChunk === totalChunks - 1) {
      setPhase(LessonPhase.QUIZ);
    } else {
      // Otherwise, move to the next chunk and back to typing phase
      setCurrentChunk((prev) => prev + 1);
      setPhase(LessonPhase.TYPING);
    }
    
    // Update accuracy based on success
    setAccuracy((prev) => Math.round((prev + (success ? 100 : 0)) / 2));
  };
  
  // Handle completion of the quiz phase
  const handleQuizComplete = (quizScore: number) => {
    setScore(quizScore);
    
    // Add points based on quiz score
    addPoints(quizScore);
    
    setLastResult({
      quizScore: quizScore,
      recallAccuracy: accuracy
    });
    
    // If this is the last page, mark lesson as completed
    if (currentPage === totalPages - 1) {
      setPhase(LessonPhase.COMPLETED);
      
      // Clear saved progress since lesson is complete
      localStorage.removeItem(`lesson-progress-${lessonId}`);
      
      // Update user progress to completed
      updateProgress(lessonId || '', {
        currentPage: totalPages,
        currentChunk: 0,
        phase: 'completed',
        overallProgress: 100,
        completed: true
      });
      
      // Show a toast with the completion message
      toast({
        title: "Lesson completed!",
        description: `You've completed the lesson with ${quizScore}% quiz score.`,
      });
    } else {
      // Move to the next page
      setCurrentPage((prev) => prev + 1);
      setCurrentChunk(0);
      setPhase(LessonPhase.TYPING);
    }
  };
  
  // Go back to home page
  const goToHome = () => {
    navigate('/');
  };
  
  // Render the current phase content
  const renderPhaseContent = () => {
    if (!currentChunkData) return null;
    
    switch (phase) {
      case LessonPhase.TYPING:
        return (
          <TypingArea 
            chunk={currentChunkData} 
            onComplete={handleTypingComplete} 
          />
        );
      
      case LessonPhase.RECALL:
        return (
          <RecallArea 
            chunk={currentChunkData} 
            originalChunk={currentChunkData} 
            onComplete={handleRecallComplete} 
          />
        );
      
      case LessonPhase.QUIZ:
        return (
          <QuizArea 
            questions={sampleQuizQuestions}
            onComplete={handleQuizComplete} 
          />
        );
      
      case LessonPhase.COMPLETED:
        return (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm text-center">
            <div className="mb-8 flex flex-col items-center">
              <Award className="h-16 w-16 text-memty-yellow mb-4" />
              <h2 className="text-2xl font-bold mb-2">Lesson Completed!</h2>
              <p className="text-foreground/70 mb-6">Great job! You've successfully completed this lesson.</p>
              
              <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-sm text-foreground/60">Quiz Score</div>
                  <div className="text-2xl font-bold text-memty-blue">
                    {lastResult?.quizScore}%
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-sm text-foreground/60">Recall Accuracy</div>
                  <div className="text-2xl font-bold text-memty-teal">
                    {lastResult?.recallAccuracy}%
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={goToHome} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="memty-container">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToHome}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{lessonData.title}</h1>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
          View Progress
        </Button>
      </div>
      
      {phase !== LessonPhase.COMPLETED && (
        <>
          <ProgressBar 
            currentPage={currentPage + 1} 
            totalPages={totalPages} 
            currentChunk={currentChunk + 1} 
            totalChunks={totalChunks} 
            phase={phase} 
          />
          
          <UserProgressDisplay 
            overallProgress={overallProgress}
            currentPage={currentPage + 1}
            totalPages={totalPages}
          />
        </>
      )}
      
      {renderPhaseContent()}
    </div>
  );
};

export default LessonPage;
