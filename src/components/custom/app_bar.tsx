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
import { ChevronDown, HelpCircle, LogOut, User } from "lucide-react"
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
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-5 md:gap-8">
          <Link to="/" className="flex items-center space-x-2 gap-2 ml-2">
            <Logo size={10}/>
            <span className="hidden font-bold sm:inline-block">MeetSpace</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
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