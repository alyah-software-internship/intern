import React, { createContext, useState, useContext, useEffect } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { lightTheme, darkTheme } from "../config/theme";

// Create Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get initial theme
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("iShareTheme");
    if (savedTheme) return savedTheme;

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    localStorage.setItem("iShareTheme", theme);

    // Apply dark class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Set specific theme
  const setThemeMode = (mode) => {
    if (mode === "light" || mode === "dark") {
      setTheme(mode);
    }
  };

  // Get Ant Design theme config
  const getAntTheme = () => {
    return theme === "dark" ? darkTheme : lightTheme;
  };

  // Get Ant Design algorithm
  const getAlgorithm = () => {
    return theme === "dark"
      ? antTheme.darkAlgorithm
      : antTheme.defaultAlgorithm;
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("iShareTheme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === "dark",
    isLight: theme === "light",
    mounted,
    getAntTheme,
    getAlgorithm,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          ...getAntTheme(),
          algorithm: getAlgorithm(),
        }}
      >
        <div style={{ visibility: mounted ? "visible" : "hidden" }}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
