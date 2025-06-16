import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, X, Check, Search } from "lucide-react"
import { PromiseBuilder } from "../promise_builder"
import { getUsers } from "@/services/schedule"

interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export default function PaginatedUsersSearchCard({
    onParticipantsChange,
    defaultSelectedUsers = [],
    disabled
}: {
    onParticipantsChange?: (participants: User[]) => void
    defaultSelectedUsers?: User[]
    disabled?: boolean
}) {
    
    const [participants, setParticipants] = useState<User[]>([])

    useEffect(() => {
        setParticipants(defaultSelectedUsers)
    }, [])
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    const addUserAsParticipant = (user: User) => {
        if (!participants.some((p) => p.email === user.email)) {
            const updated = [...participants, user]
            setParticipants(updated)
            onParticipantsChange?.(updated)
        }
        setSearchOpen(false)
        setSearchValue("")
    }

    const removeParticipant = (participantEmail: string) => {
        const updated = participants.filter((p) => p.email !== participantEmail)
        setParticipants(updated)
        onParticipantsChange?.(updated)
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Card>
            <CardContent>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Participants</h3>
                    </div>

                    {/* Search Input */}
                    <div className="space-y-4">
                        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal h-11"
                                    onClick={() => setSearchOpen(true)}
                                    disabled={disabled}
                                >
                                    <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                                    {searchValue || "Search and add participants..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder="Search users by name or email..."
                                        value={searchValue}
                                        onValueChange={setSearchValue}
                                        className="border-0 focus:ring-0"
                                        disabled={disabled}
                                    />
                                    <CommandList className="max-h-64">
                                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                            No users found.
                                        </CommandEmpty>
                                        <PromiseBuilder
                                            promise={() =>
                                                getUsers({
                                                    emailQuery: searchValue,
                                                    pageSize: 10,
                                                })
                                            }
                                            builder={(users, loading, error) => {
                                                if (loading) {
                                                    return (
                                                        <CommandItem disabled className="justify-center py-4">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                                Loading users...
                                                            </div>
                                                        </CommandItem>
                                                    )
                                                }

                                                if (error || !users) {
                                                    return (
                                                        <CommandItem disabled className="justify-center py-4 text-destructive">
                                                            Error loading users
                                                        </CommandItem>
                                                    )
                                                }

                                                return (
                                                    <CommandGroup>
                                                        {users.map((user) => {
                                                            const isSelected = participants.some((p) => p.email === user.email)
                                                            return (
                                                                <CommandItem
                                                                    key={user.id}
                                                                    onSelect={() =>
                                                                        addUserAsParticipant({
                                                                            id: user.id,
                                                                            name: user.name,
                                                                            email: user.email,
                                                                            avatarUrl: user.avatarUrl,
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-3 p-3 cursor-pointer"
                                                                    disabled={isSelected}
                                                                >
                                                                    <Avatar className="w-8 h-8">
                                                                        <AvatarImage
                                                                            src={user.avatarUrl || "/placeholder.svg"}
                                                                            alt={`${user.name}'s avatar`}
                                                                            className="object-cover"
                                                                        />
                                                                        <AvatarFallback className="text-xs font-medium">
                                                                            {getInitials(user.name)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                                    </div>
                                                                    {isSelected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                                                                </CommandItem>
                                                            )
                                                        })}
                                                    </CommandGroup>
                                                )
                                            }}
                                        />
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Selected Participants */}
                        {participants.length > 0 && (
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Selected Participants ({participants.length})
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {participants.map((participant, _) => (
                                        <Badge key={participant.email} variant="secondary" className="flex items-center gap-2 px-3 py-1.5 text-sm">
                                            <span className="truncate">{participant.email}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                                                disabled={disabled}
                                                onClick={() => removeParticipant(participant.email)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
