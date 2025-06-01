import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Phone,
  MessageSquare,
  Users,
  Settings,
  MoreVertical,
  Send,
  Copy,
  Shield,
  Volume2,
  Maximize,
  Pin,
  Hand,
  Clock,
  Info,
  Menu,
} from "lucide-react"

export default function MeetPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const participants = [
    { id: 1, name: "You", avatar: "YO", isMuted: isMuted, isVideoOff: isVideoOff, isHost: true },
    { id: 2, name: "Alice Johnson", avatar: "AJ", isMuted: false, isVideoOff: false, isHost: false },
    { id: 3, name: "Bob Smith", avatar: "BS", isMuted: true, isVideoOff: false, isHost: false },
    { id: 4, name: "Carol Davis", avatar: "CD", isMuted: false, isVideoOff: true, isHost: false },
    { id: 5, name: "David Wilson", avatar: "DW", isMuted: false, isVideoOff: false, isHost: false },
    { id: 6, name: "Emma Brown", avatar: "EB", isMuted: true, isVideoOff: false, isHost: false },
    { id: 7, name: "mm", avatar: "YO", isMuted: isMuted, isVideoOff: isVideoOff, isHost: true },
    { id: 8, name: "Almmice Johnson", avatar: "AJ", isMuted: false, isVideoOff: false, isHost: false },
    { id: 9, name: "Bommb Smith", avatar: "BS", isMuted: true, isVideoOff: false, isHost: false },
    { id: 10, name: "Cmmarol Davis", avatar: "CD", isMuted: false, isVideoOff: true, isHost: false },
    { id: 11, name: "Dmmmavid Wilson", avatar: "DW", isMuted: false, isVideoOff: false, isHost: false },
    { id: 12, name: "Emmmma Brown", avatar: "EB", isMuted: true, isVideoOff: false, isHost: false },
  ]

  const chatMessages = [
    { id: 1, sender: "Alice Johnson", message: "Hello everyone!", time: "10:30 AM" },
    { id: 2, sender: "Bob Smith", message: "Good morning! Ready for the presentation?", time: "10:31 AM" },
    { id: 3, sender: "You", message: "Yes, let's get started", time: "10:32 AM" },
    { id: 4, sender: "Carol Davis", message: "Can everyone see my screen?", time: "10:35 AM" },
  ]

  const SidebarContent = () => (
    <>
      <div className="flex border-b">
        <Button
          variant={showParticipants ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => {
            setShowParticipants(true)
            setShowChat(false)
          }}
        >
          <Users className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Participants</span> ({participants.length})
        </Button>
        <Button
          variant={showChat ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => {
            setShowChat(true)
            setShowParticipants(false)
          }}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Chat</span>
        </Button>
      </div>

      {showParticipants && (
        <Card className="rounded-none border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] lg:h-[calc(100vh-300px)]">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="text-sm">{participant.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{participant.name}</span>
                          {participant.isHost && (
                            <Badge variant="outline" className="text-xs">
                              Host
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isMuted ? (
                        <MicOff className="w-4 h-4 text-destructive" />
                      ) : (
                        <Mic className="w-4 h-4 text-green-600" />
                      )}
                      {participant.isVideoOff ? (
                        <VideoOff className="w-4 h-4 text-destructive" />
                      ) : (
                        <Video className="w-4 h-4 text-green-600" />
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Pin Video</DropdownMenuItem>
                          <DropdownMenuItem>Mute Participant</DropdownMenuItem>
                          {participant.isHost && (
                            <DropdownMenuItem className="text-destructive">Remove from Meeting</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {showChat && (
        <Card className="rounded-none border-0 h-[calc(100vh-120px)] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm bg-muted p-2 rounded">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setChatMessage("")
                  }
                }}
              />
              <Button size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium truncate text-sm sm:text-base">Team Standup Meeting</span>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            <Clock className="w-3 h-3 mr-1" />
            45:23
          </Badge>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Info className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="sm:hidden">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem className="sm:hidden">
                <Info className="w-4 h-4 mr-2" />
                Meeting Info
              </DropdownMenuItem>
              <DropdownMenuSeparator className="sm:hidden" />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="w-4 h-4 mr-2" />
                Security
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Report Issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row mb-[200px]">
        {/* Main Video Area */}
        <div className="flex-1 p-2 sm:p-4 mb-[80px]">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
            {/* Main Speaker */}
            <div className="lg:col-span-2 sticky top-[20px] z-10 lg: max-h-[450px]">
              <Card className="h-full">
                <CardContent className="p-0 h-full relative">
                  <div className="w-full h-full bg-muted flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                    <Avatar className="w-16 h-16 sm:w-24 sm:h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-xl sm:text-2xl">AJ</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                    <Badge className="text-xs sm:text-sm">Alice Johnson (Presenting)</Badge>
                    <div className="flex gap-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-background border rounded-full flex items-center justify-center">
                        <Mic className="w-2 h-2 sm:w-3 sm:h-3 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2">
                    <Button size="sm" variant="secondary" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                      <Pin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                      <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Participant Grid */}
            <div className="space-y-2 sm:space-y-4 order-1 lg:order-2">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4">
                {participants.map((participant) => (
                  <Card key={participant.id}>
                    <CardContent className="p-0 aspect-video relative">
                      {participant.isVideoOff ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Avatar className="w-8 h-8 sm:w-12 sm:h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback className="text-xs sm:text-sm">{participant.avatar}</AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Avatar className="w-8 h-8 sm:w-12 sm:h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback className="text-xs sm:text-sm">{participant.avatar}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {participant.name === "You" ? "You" : participant.name.split(" ")[0]}
                        </Badge>
                        {participant.isHost && (
                          <Badge variant="outline" className="text-xs hidden sm:flex">
                            Host
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2">
                        {participant.isMuted ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-destructive rounded-full flex items-center justify-center">
                            <MicOff className="w-2 h-2 sm:w-3 sm:h-3 text-destructive-foreground" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <Mic className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="right" className="w-full shadow-none sm:w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Control Bar */}
      <div className="p-2 sm:p-4 border-t bg-background fixed bottom-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm text-muted-foreground truncate">meeting-room-xyz</span>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="sm"
              className="h-8 w-8 sm:h-10 sm:w-10 p-0"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>

            <Button
              variant={isVideoOff ? "destructive" : "outline"}
              size="sm"
              className="h-8 w-8 sm:h-10 sm:w-10 p-0"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? (
                <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 sm:h-10 sm:w-10 p-0 hidden sm:flex"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              variant={isHandRaised ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 sm:h-10 sm:w-10 p-0 hidden sm:flex"
              onClick={() => setIsHandRaised(!isHandRaised)}
            >
              <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 sm:h-10 sm:w-10 p-0 sm:hidden">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsScreenSharing(!isScreenSharing)}>
                  <Monitor className="w-4 h-4 mr-2" />
                  {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsHandRaised(!isHandRaised)}>
                  <Hand className="w-4 h-4 mr-2" />
                  {isHandRaised ? "Lower Hand" : "Raise Hand"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 sm:h-8 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 sm:h-10 sm:w-10 p-0 hidden sm:flex">
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Speaker Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="destructive" size="sm" className="h-8 w-8 sm:h-10 sm:w-10 p-0">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}
