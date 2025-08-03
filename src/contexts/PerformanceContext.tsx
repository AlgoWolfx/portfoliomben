import React, { createContext, useContext, ReactNode } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface PerformanceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  shouldReduceMotion: boolean;
  isSlowDevice: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const performanceData = useMobileOptimization();

  return (
    <PerformanceContext.Provider value={performanceData}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};