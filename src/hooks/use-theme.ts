"use client"

import { useTheme as useNextTheme } from "next-themes"

/**
 * Custom hook for accessing and manipulating the current theme
 * @returns Object containing theme state and functions to change it
 */
export function useTheme() {
  const { theme, setTheme } = useNextTheme()

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  /**
   * Check if the current theme is dark
   */
  const isDarkTheme = theme === "dark"

  return {
    theme,
    setTheme,
    toggleTheme,
    isDarkTheme,
  }
}
