import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, Video, MapPin, FileText, Plus } from "lucide-react"
import { useCallback } from "react"
import { DialogTrigger } from "@/components/ui/dialog"
import { createMeeting } from "@/services/schedule"
import { toast } from "sonner"
import type { MeetingType } from "@/api/pb/schedule"
import { BadRequest, BadRequest_FieldViolation } from "nice-grpc-error-details"
import { TimePicker } from "./time_picker"
import PaginatedUsersSearchCard from "./paginated_users_search_card"
import { ErrorCard } from "./error_card"

const CreateMeetingDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [err, setError] = useState<string | null>(null)
    const [validationViolations, setValidationViolations] = useState<string[]>([])
    const [selectedParticipantsIDs, setSelectedParticipantsIDs] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const onOpenChange = useCallback((open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setSelectedParticipantsIDs([])
            setError(null)
            setValidationViolations([])
            setIsLoading(false)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const startDate = formData.get("startDate") as string
        const startTimeInput = formData.get("startTime") as string

        let startTime: Date
        const [year, month, day] = startDate.split("-").map(Number)
        const [hour, minute] = startTimeInput.split(":").map(Number)
        startTime = new Date(Date.UTC(year, month - 1, day, hour, minute))
        startTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000)

        const type : MeetingType = formData.get("type") as unknown as MeetingType
        const [response, error] = await createMeeting({
            title: title,
            description: description,
            startTime: startTime,
            participantsIDs: selectedParticipantsIDs,
            type: type
        })

        if (error) {
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
            setIsLoading(false)
            return
        }

        if (response) {
            toast.success("Meeting created successfully!")
            setIsOpen(false)
            setSelectedParticipantsIDs([])
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="whitespace-nowrap" disabled={isLoading}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Meeting
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <Video className="w-6 h-6 text-primary" />
                        Create New Meeting
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Schedule a new meeting and invite participants to collaborate.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Meeting Details Section */}
                    <Card>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="font-medium">Meeting Details</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-medium">
                                            Meeting Title *
                                        </Label>
                                        <Input id="title" name="title" placeholder="Enter a descriptive meeting title" className="h-11" required disabled={isLoading} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Add meeting agenda, objectives, or any relevant details..."
                                            className="min-h-[80px] resize-none"
                                            name="description"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule Section */}
                    <Card>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="font-medium">Schedule</h3>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <TimePicker 
                                        disabled={isLoading}
                                        dateName="startDate" 
                                        timeName="startTime"
                                        dateRequired={true}
                                        timeRequired={true}
                                    />
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            Meeting Type *
                                        </Label>
                                        <Select defaultValue="video" disabled={isLoading}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select meeting type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="video">
                                                    <div className="flex items-center gap-2">
                                                        <Video className="w-4 h-4" />
                                                        Video Conference
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="audio">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        Audio Only
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participants Section */}
                    <PaginatedUsersSearchCard
                        onParticipantsChange={(users) => {
                            const selectedParticipantsIDs = users.map((user) => user.id)
                            setSelectedParticipantsIDs(selectedParticipantsIDs)
                        }}
                        disabled={isLoading}
                    />

                    {/* Error Card */}
                    <ErrorCard err={err} validationViolations={validationViolations} setError={setError} />

                    <Separator />

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto" disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                            <Video className="w-4 h-4 mr-2" />
                            {isLoading ? "Creating..." : "Create Meeting"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMeetingDialog