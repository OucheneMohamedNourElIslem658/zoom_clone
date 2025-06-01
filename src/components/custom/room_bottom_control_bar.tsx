import { useState } from "react";
import { Copy, Hand, Maximize, Menu, Mic, MicOff, Monitor, MoreVertical, Phone, Settings, Video, VideoOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Settings = {
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
    isHandRaised: boolean;
    isMobileSidebarOpen: boolean;
};

const RoomBottomControlBar = ({
    initialSettings,
    onIsMutedChanged,
    onIsVideoOffChanged,
    onIsScreenSharingChanged,
    onIsHandRaisedChanged,
    onIsMobileSidebarOpenChanged,
}: {
    initialSettings: Settings;
    onIsMutedChanged?: (isMuted: boolean) => void;
    onIsVideoOffChanged?: (isVideoOff: boolean) => void;
    onIsScreenSharingChanged?: (isScreenSharing: boolean) => void;
    onIsHandRaisedChanged?: (isHandRaised: boolean) => void;
    onIsMobileSidebarOpenChanged?: (isMobileSidebarOpen: boolean) => void;
}) => {
    const [isMuted, setIsMuted] = useState(initialSettings.isMuted);
    const [isVideoOff, setIsVideoOff] = useState(initialSettings.isVideoOff);
    const [isScreenSharing, setIsScreenSharing] = useState(initialSettings.isScreenSharing);
    const [isHandRaised, setIsHandRaised] = useState(initialSettings.isHandRaised);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(initialSettings.isMobileSidebarOpen);

    const handleMuteClick = () => {
        setIsMuted((prev) => {
            const newValue = !prev;
            onIsMutedChanged?.(newValue);
            return newValue;
        });
    };

    const handleVideoClick = () => {
        setIsVideoOff((prev) => {
            const newValue = !prev;
            onIsVideoOffChanged?.(newValue);
            return newValue;
        });
    };

    const handleScreenSharingClick = () => {
        setIsScreenSharing((prev) => {
            const newValue = !prev;
            onIsScreenSharingChanged?.(newValue);
            return newValue;
        });
    };

    const handleHandRaisedClick = () => {
        setIsHandRaised((prev) => {
            const newValue = !prev;
            onIsHandRaisedChanged?.(newValue);
            return newValue;
        });
    };

    const handleMobileSidebarOpenChange = (open: boolean) => {
        setIsMobileSidebarOpen(open);
        onIsMobileSidebarOpenChanged?.(open);
    };

    return (
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
                        onClick={handleMuteClick}
                    >
                        {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </Button>

                    <Button
                        variant={isVideoOff ? "destructive" : "outline"}
                        size="sm"
                        className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                        onClick={handleVideoClick}
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
                        onClick={handleScreenSharingClick}
                    >
                        <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                        variant={isHandRaised ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 sm:h-10 sm:w-10 p-0 hidden sm:flex"
                        onClick={handleHandRaisedClick}
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
                            <DropdownMenuItem onClick={handleScreenSharingClick}>
                                <Monitor className="w-4 h-4 mr-2" />
                                {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleHandRaisedClick}>
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
                            <DropdownMenuItem>
                                <Maximize className="w-4 h-4 mr-2" />
                                Full Screen Mode
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
                    <Sheet open={isMobileSidebarOpen} onOpenChange={handleMobileSidebarOpenChange}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Menu className="w-4 h-4" />
                            </Button>
                        </SheetTrigger>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};
 
export default RoomBottomControlBar;