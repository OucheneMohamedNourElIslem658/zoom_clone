import { useState } from "react"
import RoomBottomControlBar from "@/components/custom/room_bottom_control_bar"
import MainSpeakerCard from "@/components/custom/main_speaker_card"
import ParticipantCard from "@/components/custom/participant_card"
import MeetTopBar from "@/components/custom/meet_top_bar"
import MeetingSidebar from "@/components/custom/meet_side_bar"

export default function MeetPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const participants = [
    { id: 1, name: "You", avatar: "YO", isMuted: isMuted, isVideoOff: isVideoOff, isHost: true },
    { id: 2, name: "Alice Johnson", avatar: "AJ", isMuted: false, isVideoOff: false, isHost: false },
    { id: 3, name: "Bob Smith", avatar: "BS", isMuted: true, isVideoOff: false, isHost: false },
    { id: 4, name: "Carol Davis", avatar: "CD", isMuted: false, isVideoOff: true, isHost: false },
    { id: 5, name: "David Wilson", avatar: "DW", isMuted: false, isVideoOff: false, isHost: false },
    { id: 6, name: "Emma Brown", avatar: "EB", isMuted: true, isVideoOff: false, isHost: false },
  ]

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <MeetTopBar/>

      <div className="flex-1 flex flex-col lg:flex-row mb-[200px]">
        {/* Main Video Area */}
        <div className="flex-1 p-2 sm:p-4 mb-[80px]">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
            {/* Main Speaker */}
            <div className="lg:col-span-2 sticky top-[20px] z-10 lg: max-h-[450px]">
              <MainSpeakerCard participant={participants[0]}/>
            </div>

            {/* Participant Grid */}
            <div className="space-y-2 sm:space-y-4 order-1 lg:order-2">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4">
                {participants.map((participant) => (
                  <ParticipantCard participant={participant}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
          <MeetingSidebar
            participants={participants}
            isSidebarOpen={isMobileSidebarOpen}
            onSidebarOpenChange={setIsMobileSidebarOpen}
          />
      </div>

      {/* Bottom Control Bar */}
      <RoomBottomControlBar
        initialSettings={{
          isMuted,
          isVideoOff,
          isScreenSharing,
          isHandRaised,
          isMobileSidebarOpen,
        }}
        onIsMutedChanged={setIsMuted}
        onIsVideoOffChanged={setIsVideoOff}
        onIsScreenSharingChanged={setIsScreenSharing}
        onIsHandRaisedChanged={setIsHandRaised}
        onIsMobileSidebarOpenChanged={setIsMobileSidebarOpen}
      />
    </div>
  )
}
