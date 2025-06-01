"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Video, Mic, MicOff, VideoOff, Users, Info } from "lucide-react"

export default function RoomPreparationPage() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isCameraOn, setIsCameraOn] = useState(true)
    const [isMicOn, setIsMicOn] = useState(true)
    const [displayName, setDisplayName] = useState("")
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [devices, setDevices] = useState<{
        videoDevices: MediaDeviceInfo[]
        audioDevices: MediaDeviceInfo[]
    }>({
        videoDevices: [],
        audioDevices: [],
    })
    const [selectedDevices, setSelectedDevices] = useState({
        videoDeviceId: "",
        audioDeviceId: "",
    })
    const [permissionError, setPermissionError] = useState<string | null>(null)

    // Initialize media devices
    useEffect(() => {
        const initializeDevices = async () => {
            try {
                // Request permissions for both audio and video
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                })

                setStream(mediaStream)

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream
                }

                // Get available devices
                const devices = await navigator.mediaDevices.enumerateDevices()

                const videoDevices = devices.filter((device) => device.kind === "videoinput")
                const audioDevices = devices.filter((device) => device.kind === "audioinput")

                setDevices({ videoDevices, audioDevices })

                // Set default selected devices
                if (videoDevices.length > 0) {
                    setSelectedDevices((prev) => ({ ...prev, videoDeviceId: videoDevices[0].deviceId }))
                }

                if (audioDevices.length > 0) {
                    setSelectedDevices((prev) => ({ ...prev, audioDeviceId: audioDevices[0].deviceId }))
                }

                setPermissionError(null)
            } catch (error) {
                console.error("Error accessing media devices:", error)
                setPermissionError("Unable to access camera or microphone. Please check permissions.")
                setIsCameraOn(false)
                setIsMicOn(false)
            }
        }

        initializeDevices()

        // Cleanup function
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    // Handle device change
    const handleDeviceChange = async (type: "video" | "audio", deviceId: string) => {
        if (!stream) return

        try {
            // Stop current tracks of the specified type
            stream.getTracks().forEach((track) => {
                if ((type === "video" && track.kind === "video") || (type === "audio" && track.kind === "audio")) {
                    track.stop()
                }
            })

            // Create constraints based on type
            const constraints: MediaStreamConstraints =
                type === "video" ? { video: { deviceId: { exact: deviceId } } } : { audio: { deviceId: { exact: deviceId } } }

            // Get new stream with selected device
            const newStream = await navigator.mediaDevices.getUserMedia(constraints)

            // Replace tracks in the current stream
            newStream.getTracks().forEach((track) => {
                stream.addTrack(track)
                stream.getTracks().forEach((oldTrack) => {
                    if (oldTrack.kind === track.kind && oldTrack.id !== track.id) {
                        stream.removeTrack(oldTrack)
                    }
                })
            })

            // Update selected device
            setSelectedDevices((prev) => ({
                ...prev,
                [type === "video" ? "videoDeviceId" : "audioDeviceId"]: deviceId,
            }))

            // Update video element if it's a video device change
            if (type === "video" && videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (error) {
            console.error(`Error changing ${type} device:`, error)
        }
    }

    // Toggle camera
    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach((track) => {
                track.enabled = !isCameraOn
            })
            setIsCameraOn(!isCameraOn)
        }
    }

    // Toggle microphone
    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach((track) => {
                track.enabled = !isMicOn
            })
            setIsMicOn(!isMicOn)
        }
    }

    // Join meeting
    const joinMeeting = () => {
        // Here you would implement the logic to join the meeting
        console.log("Joining meeting with settings:", {
            name: displayName,
            camera: isCameraOn,
            microphone: isMicOn,
            videoDevice: selectedDevices.videoDeviceId,
            audioDevice: selectedDevices.audioDeviceId,
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold mb-2">Ready to join?</h1>
                    <p>Check your audio and video before entering the meeting</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Preview */}
                    <Card className="lg:col-span-2 overflow-hidden self-start">
                        <CardContent className="p-0 relative">
                            <div className="aspect-video flex items-center justify-center">
                                {isCameraOn ? (
                                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <VideoOff size={48} />
                                        <p className="mt-2">Camera is off</p>
                                    </div>
                                )}
                            </div>

                            {permissionError && (
                                <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
                                    <Info size={32} className="mb-2" />
                                    <p className="text-center">{permissionError}</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry Permissions
                                    </Button>
                                </div>
                            )}

                            {/* Camera Controls */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant={isMicOn ? "default" : "destructive"}
                                                className="rounded-full w-12 h-12 shadow-lg"
                                                onClick={toggleMic}
                                            >
                                                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isMicOn ? "Turn off microphone" : "Turn on microphone"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant={isCameraOn ? "default" : "destructive"}
                                                className="rounded-full w-12 h-12 shadow-lg"
                                                onClick={toggleCamera}
                                            >
                                                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isCameraOn ? "Turn off camera" : "Turn on camera"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Panel */}
                    <Card className="lg:col-span-1 p-4">
                        <CardContent className="p-2 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="display-name">Your Name</Label>
                                <Input
                                    id="display-name"
                                    placeholder="Enter your name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="camera-select">Camera</Label>
                                <Select
                                    value={selectedDevices.videoDeviceId}
                                    onValueChange={(value) => handleDeviceChange("video", value)}
                                    disabled={devices.videoDevices.length === 0}
                                >
                                    <SelectTrigger id="camera-select">
                                        <SelectValue placeholder="Select camera" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {devices.videoDevices.map((device) => (
                                            <SelectItem key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Camera ${devices.videoDevices.indexOf(device) + 1}`}
                                            </SelectItem>
                                        ))}
                                        {devices.videoDevices.length === 0 && (
                                            <SelectItem value="none" disabled>
                                                No cameras available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 w-full">
                                <Label htmlFor="mic-select">Microphone</Label>
                                <Select
                                    value={selectedDevices.audioDeviceId}
                                    onValueChange={(value) => handleDeviceChange("audio", value)}
                                    disabled={devices.audioDevices.length === 0}
                                >
                                    <SelectTrigger id="mic-select" className="w-full">
                                        <SelectValue placeholder="Select microphone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {devices.audioDevices.map((device) => (
                                            <SelectItem key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Microphone ${devices.audioDevices.indexOf(device) + 1}`}
                                            </SelectItem>
                                        ))}
                                        {devices.audioDevices.length === 0 && (
                                            <SelectItem value="none" disabled>
                                                No microphones available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="noise-cancellation">Noise Cancellation</Label>
                                    <p className="text-sm">Reduce background noise</p>
                                </div>
                                <Switch id="noise-cancellation" />
                            </div>

                            <Button className="w-full mt-4" size="lg" onClick={joinMeeting} disabled={!displayName.trim()}>
                                <Users className="mr-2 h-4 w-4" /> Join Meeting
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
