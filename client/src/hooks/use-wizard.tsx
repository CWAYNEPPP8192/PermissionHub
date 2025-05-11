import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

interface WizardContextType {
  isWizardVisible: boolean;
  showWizard: () => void;
  hideWizard: () => void;
  resetWizard: () => void;
  hasCompletedWizard: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [hasCompletedWizard, setHasCompletedWizard] = useLocalStorage('hasSeenPermissionWizard', false);
  const [isWizardVisible, setIsWizardVisible] = useState(!hasCompletedWizard);

  // Show the wizard automatically on first visit
  useEffect(() => {
    if (!hasCompletedWizard) {
      setIsWizardVisible(true);
    }
  }, [hasCompletedWizard]);

  const showWizard = () => setIsWizardVisible(true);
  const hideWizard = () => {
    setIsWizardVisible(false);
    setHasCompletedWizard(true);
  };
  const resetWizard = () => {
    setHasCompletedWizard(false);
    setIsWizardVisible(true);
  };

  return (
    <WizardContext.Provider
      value={{
        isWizardVisible,
        showWizard,
        hideWizard,
        resetWizard,
        hasCompletedWizard
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  
  return context;
}