import { useState } from "react"
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useParams } from "react-router-dom"
import { CustomVideoConference } from "@/components/custom/video_confirence";

export default function MeetPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const params = useParams<{id : string}>()
  const meetingID = Number(params.id)

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const cameraOn = searchParams.get("camera") === "true";
  const audiOn = searchParams.get("audio") === "true";
  const videoDeviceID = searchParams.get("videoDeviceID");
  const audioDeviceID = searchParams.get("audioDeviceID");

  return (
    <div style={{ height: '100vh' }}>
      <LiveKitRoom
        token={token || ""}
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        connect
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <CustomVideoConference/>
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  )
}