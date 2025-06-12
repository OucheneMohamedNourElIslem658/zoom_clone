import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
} from "lucide-react"
import { TrackLoop, TrackRefContext, useTracks, VideoTrack, type TrackReference } from "@livekit/components-react"
import { Track } from "livekit-client"

const ParticipantsList = () => {
    const tracks = useTracks([Track.Source.Camera])

    console.log(tracks);
    

    return (
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4">
            <TrackLoop tracks={tracks}>
                <TrackRefContext.Consumer>
                    {(trackRef) => (
                        trackRef && trackRef.publication && (
                            <ParticipantCard trackRef={trackRef as TrackReference}/>
                        )
                    )}
                </TrackRefContext.Consumer>
            </TrackLoop>
        </div>
    );
}

const ParticipantCard = ({ trackRef } : { trackRef : TrackReference}) => {
    const participant = trackRef.participant;
    const metadata = JSON.parse(participant.metadata || "{}");
    const name = metadata.name || participant.identity;
    const imageURL = metadata.avatar as string; 
    const imageFallback = name ? name.charAt(0).toUpperCase() : "U";
    const isAdmin = metadata.isAdmin || false;

    console.log("ParticipantCard", { trackRef, participant, metadata, name, imageURL, imageFallback, isAdmin });
    


    return (
        <Card>
            <CardContent className="p-0 aspect-video relative">
                <VideoTrack trackRef={trackRef} />
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Avatar className="w-8 h-8 sm:w-12 sm:h-12">
                    <AvatarImage src={imageURL} />
                    <AvatarFallback className="text-xs sm:text-sm">{imageFallback}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                        {name}
                    </Badge>
                    {isAdmin && (
                        <Badge variant="outline" className="text-xs hidden sm:flex">
                        Host
                        </Badge>
                    )}
                </div>
                <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2">
                {participant.audioLevel == 0 ? (
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
    );
}
 
export default ParticipantsList;