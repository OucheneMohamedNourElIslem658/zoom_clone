import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Circle, Square } from "lucide-react"
import { toast } from "sonner"

interface RecordingSwitcherProps {
    onToggle?: (isRecording: boolean) => Promise<void> | void
}

export function RecordingSwitcher({ onToggle }: RecordingSwitcherProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const toggleRecording = async () => {
        setDisabled(true)
        try {
            if (onToggle) {
                try {
                    await onToggle(!isRecording)
                } catch (error) {
                    toast.error("Failed to toggle recording: " + error)
                }
            }
            setIsRecording(!isRecording)
        } finally {
            setDisabled(false)
        }
    }

    return (
        <Button
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            className="gap-2 static h-full border-none md:absolute md:right-3 md:h-auto"
            disabled={disabled}
        >
            {isRecording ? (
                <>
                    <Square className="h-4 w-4" />
                    <span className="hidden md:inline">Stop Recording</span>
                </>
            ) : (
                <>
                    <Circle className="h-4 w-4" />
                    <span className="hidden md:inline">Start Recording</span>
                </>
            )}
        </Button>
    )
}
