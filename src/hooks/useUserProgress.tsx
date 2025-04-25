
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { UserProgress, UserStats, Badge } from '@/types';

export function useUserProgress() {
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [points, setPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  
  // Load user progress data when component mounts
  useEffect(() => {
    try {
      // In a real app, this would come from a backend API
      const savedProgress = localStorage.getItem('memty-user-progress');
      const savedPoints = localStorage.getItem('memty-user-points');
      const savedStreak = localStorage.getItem('memty-user-streak');
      const savedBadges = localStorage.getItem('memty-user-badges');
      
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
      
      if (savedPoints) {
        setPoints(parseInt(savedPoints));
      }
      
      if (savedStreak) {
        setStreak(parseInt(savedStreak));
      }
      
      if (savedBadges) {
        setBadges(JSON.parse(savedBadges));
      }
      
      // Check if user has visited today already
      const lastVisit = localStorage.getItem('memty-last-visit');
      const today = new Date().toDateString();
      
      if (lastVisit !== today) {
        // Check if the last visit was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastVisit === yesterdayString) {
          // Update streak
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('memty-user-streak', newStreak.toString());
          
          // Check for streak badges
          if (newStreak === 3) {
            addBadge({
              id: 'streak-3',
              name: '3 Day Streak',
              description: 'You\'ve used Memty for 3 days in a row!',
              icon: 'streak',
              earnedAt: new Date().toISOString()
            });
          } else if (newStreak === 7) {
            addBadge({
              id: 'streak-7',
              name: 'Week Warrior',
              description: 'You\'ve used Memty for an entire week straight!',
              icon: 'warrior',
              earnedAt: new Date().toISOString()
            });
          }
        } else if (lastVisit && lastVisit !== today) {
          // Streak broken - reset to 1
          setStreak(1);
          localStorage.setItem('memty-user-streak', '1');
        }
        
        // Update last visit
        localStorage.setItem('memty-last-visit', today);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }, [streak]);
  
  // Update progress for a specific lesson
  const updateProgress = useCallback((lessonId: string, progress: Partial<UserProgress>) => {
    setUserProgress(prev => {
      const existingProgress = prev[lessonId] || {
        lessonId,
        currentPage: 0,
        currentChunk: 0,
        phase: 'typing',
        completedChunks: [],
        score: 0,
        accuracy: 0,
        lastActivity: new Date().toISOString()
      };
      
      const updatedProgress = {
        ...existingProgress,
        ...progress,
        lastActivity: new Date().toISOString()
      };
      
      // Save to localStorage
      const newProgress = { ...prev, [lessonId]: updatedProgress };
      localStorage.setItem('memty-user-progress', JSON.stringify(newProgress));
      
      // Check if this is the first lesson completion
      if (progress.completed && !existingProgress.completed) {
        addBadge({
          id: 'lesson-completed',
          name: 'First Lesson',
          description: 'You completed your first lesson!',
          icon: 'lesson',
          earnedAt: new Date().toISOString()
        });
      }
      
      return newProgress;
    });
  }, []);
  
  // Add points to user's total
  const addPoints = useCallback((amount: number) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      localStorage.setItem('memty-user-points', newPoints.toString());
      
      // Check for point-based badges
      if (newPoints >= 100 && !badges.find(b => b.id === 'points-100')) {
        addBadge({
          id: 'points-100',
          name: 'Century Club',
          description: 'You\'ve earned 100 points!',
          icon: 'points',
          earnedAt: new Date().toISOString()
        });
      } else if (newPoints >= 500 && !badges.find(b => b.id === 'points-500')) {
        addBadge({
          id: 'points-500',
          name: 'High Achiever',
          description: 'You\'ve earned 500 points!',
          icon: 'achievement',
          earnedAt: new Date().toISOString()
        });
      }
      
      return newPoints;
    });
  }, [badges]);
  
  // Add a badge to the user's collection
  const addBadge = useCallback((badge: Badge) => {
    setBadges(prev => {
      // Don't add if already exists
      if (prev.find(b => b.id === badge.id)) {
        return prev;
      }
      
      const newBadges = [...prev, badge];
      localStorage.setItem('memty-user-badges', JSON.stringify(newBadges));
      
      // Show toast for new badge
      toast({
        title: "New Badge Earned!",
        description: `${badge.name}: ${badge.description}`,
      });
      
      return newBadges;
    });
  }, []);
  
  // Calculate user stats
  const getUserStats = useCallback((): UserStats => {
    const completedLessons = Object.values(userProgress).filter(p => p.completed).length;
    const totalLessons = Object.keys(userProgress).length;
    
    // Calculate average score across completed lessons
    const scores = Object.values(userProgress)
      .filter(p => p.completed)
      .map(p => p.score);
    
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
    
    // Calculate average accuracy
    const accuracies = Object.values(userProgress)
      .filter(p => p.accuracy > 0)
      .map(p => p.accuracy);
    
    const averageAccuracy = accuracies.length > 0 
      ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length 
      : 0;
    
    return {
      totalLessons,
      completedLessons,
      totalScore: points,
      averageAccuracy: Math.round(averageAccuracy),
      streak,
      badges
    };
  }, [userProgress, points, streak, badges]);
  
  return {
    userProgress,
    points,
    streak,
    badges,
    updateProgress,
    addPoints,
    addBadge,
    getUserStats
  };
}
