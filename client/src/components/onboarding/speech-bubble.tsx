import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  children: ReactNode;
  position?: 'left' | 'right';
  type?: 'info' | 'success' | 'warning';
  className?: string;
}

const typeStyles = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
  },
};

const SpeechBubble = ({ 
  children, 
  position = 'left', 
  type = 'info',
  className = '' 
}: SpeechBubbleProps) => {
  const styles = typeStyles[type];
  
  // Animation variants
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      x: position === 'left' ? -20 : 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        damping: 12,
        stiffness: 200
      } 
    }
  };

  return (
    <motion.div
      className={`relative max-w-md ${styles.text} ${className}`}
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
    >
      <div className={`${styles.bg} p-4 rounded-lg border ${styles.border} shadow-sm`}>
        {children}
        
        {/* The little pointy part of the speech bubble */}
        <div 
          className={`absolute ${position === 'left' ? '-left-2' : '-right-2'} top-5 w-0 h-0`}
          style={{ 
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: position === 'left' ? '8px solid #DBEAFE' : 'none', // Blue-100 for info type
            borderLeft: position === 'right' ? '8px solid #DBEAFE' : 'none', // Blue-100 for info type
          }}
        ></div>
      </div>
    </motion.div>
  );
};

export default SpeechBubble;