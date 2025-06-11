import type { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { useEffect, useRef } from "react";

interface VideoComponentProps {
    track: LocalVideoTrack | RemoteVideoTrack; 
    local?: boolean; 
}

export function VideoComponent({ track, local = false }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null); 

    useEffect(() => {
        if (videoElement.current) {
            track.attach(videoElement.current); 
        }

        return () => {
            track.detach(); 
        };
    }, [track]);

    return (
        <video ref={videoElement} id={track.sid}></video>
    );
}