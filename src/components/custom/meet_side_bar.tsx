import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, MoreVertical, Send, X } from "lucide-react"

type Participant = {
  id: number
  name: string
  avatar: string
  isMuted: boolean
  isVideoOff: boolean
  isHost: boolean
}

type ChatMessage = {
  id: number
  sender: string
  message: string
  time: string
}

interface MeetingSidebarProps {
  participants: Participant[]
  isSidebarOpen: boolean
  onSidebarOpenChange?: (open: boolean) => void
}

const MeetingSidebar = ({ participants, isSidebarOpen, onSidebarOpenChange }: MeetingSidebarProps) => {
  const [newMessage, setNewMessage] = useState("")

  const chatMessages: ChatMessage[] = [
    { id: 1, sender: "Alice Johnson", message: "Hello everyone!", time: "10:30 AM" },
    { id: 2, sender: "Bob Smith", message: "Good morning! Ready for the presentation?", time: "10:31 AM" },
    { id: 3, sender: "You", message: "Yes, let's get started", time: "10:32 AM" },
    { id: 4, sender: "Carol Davis", message: "Can everyone see my screen?", time: "10:35 AM" },
    { id: 14, sender: "Alice Johnson", message: "Hello everyone!", time: "10:30 AM" },
    { id: 24, sender: "Bob Smith", message: "Good morning! Ready for the presentation?", time: "10:31 AM" },
    { id: 34, sender: "You", message: "Yes, let's get started", time: "10:32 AM" },
    { id: 44, sender: "Carol Davis", message: "Can everyone see my screen?", time: "10:35 AM" },
    { id: 14, sender: "Alice Johnson", message: "Hello everyone!", time: "10:30 AM" },
    { id: 24, sender: "Bob Smith", message: "Good morning! Ready for the presentation?", time: "10:31 AM" },
    { id: 34, sender: "You", message: "Yes, let's get started", time: "10:32 AM" },
    { id: 44, sender: "Carol Davis", message: "Can everyone see my screen?", time: "10:35 AM" },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending logic here
      setNewMessage("")
    }
  }

  return (
    <Sheet open={isSidebarOpen} onOpenChange={onSidebarOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col [&>button:first-of-type]:hidden">
        <SheetTitle className="relative mb-5">
            <SheetClose className="absolute top-4 right-4">
                <X/>
            </SheetClose>
        </SheetTitle>
        <Tabs defaultValue="participants" className="flex-1 flex flex-col p-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participants ({participants.length})
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="flex-1 mt-4">
            <ParticipantsList participants={participants} />
          </TabsContent>

          <TabsContent value="chat" className="flex-1 mt-4 flex flex-col">
            <ChatSection
              messages={chatMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

const ParticipantsList = ({ participants }: { participants: Participant[] }) => {
  return (
    <div className="flex-1 w-full">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Meeting Participants</h3>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {participants.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

const ParticipantCard = ({ participant }: { participant: Participant }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback className="text-sm font-medium">{participant.avatar}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium truncate">{participant.name}</span>
            {participant.isHost && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Host
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {participant.isMuted ? (
              <div className="flex items-center gap-1">
                <MicOff className="w-3 h-3 text-destructive" />
                <span className="text-xs text-muted-foreground">Muted</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-green-600" />
                <span className="text-xs text-muted-foreground">Speaking</span>
              </div>
            )}

            {participant.isVideoOff ? (
              <VideoOff className="w-3 h-3 text-destructive" />
            ) : (
              <Video className="w-3 h-3 text-green-600" />
            )}
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Pin Video</DropdownMenuItem>
          <DropdownMenuItem>Mute Participant</DropdownMenuItem>
          {participant.isHost && <DropdownMenuItem className="text-destructive">Remove from Meeting</DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const ChatSection = ({
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
}: {
  messages: ChatMessage[]
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
}) => {
  return (
    <div className="flex-1 flex flex-col">
        <div className="flex-1 mb-4 px-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-background border-t w-full pt-4 pb-4">
            <div className="space-y-3">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            onSendMessage()
                            }
                        }}
                        className="flex-1"
                    />
                    <Button size="sm" onClick={onSendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

const ChatMessage = ({ message }: { message: ChatMessage }) => {
  const isOwnMessage = message.sender === "You"

  return (
    <div className={`space-y-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
        <div
            className={`flex items-center gap-2 text-xs text-muted-foreground ${
                isOwnMessage ? "justify-end" : "justify-start"
            }`}
            >
            {!isOwnMessage && <span className="font-medium">{message.sender}</span>}
            <span>{message.time}</span>
            {isOwnMessage && <span className="font-medium">{message.sender}</span>}
        </div>

      <div className={`inline-block max-w-[80%] ${isOwnMessage ? "ml-auto" : "mr-auto"}`}>
        <div
          className={`p-3 rounded-lg text-sm ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  )
}

export default MeetingSidebar