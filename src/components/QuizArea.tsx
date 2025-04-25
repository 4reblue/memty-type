
import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Button } from '@/components/ui/button';
import { Check, X, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface QuizAreaProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function QuizArea({ questions, onComplete }: QuizAreaProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const { toast } = useToast();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = (answeredQuestions.length / questions.length) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    if (isChecking) return;
    setSelectedAnswer(answer);
  };
  
  const checkAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsChecking(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done! That's the right answer.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsChecking(false);
      } else {
        // Quiz completed
        const finalScore = isCorrect ? score + 1 : score;
        const percentage = Math.round((finalScore / questions.length) * 100);
        
        // Show completion toast
        toast({
          title: "Quiz completed!",
          description: `You scored ${percentage}% (${finalScore}/${questions.length})`,
        });
        
        onComplete(percentage);
      }
    }, 1500);
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Comprehension Quiz</h3>
          <span className="text-sm text-foreground/60">
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        
        <Progress value={progressPercentage} className="h-1.5 mb-6" />
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">{currentQuestion.question}</h4>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = isChecking && option === currentQuestion.correctAnswer;
              const isIncorrect = isChecking && isSelected && option !== currentQuestion.correctAnswer;
              
              return (
                <div 
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`
                    p-3 border rounded-md cursor-pointer flex justify-between items-center
                    ${isSelected ? 'border-primary' : 'border-border'} 
                    ${isCorrect ? 'bg-memty-green/10 border-memty-green' : ''} 
                    ${isIncorrect ? 'bg-memty-red/10 border-memty-red' : ''}
                    ${!isChecking && !isSelected ? 'hover:bg-background' : ''}
                  `}
                >
                  <span>{option}</span>
                  
                  {isChecking && isCorrect && (
                    <Check className="h-5 w-5 text-memty-green" />
                  )}
                  
                  {isChecking && isIncorrect && (
                    <X className="h-5 w-5 text-memty-red" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={checkAnswer} 
        disabled={!selectedAnswer || isChecking} 
        className="w-full"
      >
        {isChecking ? 'Next Question' : 'Submit Answer'}
      </Button>
    </div>
  );
}
