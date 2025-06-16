import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Video } from "lucide-react"
import { useCallback } from "react"
import { DialogTrigger } from "@/components/ui/dialog"
import { Meeting, MeetingType } from "@/api/pb/schedule"
import PaginatedUsersSearchCard from "./paginated_users_search_card"
import { useEffect, useRef } from "react"
import { getMeeting, updateMeeting } from "@/services/schedule"
import { Loader2 } from "lucide-react"
import { ErrorCard } from "./error_card"
import { MeetingDetailsSection, MeetingScheduleSection } from "./update_meeting_parts"
import { BadRequest, BadRequest_FieldViolation } from "nice-grpc-error-details"

const Loader = () => (
    <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
)

const UpdateMeetingDialog = ({
    meetingID,
    onUpdate,
}: {
    meetingID: number
    onUpdate?: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [err, setError] = useState<string | null>(null)
    const [validationViolations, setValidationViolations] = useState<string[]>([])
    const [selectedParticipantsIDs, setSelectedParticipantsIDs] = useState<string[]>([])
    const [meeting, setMeeting] = useState<Meeting | null>(null)
    const [loading, setLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const initialMeetingRef = useRef<Meeting | null>(null)

    // Fetch meeting data
    useEffect(() => {
        if (!isOpen) return
        setLoading(true)
        ;(async () => {
            try {
                const data = await getMeeting({ id: meetingID })
                setMeeting(data)
                setSelectedParticipantsIDs(data.firstThreeParticipants?.map((u: any) => u.id) || [])
                initialMeetingRef.current = { ...data }
                setError(null)
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to fetch meeting data")
            } finally {
                setLoading(false)
            }
        })()
    }, [isOpen, meetingID])

    const onOpenChange = useCallback((open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setSelectedParticipantsIDs([])
            setError(null)
            setValidationViolations([])
            setMeeting(null)
            setLoading(false)
        }
    }, [])

    // Detect if form changed
    const isFormChanged = (() => {
        if (!initialMeetingRef.current || !meeting) return false

        return (
            meeting.title !== initialMeetingRef.current.title ||
            meeting.description !== initialMeetingRef.current.description ||
            meeting.type !== initialMeetingRef.current.type ||
            JSON.stringify(selectedParticipantsIDs.sort()) !==
                JSON.stringify((initialMeetingRef.current.firstThreeParticipants?.map((u: any) => u.id) || []).sort())
        )
    })()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setMeeting((prev) => (prev ? { ...prev, [name]: value } : prev))
    }

    const handleTypeChange = (value: string) => {
        const newValue = value === "video" ? MeetingType.VIDEO : MeetingType.AUDIO
        setMeeting((prev) => (prev ? { ...prev, type: newValue } : prev))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!meeting) return

        const dateStr = meeting.startTime ? new Date(meeting.startTime).toISOString().slice(0, 10) : ""
        const timeStr = meeting.startTime ? new Date(meeting.startTime).toISOString().slice(11, 16) : ""
        const [year, month, day] = dateStr.split("-").map(Number)
        const [hour, minute] = timeStr.split(":").map(Number)
        let startTimeDate = new Date(Date.UTC(year, month - 1, day, hour, minute))
        startTimeDate = new Date(startTimeDate.getTime() + 24 * 60 * 60 * 1000)

        setIsUpdating(true)
        const [response, error] = await updateMeeting({
            id: meetingID,
            newTitle: meeting.title,
            newDescription: meeting.description,
            newParticipantsIDs: selectedParticipantsIDs,
            newType: meeting.type as MeetingType,
            setIsparticipantidsempty: selectedParticipantsIDs.length === 0,
        })

        if (error && error.extra) {
            const violations: string[] = []
            for (const violation of error.extra) {
                if (violation.$type === BadRequest.$type) {
                    const fieldViolations = (violation as BadRequest).fieldViolations || []
                    for (const fieldViolation of fieldViolations) {
                        if (fieldViolation.$type === BadRequest_FieldViolation.$type) {
                            violations.push(`${fieldViolation.field}: ${fieldViolation.description}`)
                        }
                    }
                }
                setValidationViolations(violations)
            }
            setError(error.details)
            return
        } else if (error) {
            setError(error.message || "An error occurred while updating the meeting")
            return
        }

        if (response) {
            setIsOpen(false)
            setSelectedParticipantsIDs([])
            if (onUpdate) onUpdate()
        }

        setIsUpdating(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="whitespace-nowrap" size={"sm"}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <Video className="w-6 h-6 text-primary" />
                        Update Current Meeting
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Update your current meeting and invite participants to collaborate.
                    </DialogDescription>
                </DialogHeader>
                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <MeetingDetailsSection 
                            meeting={meeting} 
                            handleInputChange={handleInputChange} 
                            disabled={isUpdating}
                        />
                        <MeetingScheduleSection 
                            meeting={meeting} 
                            handleTypeChange={handleTypeChange} 
                            disabled={isUpdating}
                        />
                        <PaginatedUsersSearchCard
                            defaultSelectedUsers={meeting?.firstThreeParticipants || []}
                            onParticipantsChange={(users) => {
                                const selectedIDs = users.map((user) => user.id)
                                setSelectedParticipantsIDs(selectedIDs)
                            }}
                            disabled={isUpdating}
                        />
                        <ErrorCard err={err} validationViolations={validationViolations} setError={setError} />
                        <Separator />
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto" disabled={isUpdating}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto" disabled={!isFormChanged || isUpdating}>
                                <Video className="w-4 h-4 mr-2" />
                                Update Meeting
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default UpdateMeetingDialog