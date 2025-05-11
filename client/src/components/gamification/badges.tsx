import React from 'react';
import { motion } from 'framer-motion';
import { BadgeInfo } from './health-score';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BadgesListProps {
  badges: BadgeInfo[];
  className?: string;
}

const BadgesList = ({ badges, className = '' }: BadgesListProps) => {
  // Split badges into achieved and unachieved
  const achievedBadges = badges.filter(badge => badge.achieved);
  const unachievedBadges = badges.filter(badge => !badge.achieved);
  
  // Animation variants
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        type: 'spring',
        stiffness: 200
      }
    })
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span className="material-icons mr-2 text-primary">emoji_events</span>
          Badge Collection
        </CardTitle>
        <CardDescription>
          Earn badges by maintaining good security practices
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {achievedBadges.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Earned Badges ({achievedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={badgeVariants}
                  className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 text-center dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 rounded-full ${badge.color} bg-opacity-20 flex items-center justify-center mb-2`}>
                    <span className="material-icons">{badge.icon}</span>
                  </div>
                  <span className="font-medium text-sm mb-1">{badge.name}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400">
            <p>No badges earned yet. Start securing your permissions!</p>
          </div>
        )}
        
        {/* Locked/Unachieved Badges */}
        {unachievedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Available Badges ({unachievedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {unachievedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200 text-center opacity-60 dark:bg-gray-900 dark:border-gray-700"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2 dark:bg-gray-700">
                    <span className="material-icons text-gray-500">lock</span>
                  </div>
                  <span className="font-medium text-sm mb-1">{badge.name}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesList;