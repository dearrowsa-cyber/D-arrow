'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme to avoid hydration mismatch
const DEFAULT_THEME: Theme = 'light';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme after mount
  useEffect(() => {
    setIsMounted(true);
    
    // Use requestIdleCallback to defer theme loading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const savedTheme = localStorage.getItem('site_theme') as Theme | null;
        const initialTheme = savedTheme || DEFAULT_THEME;
        if (initialTheme !== DEFAULT_THEME) {
          setThemeState(initialTheme);
          applyTheme(initialTheme);
        }
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        const savedTheme = localStorage.getItem('site_theme') as Theme | null;
        const initialTheme = savedTheme || DEFAULT_THEME;
        if (initialTheme !== DEFAULT_THEME) {
          setThemeState(initialTheme);
          applyTheme(initialTheme);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('site_theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const applyTheme = (themeToApply: Theme) => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (themeToApply === 'dark') {
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
      } else {
        html.classList.add('light-mode');
        html.classList.remove('dark-mode');
      }
    }
  };

  // Render children immediately to prevent hydration mismatch
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
