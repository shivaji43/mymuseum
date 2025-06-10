"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { Button } from "@/components/ui/button"

/**
 * A simple button that toggles between light and dark themes
 * Alternative to the dropdown version
 */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  )
}
