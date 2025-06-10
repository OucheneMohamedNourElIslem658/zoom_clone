import { MeetingType, type Meeting } from "@/api/pb/schedule"
import { Card, CardContent } from "../ui/card"
import { Calendar, FileText, MapPin, Users, Video } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"

export const MeetingDetailsSection = ({
    meeting,
    handleInputChange,
}: {
    meeting: Meeting | null
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
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
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter a descriptive meeting title"
                            className="h-11"
                            required
                            value={meeting?.title || ""}
                            onChange={handleInputChange}
                        />
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
                            value={meeting?.description || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
)

export const MeetingScheduleSection = ({
    meeting,
    handleTypeChange,
}: {
    meeting: Meeting | null
    handleTypeChange: (value: string) => void
}) => (
    <Card>
        <CardContent>
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium">Schedule</h3>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Meeting Type *
                        </Label>
                        <Select value={meeting?.type === MeetingType.VIDEO ? "video" : "audio"} onValueChange={handleTypeChange}>
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
)