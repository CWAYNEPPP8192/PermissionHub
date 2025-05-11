import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback
} from 'react';
import { useLocalStorage } from './use-local-storage';
import { HealthFactor, BadgeInfo, calculateScore } from '@/components/gamification/health-score';

interface GamificationContextType {
  healthFactors: HealthFactor[];
  badges: BadgeInfo[];
  recentAchievements: BadgeInfo[];
  healthScore: number;
  updatePermissionCounts: (counts: PermissionCounts) => void;
  resetRecentAchievements: () => void;
}

interface PermissionCounts {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  unlimited: number;
  timeBound: number;
}

interface GamificationProviderProps {
  children: ReactNode;
}

const defaultHealthFactors: HealthFactor[] = [
  {
    id: 'expiry',
    name: 'Time-Bound Permissions',
    value: 7,
    maxValue: 10,
    color: 'text-blue-500',
    icon: 'timer',
    tooltip: 'Percentage of permissions that have an expiry date. Time-bound permissions automatically expire, reducing risks.'
  },
  {
    id: 'limitation',
    name: 'Resource Limits',
    value: 5,
    maxValue: 10,
    color: 'text-green-500',
    icon: 'account_balance_wallet',
    tooltip: 'Permissions with spending limits or maximum call restrictions. Limited permissions reduce potential damage.'
  },
  {
    id: 'regulation',
    name: 'Active Management',
    value: 6,
    maxValue: 10,
    color: 'text-amber-500',
    icon: 'settings',
    tooltip: 'Your level of active permission management, including regular reviews and revocations.'
  },
  {
    id: 'protection',
    name: 'Security Practices',
    value: 8,
    maxValue: 10,
    color: 'text-violet-500',
    icon: 'shield',
    tooltip: 'General security practices, including prompt reviews of permission requests.'
  }
];

const defaultBadges: BadgeInfo[] = [
  {
    id: 'starter',
    name: 'Permission Novice',
    description: 'Started managing wallet permissions with PermissionHub',
    icon: 'school',
    color: 'text-blue-500',
    condition: () => true,
    achieved: true
  },
  {
    id: 'revoker',
    name: 'Cleanup Crew',
    description: 'Revoked at least 3 unnecessary permissions',
    icon: 'cleaning_services',
    color: 'text-red-500',
    condition: (factors) => factors.find(f => f.id === 'regulation')?.value ?? 0 >= 5,
    achieved: false
  },
  {
    id: 'time-master',
    name: 'Time Master',
    description: 'Set expiry times for at least 80% of your permissions',
    icon: 'schedule',
    color: 'text-amber-500',
    condition: (factors) => factors.find(f => f.id === 'expiry')?.value ?? 0 >= 8,
    achieved: false
  },
  {
    id: 'secure-stream',
    name: 'Stream Secure',
    description: 'Created a financial stream with both time and amount limits',
    icon: 'water_drop',
    color: 'text-green-500',
    condition: (factors) => factors.find(f => f.id === 'limitation')?.value ?? 0 >= 7,
    achieved: false
  },
  {
    id: 'sentinel',
    name: 'Permission Sentinel',
    description: 'Achieved a health score of at least 80',
    icon: 'verified',
    color: 'text-violet-500',
    condition: (factors) => calculateScore(factors) >= 80,
    achieved: false
  },
  {
    id: 'guardian',
    name: 'Wallet Guardian',
    description: 'Maintained perfect security practices for at least a week',
    icon: 'security',
    color: 'text-emerald-500',
    condition: (factors) => factors.find(f => f.id === 'protection')?.value ?? 0 >= 9,
    achieved: false
  }
];

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: GamificationProviderProps) {
  // Persistent storage
  const [storedFactors, setStoredFactors] = useLocalStorage<HealthFactor[]>(
    'permissionHub_healthFactors', 
    defaultHealthFactors
  );
  
  const [storedBadges, setStoredBadges] = useLocalStorage<BadgeInfo[]>(
    'permissionHub_badges',
    defaultBadges
  );
  
  // State
  const [healthFactors, setHealthFactors] = useState<HealthFactor[]>(storedFactors);
  const [badges, setBadges] = useState<BadgeInfo[]>(storedBadges);
  const [recentAchievements, setRecentAchievements] = useState<BadgeInfo[]>([]);
  const [healthScore, setHealthScore] = useState(() => calculateScore(healthFactors));
  
  // Update health factors based on permission counts
  const updatePermissionCounts = useCallback((counts: PermissionCounts) => {
    // Calculate new values for factors
    const updatedFactors = [...healthFactors];
    
    // Update time-bound permissions factor
    const expiryFactor = updatedFactors.find(f => f.id === 'expiry');
    if (expiryFactor && counts.total > 0) {
      const percentageTimeBound = counts.timeBound / counts.total;
      expiryFactor.value = Math.min(10, Math.round(percentageTimeBound * 10));
    }
    
    // Update limitation factor
    const limitFactor = updatedFactors.find(f => f.id === 'limitation');
    if (limitFactor && counts.total > 0) {
      const percentageLimited = (counts.total - counts.unlimited) / counts.total;
      limitFactor.value = Math.min(10, Math.round(percentageLimited * 10));
    }
    
    // Update regulation factor
    const regulationFactor = updatedFactors.find(f => f.id === 'regulation');
    if (regulationFactor) {
      // Value increases with expired and revoked permissions
      const managementScore = Math.min(10, 5 + Math.round((counts.expired + counts.revoked) / 2));
      regulationFactor.value = managementScore;
    }
    
    // Set updated factors
    setHealthFactors(updatedFactors);
    setStoredFactors(updatedFactors);
    
    // Recalculate health score
    setHealthScore(calculateScore(updatedFactors));
  }, [healthFactors, setStoredFactors]);
  
  // Check for newly achieved badges
  useEffect(() => {
    const updatedBadges = badges.map(badge => {
      // If already achieved, keep it that way
      if (badge.achieved) return badge;
      
      // Check if condition is now met
      const isAchieved = badge.condition(healthFactors);
      return {
        ...badge,
        achieved: isAchieved
      };
    });
    
    // Find newly achieved badges
    const newAchievements = updatedBadges.filter(
      (badge, idx) => badge.achieved && !badges[idx].achieved
    );
    
    if (newAchievements.length > 0) {
      setRecentAchievements(newAchievements);
      setBadges(updatedBadges);
      setStoredBadges(updatedBadges);
    }
  }, [healthFactors, badges, setStoredBadges]);
  
  // Clear recent achievements after they've been displayed
  const resetRecentAchievements = useCallback(() => {
    setRecentAchievements([]);
  }, []);
  
  const value = {
    healthFactors,
    badges,
    recentAchievements,
    healthScore,
    updatePermissionCounts,
    resetRecentAchievements
  };
  
  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  
  return context;
}