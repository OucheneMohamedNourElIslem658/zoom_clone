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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, Video, MapPin, FileText, Plus, X } from "lucide-react"
import { useCallback } from "react"
import { DialogTrigger } from "@/components/ui/dialog"

const CreateMeetingDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [participants, setParticipants] = useState<string[]>([])
    const [newParticipant, setNewParticipant] = useState("")

    const onOpenChange = useCallback((open: boolean) => setIsOpen(open), [])

    const addParticipant = () => {
        if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
            setParticipants([...participants, newParticipant.trim()])
            setNewParticipant("")
        }
    }

    const removeParticipant = (participant: string) => {
        setParticipants(participants.filter((p) => p !== participant))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
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
                                        <Input id="title" placeholder="Enter a descriptive meeting title" className="h-11" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Add meeting agenda, objectives, or any relevant details..."
                                            className="min-h-[80px] resize-none"
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

                                <div className="grid grid-cols-2 md: gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2 white">
                                            <Calendar className="w-3 h-3 white" />
                                            Date *
                                        </Label>
                                        <Input type="date" className="h-11" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            Start Time *
                                        </Label>
                                        <Select defaultValue="09:00">
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select start time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 17 }, (_, i) => {
                                                    const hour = Math.floor(i / 2) + 9
                                                    const minute = i % 2 === 0 ? "00" : "30"
                                                    const time24 = `${hour.toString().padStart(2, "0")}:${minute}`
                                                    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
                                                    const ampm = hour >= 12 ? "PM" : "AM"
                                                    const time12 = `${hour12}:${minute} ${ampm}`

                                                    return (
                                                        <SelectItem key={time24} value={time24}>
                                                            {time12}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            Meeting Type *
                                        </Label>
                                        <Select defaultValue="video">
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
                                                <SelectItem value="in-person">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        In Person
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
                    <Card>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="font-medium">Participants</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter email address or name"
                                            value={newParticipant}
                                            onChange={(e) => setNewParticipant(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addParticipant()
                                                }
                                            }}
                                            className="flex-1 h-11"
                                        />
                                        <Button type="button" onClick={addParticipant} size="sm" className="h-11 px-4">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {participants.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Invited Participants ({participants.length})</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {participants.map((participant, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                                        {participant}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                            onClick={() => removeParticipant(participant)}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">
                            <Video className="w-4 h-4 mr-2" />
                            Create Meeting
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMeetingDialog