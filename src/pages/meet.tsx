import { useEffect, useState } from "react"
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useParams } from "react-router-dom"
import { Room, RoomEvent, VideoPresets, RemoteTrack, RemoteTrackPublication, RemoteParticipant, LocalTrackPublication, LocalParticipant, Participant } from "livekit-client"

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

  const params = useParams<{id : string}>()
  const meetingID = Number(params.id)

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const cameraOn = searchParams.get("camera") === "true";
  const audiOn = searchParams.get("audio") === "true";
  const videoDeviceID = searchParams.get("videoDeviceID");
  const audioDeviceID = searchParams.get("audioDeviceID");

  // const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);
  // const [remoteTracks, setRemoteTracks] = useState<{ trackPublication: RemoteTrackPublication, participantIdentity: string }[]>([]);

  // async function joinRoom() {
  //   const room = new Room({
  //     adaptiveStream: true,
  //     dynacast: true,
  //     videoCaptureDefaults: {
  //       resolution: VideoPresets.h720.resolution,
  //     },
  //   }); 

  //   room
  //     .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
  //     .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
  //     // .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
  //     // .on(RoomEvent.Disconnected, handleDisconnect)
  //     .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

  //   const localParticipant = room.localParticipant;
  //   localParticipant.setCameraEnabled(cameraOn);
  //   localParticipant.setMicrophoneEnabled(audiOn);
    
  //   const url = import.meta.env.VITE_LIVEKIT_URL;

  //   try {
  //     await room.prepareConnection(
  //       url,
  //       token || "",
  //     )

  //     await room.connect(
  //       url,
  //       token || "",
  //     )

  //     setLocalParticipant(localParticipant);

  //     console.log("Connected to room:", room.name);
  //   } catch (error) {
  //     console.error("Failed to connect to room:", error);
  //     return;
  //   }
  // }

  // // Listeners for room events
  // function handleTrackSubscribed(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) {
  //   setRemoteTracks((prev) => [
  //       ...prev,
  //       { trackPublication: publication, participantIdentity: participant.identity }
  //   ]);
  // }

  // function handleTrackUnsubscribed(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) {
  //   setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
  // }

  // function handleLocalTrackUnpublished(publication: LocalTrackPublication, participant: LocalParticipant) {
  //   if (publication.track) {
  //     publication.track.detach()
  //   }
  // }

  // useEffect(() => {
  //   joinRoom();
  // }, []);

  return (
    <div style={{ height: '100vh' }}>
      <LiveKitRoom
        token={token || ""}
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        connect
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <VideoConference />
        <RoomAudioRenderer />
        {/* <ControlBar />*/}
      </LiveKitRoom>
    </div>
    // <div className="h-screen bg-background flex flex-col">
    //   {/* Top Bar */}
    //   <MeetTopBar/>

    //   <div className="flex-1 flex flex-col lg:flex-row mb-[200px]">
    //     {/* Main Video Area */}
    //     <div className="flex-1 p-2 sm:p-4 mb-[80px]">
    //       <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
    //         {/* Main Speaker */}
    //         <div className="lg:col-span-2 sticky top-[20px] z-10 lg: max-h-[450px]">
    //           {localParticipant && <MainSpeakerCard participant={localParticipant}/>}
    //         </div>

    //         {/* Participant Grid */}
    //         <div className="space-y-2 sm:space-y-4 order-1 lg:order-2">
    //           <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4">
    //             {participants.map((participant) => (
    //               <ParticipantCard key={participant.id} participant={participant}/>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Mobile Sidebar */}
    //       <MeetingSidebar
    //         participants={participants}
    //         isSidebarOpen={isMobileSidebarOpen}
    //         onSidebarOpenChange={setIsMobileSidebarOpen}
    //       />
    //   </div>

    //   {/* Bottom Control Bar */}
    //   <RoomBottomControlBar
    //     initialSettings={{
    //       isMuted,
    //       isVideoOff,
    //       isScreenSharing,
    //       isHandRaised,
    //       isMobileSidebarOpen,
    //     }}
    //     onIsMutedChanged={setIsMuted}
    //     onIsVideoOffChanged={setIsVideoOff}
    //     onIsScreenSharingChanged={setIsScreenSharing}
    //     onIsHandRaisedChanged={setIsHandRaised}
    //     onIsMobileSidebarOpenChanged={setIsMobileSidebarOpen}
    //   />
    // </div>
  )
}
