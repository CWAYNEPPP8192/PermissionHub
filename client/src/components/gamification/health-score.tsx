import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export interface HealthFactor {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  color: string; // CSS color for the factor
  icon: string; // Material icon name
  tooltip: string; // Explanation of this factor
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: (factors: HealthFactor[]) => boolean;
  achieved: boolean;
}

interface HealthScoreProps {
  factors: HealthFactor[];
  recentAchievements?: BadgeInfo[];
  className?: string;
}

export const calculateScore = (factors: HealthFactor[]): number => {
  if (factors.length === 0) return 0;
  
  const total = factors.reduce((sum, factor) => sum + (factor.value / factor.maxValue), 0);
  return Math.round((total / factors.length) * 100);
};

const HealthScore = ({ 
  factors, 
  recentAchievements = [],
  className = '' 
}: HealthScoreProps) => {
  const { toast } = useToast();
  const [score, setScore] = useState(() => calculateScore(factors));
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const newScore = calculateScore(factors);
    setScore(newScore);
  }, [factors]);
  
  // Determine score color based on the value
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get appropriate emoji for the score
  const getScoreEmoji = () => {
    if (score >= 80) return '🔒'; // Locked/secure
    if (score >= 60) return '👍'; // Good
    if (score >= 40) return '⚠️'; // Warning
    return '⚡'; // Danger
  };
  
  // Handle animation on score change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [score]);
  
  // Show toast when new achievement is unlocked (only for recent achievements)
  useEffect(() => {
    if (recentAchievements.length > 0) {
      recentAchievements.forEach(achievement => {
        toast({
          title: `New Badge Unlocked: ${achievement.name}`,
          description: achievement.description,
          variant: "default",
        });
      });
    }
  }, [recentAchievements, toast]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 ${className} dark:bg-gray-800`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Permission Health Score</h3>
        
        <div className="flex justify-center mb-3">
          <motion.div
            className={`text-4xl font-bold ${getScoreColor()}`}
            animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {score}
          </motion.div>
          <motion.div 
            className="text-4xl ml-1"
            animate={isAnimating ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {getScoreEmoji()}
          </motion.div>
        </div>
        
        <Progress value={score} className="h-2 mb-1" />
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>High Risk</span>
          <span>Secure</span>
        </div>
      </div>
      
      {/* Health Factors */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-sm mb-2">Score Factors</h4>
        
        {factors.map(factor => {
          const percentage = Math.round((factor.value / factor.maxValue) * 100);
          
          return (
            <TooltipProvider key={factor.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className={`material-icons text-sm mr-1 ${factor.color}`}>
                          {factor.icon}
                        </span>
                        <span className="text-sm">{factor.name}</span>
                      </div>
                      <span className={`text-xs font-medium ${
                        percentage >= 70 ? 'text-green-500' : 
                        percentage >= 40 ? 'text-amber-500' : 
                        'text-red-500'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-1.5 ${
                        percentage >= 70 ? 'bg-green-100' : 
                        percentage >= 40 ? 'bg-amber-100' : 
                        'bg-red-100'
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{factor.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      
      {/* Badges & Achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-3">Recent Badges</h4>
          <div className="flex flex-wrap gap-2">
            {recentAchievements.map(badge => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${badge.color} cursor-help`}
                    >
                      <span className="material-icons text-sm">{badge.icon}</span>
                      <span>{badge.name}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthScore;