import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardCharacter, { CharacterType } from './wizard-character';
import SpeechBubble from './speech-bubble';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '../../hooks/use-local-storage';

// Define the tutorial steps
export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  character: CharacterType;
  emotion?: 'happy' | 'thinking' | 'excited';
  messageType?: 'info' | 'success' | 'warning';
  showSkip?: boolean;
  highlight?: string; // CSS selector to highlight
}

interface PermissionWizardProps {
  onComplete: () => void;
  onSkip: () => void;
  steps?: TutorialStep[];
}

const defaultSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PermissionHub!',
    content: "I'm Shieldly, your guide to understanding ERC-7715 permissions! I'll help you understand how to manage your wallet's permissions safely.",
    character: 'shield',
    emotion: 'excited',
    messageType: 'info',
    showSkip: true,
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    content: "This is your dashboard, where you can see all your active permissions at a glance. You'll see stats about active streams, sessions, and pending requests.",
    character: 'shield',
    emotion: 'happy',
    messageType: 'info',
    highlight: '.grid-cols-1.md\\:grid-cols-3', // Highlighting stats cards
  },
  {
    id: 'streams',
    title: 'Financial Streams',
    content: "Financial streams are continuous micropayments. They let apps charge you per second, minute, or hour instead of flat monthly fees.",
    character: 'stream',
    emotion: 'happy',
    messageType: 'info',
    highlight: '.grid-cols-1.lg\\:grid-cols-2', // Highlighting stream cards
  },
  {
    id: 'sessions',
    title: 'Session-Based Permissions',
    content: "Session permissions give apps temporary access to limited functions. They expire automatically, protecting your wallet from unlimited access.",
    character: 'session',
    emotion: 'happy',
    messageType: 'info',
    highlight: '.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3', // Highlighting session cards
  },
  {
    id: 'requests',
    title: 'Permission Requests',
    content: "Apps will ask for permissions - always review what they're asking for! You can approve, deny, or modify what access they get.",
    character: 'shield',
    emotion: 'thinking',
    messageType: 'warning',
    highlight: '.bg-white.rounded-lg.shadow.overflow-hidden.border.border-gray-200', // Highlighting permission requests
  },
  {
    id: 'tips',
    title: 'Security Tips',
    content: "Always set reasonable limits, regularly review active permissions, and revoke any you no longer need. Stay safe out there!",
    character: 'tips',
    emotion: 'excited',
    messageType: 'success',
  },
];

const PermissionWizard = ({ 
  onComplete, 
  onSkip,
  steps = defaultSteps 
}: PermissionWizardProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage('hasSeenPermissionWizard', false);
  
  const currentStep = steps[currentStepIndex];
  
  // Handle highlight effect
  useEffect(() => {
    // Remove any existing highlights
    const prevHighlight = document.querySelector('.tutorial-highlight');
    if (prevHighlight) {
      prevHighlight.classList.remove('tutorial-highlight');
    }
    
    // Add highlight to current element if specified
    if (currentStep?.highlight) {
      const elementToHighlight = document.querySelector(currentStep.highlight);
      if (elementToHighlight) {
        elementToHighlight.classList.add('tutorial-highlight');
      }
    }
    
    return () => {
      // Cleanup any highlights
      const highlight = document.querySelector('.tutorial-highlight');
      if (highlight) {
        highlight.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStep]);
  
  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeWizard();
    }
  };
  
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const completeWizard = () => {
    setIsVisible(false);
    setHasSeenTutorial(true);
    onComplete();
  };
  
  const skipWizard = () => {
    setIsVisible(false);
    setHasSeenTutorial(true);
    onSkip();
  };
  
  // If user has already seen tutorial, don't show it
  if (hasSeenTutorial) {
    return null;
  }
  
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center space-x-4 max-w-xl w-full px-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="flex w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 flex items-center justify-center">
              <WizardCharacter 
                type={currentStep.character} 
                speaking={true}
                emotion={currentStep.emotion}
              />
            </div>
            
            <div className="flex-1 p-4">
              <h3 className="font-bold text-lg">{currentStep.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{currentStep.content}</p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className={isFirstStep ? 'opacity-0' : ''}
                  >
                    <span className="material-icons text-sm mr-1">arrow_back</span>
                    Back
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={nextStep}
                  >
                    {isLastStep ? 'Finish' : 'Next'}
                    {!isLastStep && <span className="material-icons text-sm ml-1">arrow_forward</span>}
                  </Button>
                </div>
                
                {currentStep.showSkip && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipWizard}
                  >
                    Skip Tutorial
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PermissionWizard;