"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Sun, Moon, User, LogIn, Settings, Heart, Ticket, Coffee, Theater, Building, Bot, Search } from 'lucide-react'
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  {
    name: "Museums",
    href: "/museums",
    icon: Building,
    description: "Explore world-class museums",
  },
  {
    name: "Shows",
    href: "/shows",
    icon: Theater,
    description: "Book tickets for amazing shows",
  },
  {
    name: "Cafés",
    href: "/cafes",
    icon: Coffee,
    description: "Discover great dining spots",
  },  {
    name: "muBuddy",
    href: "/mubuddy",
    icon: Bot,
    description: "A bot to curate you fav things",
  },

]

export function AppBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const isActivePath = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">MyMuseum</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActivePath(item.href) ? "secondary" : "ghost"}
                    className={cn("flex items-center space-x-2 px-3 py-2", isActivePath(item.href) && "bg-secondary")}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search - Desktop only */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Moon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Create Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Ticket className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                      <Building className="h-4 w-4" />
                    </div>
                    <span>MyMuseum</span>
                  </SheetTitle>
                  <SheetDescription>Discover museums, shows, and cafés</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Search */}
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>

                  {/* Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Navigation</h3>
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                          <Button
                            variant={isActivePath(item.href) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col items-start">
                              <span>{item.name}</span>
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            </div>
                          </Button>
                        </Link>
                      )
                    })}

                    {/* muBuddy */}
                    <Button variant="ghost" className="w-full justify-start">
                      <Bot className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <div className="flex items-center space-x-2">
                          <span>muBuddy</span>
                          <Badge variant="secondary" className="text-xs">
                            AI
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">Your AI travel companion</span>
                      </div>
                    </Button>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
                    <Button variant="outline" className="w-full justify-start">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Create Account
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Ticket className="mr-2 h-4 w-4" />
                      My Bookings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>

                  {/* Theme Toggle Mobile */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Appearance</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "secondary" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "secondary" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}