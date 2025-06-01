"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Video, CalendarDays, Clock } from "lucide-react"
import CreateMeetingDialog from "@/components/custom/create_meeting_dialog"

// Mock data for meetings
const meetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    date: new Date(2025, 5, 3, 10, 0),
    duration: 30,
    participants: [
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sam Lee", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Taylor Swift", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    host: "You",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Project Kickoff: Q3 Marketing Campaign",
    date: new Date(2025, 5, 3, 14, 0),
    duration: 60,
    participants: [
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sam Lee", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    host: "Maria Garcia",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Client Presentation: New Website Design",
    date: new Date(2025, 5, 4, 11, 0),
    duration: 45,
    participants: [
      { name: "You", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sam Lee", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "John Smith", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    host: "Sam Lee",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Product Roadmap Discussion",
    date: new Date(2025, 5, 1, 9, 0),
    duration: 60,
    participants: [
      { name: "You", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sam Lee", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    host: "Alex Johnson",
    status: "past",
  },
  {
    id: 5,
    title: "1:1 Performance Review",
    date: new Date(2025, 5, 5, 15, 30),
    duration: 30,
    participants: [
      { name: "You", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    host: "Alex Johnson",
    status: "upcoming",
  },
]

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export default function HomePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  // Filter meetings based on search query and active tab
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || meeting.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground mt-1">Manage your upcoming and past meetings</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search meetings..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CreateMeetingDialog/>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All Meetings</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)
              ) : (
                <EmptyState type="upcoming" />
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)
              ) : (
                <EmptyState type="past" />
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)
              ) : (
                <EmptyState type="all" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface MeetingCardProps {
  meeting: {
    id: number
    title: string
    date: Date
    duration: number
    participants: { name: string; avatar: string }[]
    host: string
    status: string
  }
}

function MeetingCard({ meeting }: MeetingCardProps) {
  const isPast = meeting.status === "past"
  const isNow =
    new Date().getTime() >= meeting.date.getTime() &&
    new Date().getTime() <= meeting.date.getTime() + meeting.duration * 60 * 1000

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{meeting.title}</h3>
            {isNow && <Badge className="bg-green-500">Now</Badge>}
          </div>
          <div className="flex items-center text-muted-foreground gap-4">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(meeting.date)} • {meeting.duration} min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 3).map((participant, i) => (
                <Avatar key={i} className="border-2 border-background h-8 w-8">
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {meeting.participants.length > 3 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{meeting.participants.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Hosted by <span className="font-medium">{meeting.host}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-center">
          {isPast ? (
            <>
              <Button variant="outline" size="sm">
                View Recording
              </Button>
              <Button variant="outline" size="sm">
                Meeting Notes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm" className="gap-1">
                <Video className="h-4 w-4" />
                {isNow ? "Join Now" : "Join"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ type }: { type: string }) {
  let message = ""
  let description = ""

  switch (type) {
    case "upcoming":
      message = "No upcoming meetings"
      description = "You don't have any scheduled meetings coming up."
      break
    case "past":
      message = "No past meetings"
      description = "You don't have any past meetings to display."
      break
    default:
      message = "No meetings found"
      description = "Try adjusting your search or filters."
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <CalendarDays className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{message}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Meeting
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Meeting</DialogTitle>
            <DialogDescription>Fill in the details below to schedule a new meeting.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input id="title" placeholder="Enter meeting title" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Create Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}