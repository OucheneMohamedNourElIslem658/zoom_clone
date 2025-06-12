import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, MoreVertical, X } from "lucide-react"
import { Chat, type ChatProps } from "@livekit/components-react"

type Participant = {
  id: number
  name: string
  avatar: string
  isMuted: boolean
  isVideoOff: boolean
  isHost: boolean
}

interface MeetingSidebarProps {
  isSidebarOpen: boolean
  onSidebarOpenChange?: (open: boolean) => void
  chatProps: ChatProps
}

const participants = [
  { id: 1, name: "Alice Johnson", avatar: "A", isMuted: false, isVideoOff: false, isHost: true },
  { id: 2, name: "Bob Smith", avatar: "B", isMuted: true, isVideoOff: false, isHost: false },
  { id: 3, name: "You", avatar: "Y", isMuted: false, isVideoOff: false, isHost: false },
  { id: 4, name: "Carol Davis", avatar: "C", isMuted: false, isVideoOff: true, isHost: false },
]

const MeetingSidebar = ({isSidebarOpen, onSidebarOpenChange, chatProps }: MeetingSidebarProps) => {
  return (
    <Sheet open={isSidebarOpen} onOpenChange={onSidebarOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col [&>button:first-of-type]:hidden">
        <SheetTitle className="relative mb-7">
            <SheetClose className="absolute top-4 right-4">
                <X/>
            </SheetClose>
        </SheetTitle>
        <Tabs defaultValue="participants" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 w-[calc(100%-2rem)] mx-4">
              <TabsTrigger value="participants" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants ({participants.length})
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
            </TabsList>

          <TabsContent value="participants" className="flex-1">
            <ParticipantsList participants={participants} />
          </TabsContent>

          <TabsContent value="chat">
            <Chat
              messageFormatter={chatProps.messageFormatter}
              messageEncoder={chatProps.messageEncoder}
              messageDecoder={ chatProps.messageDecoder}
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
      <ScrollArea className="h-[calc(100vh)]">
        <div className="space-y-2 mb-[100px]">
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
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors mx-4">
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

export default MeetingSidebar