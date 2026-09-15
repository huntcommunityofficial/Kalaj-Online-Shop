'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = { dark: boolean; toggle: () => void };
const ThemeContext = createContext<ThemeContextType>({ dark: false, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    setReady(true);
  }, []);

  function toggle() {
    setDark((d) => {
      const next = !d;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }

  return <ThemeContext.Provider value={{ dark, toggle }}>{ready && children || children}</ThemeContext.Provider>;
}
