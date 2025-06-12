import {
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { CustomVideoConference } from "@/components/custom/video_confirence";

export default function MeetPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const cameraOn = searchParams.get("camera") === "true";
  const audiOn = searchParams.get("audio") === "true";
  const videoDeviceID = searchParams.get("videoDeviceId");
  const audioDeviceID = searchParams.get("audioDeviceId");

  return (
    <div style={{ height: '100vh' }}>
      <LiveKitRoom
        token={token || ""}
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        connect
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <CustomVideoConference
          initialState={{
            isAudioOn: audiOn,
            isCameraOn: cameraOn,
            cameraDeviceId: videoDeviceID || undefined,
            audioDeviceId: audioDeviceID || undefined
          }}
        />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  )
}