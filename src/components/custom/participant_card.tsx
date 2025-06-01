import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
} from "lucide-react"

type Participant = {
    id: number;
    name: string;
    avatar: string;
    isMuted: boolean;
    isVideoOff: boolean;
    isHost: boolean;
};

const ParticipantCard = ({participant} : {participant : Participant}) => {
    return (
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
    );
}
 
export default ParticipantCard;