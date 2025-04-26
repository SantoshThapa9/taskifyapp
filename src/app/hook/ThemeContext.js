"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
const themes = ["Maroon", "Mist", "Forest", "Peach"];
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      const initialTheme = themes.includes(stored) ? stored : "Maroon";
      setTheme(initialTheme);
      document.documentElement.classList.add(initialTheme);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove(...themes);
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);
  const toggleTheme = () => {
    const currentTheme = themes.indexOf(theme);
    const nextTheme = (currentTheme + 1) % themes.length;
    setTheme(themes[nextTheme]);
  };
  if (!theme) return null;
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
