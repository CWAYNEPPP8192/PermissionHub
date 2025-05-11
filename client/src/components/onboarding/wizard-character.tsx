import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type CharacterType = 'shield' | 'stream' | 'session' | 'tips';

interface WizardCharacterProps {
  type: CharacterType;
  speaking?: boolean;
  emotion?: 'happy' | 'thinking' | 'excited';
}

const characterColors = {
  shield: {
    primary: 'text-primary',
    secondary: 'text-blue-300',
    bg: 'bg-blue-100',
  },
  stream: {
    primary: 'text-green-600',
    secondary: 'text-green-300',
    bg: 'bg-green-50',
  },
  session: {
    primary: 'text-violet-600',
    secondary: 'text-violet-300',
    bg: 'bg-violet-50',
  },
  tips: {
    primary: 'text-amber-600',
    secondary: 'text-amber-300',
    bg: 'bg-amber-50',
  },
};

const WizardCharacter = ({ type, speaking = false, emotion = 'happy' }: WizardCharacterProps) => {
  const colors = characterColors[type];
  const [blink, setBlink] = useState(false);
  
  // Randomized blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Character face parts based on emotion
  const eyeStyle = blink ? "h-0.5" : "h-3";
  
  const mouthShape = speaking
    ? <motion.div 
        className={`w-4 h-3 ${colors.primary} rounded-full mt-2`}
        animate={{ scaleY: [1, 0.7, 1], scaleX: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      />
    : emotion === 'happy'
      ? <div className={`w-4 h-1.5 rounded-full ${colors.primary} mt-2`} />
      : emotion === 'thinking' 
        ? <div className={`w-3 h-1 rounded-full ${colors.primary} mt-2 ml-1`} />
        : <div className={`w-5 h-2 rounded-full ${colors.primary} mt-2`} />;

  // Bouncing animation
  const bounceAnimation = speaking || emotion === 'excited'
    ? { y: [0, -10, 0], transition: { repeat: Infinity, duration: 1.5 } }
    : {};

  return (
    <motion.div 
      className="relative"
      animate={bounceAnimation}
    >
      {/* Character body */}
      <motion.div 
        className={`w-24 h-24 rounded-full ${colors.bg} flex items-center justify-center relative overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Character face */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-4 mb-2">
            <motion.div 
              className={`w-3 ${eyeStyle} rounded-full ${colors.primary}`}
              animate={emotion === 'thinking' ? { y: [0, -2, 0] } : {}}
              transition={{ repeat: emotion === 'thinking' ? Infinity : 0, duration: 2 }}
            />
            <motion.div 
              className={`w-3 ${eyeStyle} rounded-full ${colors.primary}`}
              animate={emotion === 'thinking' ? { y: [0, -2, 0] } : {}}
              transition={{ repeat: emotion === 'thinking' ? Infinity : 0, duration: 2 }}
            />
          </div>
          
          {/* Mouth */}
          {mouthShape}
        </div>
        
        {/* Icon badge - different icon based on character type */}
        <div className={`absolute bottom-1 right-1 rounded-full ${colors.bg} border-2 ${colors.secondary} border-opacity-50 flex items-center justify-center w-8 h-8`}>
          <span className="material-icons text-sm">
            {type === 'shield' ? 'shield' : 
             type === 'stream' ? 'water_drop' : 
             type === 'session' ? 'timer' : 'tips_and_updates'}
          </span>
        </div>
      </motion.div>
      
      {/* Speech bubble */}
      {speaking && (
        <motion.div 
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <div className="w-4 h-4 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-700 absolute -right-1.5" />
            <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-700 absolute -right-2.5 -top-0.5" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WizardCharacter;