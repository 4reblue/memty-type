
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Flame, Star, TrendingUp, Trophy } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { getUserStats, points, streak } = useUserProgress();
  const userStats = getUserStats();
  
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'streak':
        return <Flame className="h-6 w-6" />;
      case 'warrior':
        return <Trophy className="h-6 w-6" />;
      case 'lesson':
        return <Star className="h-6 w-6" />;
      case 'points':
      case 'achievement':
      default:
        return <Award className="h-6 w-6" />;
    }
  };
  
  return (
    <div className="memty-container">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>
      
      {/* User stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stats-card">
          <div className="badge-icon mb-2">
            <Award className="h-6 w-6" />
          </div>
          <div className="stats-number text-memty-yellow">{points}</div>
          <div className="stats-label">Total Points</div>
        </div>
        
        <div className="stats-card">
          <div className="badge-icon mb-2">
            <Flame className="h-6 w-6" />
          </div>
          <div className="stats-number text-memty-red">{streak}</div>
          <div className="stats-label">Day Streak</div>
        </div>
        
        <div className="stats-card">
          <div className="badge-icon mb-2">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="stats-number text-memty-blue">
            {userStats.completedLessons}/{userStats.totalLessons}
          </div>
          <div className="stats-label">Lessons Complete</div>
        </div>
        
        <div className="stats-card">
          <div className="badge-icon mb-2">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="stats-number text-memty-teal">{userStats.badges.length}</div>
          <div className="stats-label">Badges Earned</div>
        </div>
      </div>
      
      {/* Learning progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Lessons Completed</div>
                <div>{userStats.completedLessons}/{userStats.totalLessons}</div>
              </div>
              <Progress 
                value={userStats.totalLessons > 0 
                  ? (userStats.completedLessons / userStats.totalLessons) * 100 
                  : 0
                } 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Average Accuracy</div>
                <div>{userStats.averageAccuracy}%</div>
              </div>
              <Progress value={userStats.averageAccuracy} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Badges section */}
      <Card>
        <CardHeader>
          <CardTitle>Earned Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {userStats.badges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Complete lessons to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userStats.badges.map((badge) => (
                <div key={badge.id} className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                  <div className="badge-icon flex-shrink-0">
                    {renderBadgeIcon(badge.icon)}
                  </div>
                  <div>
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                    <div className="text-xs mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {new Date(badge.earnedAt || '').toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
