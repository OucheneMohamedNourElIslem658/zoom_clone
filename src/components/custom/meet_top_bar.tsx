import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Clock,
} from "lucide-react"

const MeetTopBar = () => {
    return (
        <div className="flex items-center justify-between p-2 sm:p-4 border-b">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium truncate text-sm sm:text-base">Team Standup Meeting</span>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
                <Clock className="w-3 h-3 mr-1" />
                45:23
            </Badge>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                </Button>
            </div>
        </div>
    );
}
 
export default MeetTopBar;