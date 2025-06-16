import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Check } from "lucide-react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { generateGuestRoomJoinToken } from "@/services/room"
import { toast } from "sonner"

export default function ShareMeetJoinLinkButton({meetingId}: { meetingId: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [generatedLink, setGeneratedLink] = useState("")
    const [isCopied, setIsCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    const generateMeetingLink = async () => {
        const [token, error] = await generateGuestRoomJoinToken(meetingId || "")
        if (error) {
            toast.error("Failed to generate meeting link. Please try again." + error.message)
            return ""
        }

        if (!token) {
            toast.error("Failed to generate meeting link. Please try again.")
            return ""
        }

        const host = window.location.host
        const roomId = meetingId
        const roomToken = token

        const link = `${host}/meetings/${roomId}/meet?token=${roomToken}`

        return link
    }

    const handleGenerateLink = async () => {
        setIsGenerating(true)
        const newLink = await generateMeetingLink()
        if (!newLink) {
            setIsGenerating(false)
            return
        }
        setGeneratedLink(newLink)
        setIsDialogOpen(true)
        setIsGenerating(false)
        setIsCopied(false)
    }

    const handleCopyLink = async () => {
        try {
        await navigator.clipboard.writeText(generatedLink)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
        } catch (error) {
            console.error("Failed to copy link:", error)
        }
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setIsCopied(false)
    }

    return (
        <>
            <Button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="flex items-center gap-2"
            >
                <Share2 className="h-5 w-5" />
                {isGenerating ? "Generating..." : "Share Meeting Link"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogTrigger>
                    <span className="hidden">Open Share Link Dialog</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Meeting Link Generated
                        </DialogTitle>
                        <DialogDescription>
                            Share this link with participants to join the meeting. The link is secure and unique.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="meeting-link">Meeting Link</Label>
                            <div className="flex gap-2 mt-3">
                                <Input id="meeting-link" value={generatedLink} readOnly className="flex-1" />
                                <Button
                                    onClick={handleCopyLink}
                                    variant="outline"
                                    size="icon"
                                    className={isCopied ? "text-green-600 border-green-600" : ""}
                                >
                                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            {isCopied && (
                                <p className="text-sm text-green-600 flex items-center gap-1">
                                    <Check className="h-3 w-3" />
                                    Link copied to clipboard!
                                </p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
