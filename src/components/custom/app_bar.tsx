"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bell, ChevronDown, HelpCircle, LogOut, Menu, Settings, User } from "lucide-react"
import { ProfileDialog } from "./profile_dialog"
import { Link } from "react-router-dom"
import Logo from "./logo"

type User = {
    name: string
    image?: string
    email?: string
    id?: string
    role?: string
}

interface AppBarProps {
  user: User
  onLogout: () => void
}

export function AppBar({ user, onLogout }: AppBarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-5 md:gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav user={user} onLogout={onLogout} />
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center space-x-2 gap-2 ml-2">
            <Logo size={12}/>
            <span className="hidden font-bold sm:inline-block">MeetSpace</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80">
              Dashboard
            </Link>
            <Link to="/projects" className="transition-colors hover:text-foreground/80">
              Projects
            </Link>
            <Link to="/team" className="transition-colors hover:text-foreground/80">
              Team
            </Link>
            <Link to="/reports" className="transition-colors hover:text-foreground/80">
              Reports
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" forceMount>
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile & Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileDialog user={user} isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  )
}

function MobileNav({ user, onLogout }: AppBarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-primary" />
          <span className="font-bold">AppName</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6">
        <div className="px-6 mb-6">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto" onClick={() => setIsProfileOpen(true)}>
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">View profile</p>
              </div>
            </div>
          </Button>
        </div>

        <nav className="space-y-1 px-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/projects"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Projects
          </Link>
          <Link
            to="/team"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <User className="h-4 w-4" />
            Team
          </Link>
          <Link
            to="/reports"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Reports
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Link>
        </nav>
      </div>

      <div className="border-t px-6 py-4">
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>

      <ProfileDialog user={user} isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </div>
  )
}
