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
import { PromiseBuilder } from "../promise_builder"
import { getCurrentUser, logout } from "@/services/auth"
import { Skeleton } from "../ui/skeleton"

export function AppBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-5 md:gap-8">
          <Link to="/" className="flex items-center space-x-2 gap-2 ml-2">
        <Logo size={10}/>
        <span className="hidden font-bold sm:inline-block">MeetSpace</span>
          </Link>
        </div>

        <PromiseBuilder
          promise={getCurrentUser}
          builder={(user, loading, error) => {
        if (loading) return (
          <div className="flex items-center gap-2 pr-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        );
        if (error) return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>;
        if (!user) {
          return (
            <Link to="/auth" className="flex items-center gap-2 pr-2">
          <Button variant="outline" className="h-9">Sign In</Button>
            </Link>
          )
        }
        return (
          <div className="flex items-center gap-2">
            <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata.avatar_url || "/placeholder.svg?height=32&width=32"} alt={user?.id} />
            <AvatarFallback>{user?.user_metadata.name.charAt(0)}</AvatarFallback>
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
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
            </DropdownMenu>
            <ProfileDialog user={user} isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
          </div>
        )
          }}
        />
      </div>
    </header>
  )
}