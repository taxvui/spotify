import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  isHighContrast: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleTheme = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isHighContrast, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};