
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PortfolioContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <PortfolioContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </PortfolioContext.Provider>
  );
};
