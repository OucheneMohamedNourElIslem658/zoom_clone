import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Maximize,
  Pin,
} from "lucide-react"
import { LocalParticipant, LocalVideoTrack, RemoteVideoTrack, type LocalTrack, type RemoteParticipant, type Track } from "livekit-client"
import { VideoComponent } from "./video_component"

type Participant = {
    id: number;
    name: string;
    avatar: string;
    isMuted: boolean;
    isVideoOff: boolean;
    track: RemoteVideoTrack | LocalVideoTrack
};

const MainSpeakerCard = ({participant} : {participant : LocalParticipant | RemoteParticipant}) => {
    const rawTrack = participant instanceof LocalParticipant
        ? participant.videoTrackPublications.values().next().value?.track
        : participant.videoTrackPublications.values().next().value?.videoTrack;
    const track = rawTrack && (rawTrack.kind === "video") && (rawTrack instanceof LocalVideoTrack || rawTrack instanceof RemoteVideoTrack)
        ? rawTrack
        : undefined;
    const name = participant.name || participant.identity || "Unknown";
    const isMuted = track?.isMuted || false;
    const isVideoOff = !track || track.isMuted;


    return (
        <Card className="h-full">
            <CardContent className="p-0 h-full relative">
                <div className="w-full h-full bg-muted flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                    {track  && (
                        <VideoComponent track={track} local={true} />
                    )}
                {/* <Avatar className="w-16 h-16 sm:w-24 sm:h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-xl sm:text-2xl">{participant.avatar}</AvatarFallback>
                </Avatar> */}
                </div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                    <Badge className="text-xs sm:text-sm">{participant.name} (Presenting)</Badge>
                    {(!isMuted) && <div className="flex gap-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-background border rounded-full flex items-center justify-center">
                            <Mic className="w-2 h-2 sm:w-3 sm:h-3 text-green-600" />
                        </div>
                    </div>}
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
    );
}
 
export default MainSpeakerCard;