import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import CreateMeetingDialog from "@/components/custom/create_meeting_dialog"
import MeetingsList from "@/components/custom/meetings_list"
import { SearchMeetingsRequest_MeetingCategory } from "@/api/pb/schedule"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground mt-1">Manage your upcoming and past meetings</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const query = formData.get("search") as string
                  setSearchQuery(query.trim())
                }}
              >
                <Input
                  type="search"
                  name="search"
                  placeholder="Search meetings..."
                  className="pl-8 w-full"
                />
                <div className="w-0 h-0 overflow-hidden">
                  <input
                    type="submit"
                  />
                </div>
              </form>
            </div>
            <CreateMeetingDialog/>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 sticky top-3 z-10">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All Meetings</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              <MeetingsList
                searchQuery={searchQuery}
                category={SearchMeetingsRequest_MeetingCategory.UPCOMING}
              />
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <MeetingsList
                searchQuery={searchQuery}
                category={SearchMeetingsRequest_MeetingCategory.PASSED}
              />
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <MeetingsList
                searchQuery={searchQuery}
                category={SearchMeetingsRequest_MeetingCategory.ALL}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// function EmptyState({ type }: { type: string }) {
//   let message = ""
//   let description = ""

//   switch (type) {
//     case "upcoming":
//       message = "No upcoming meetings"
//       description = "You don't have any scheduled meetings coming up."
//       break
//     case "past":
//       message = "No past meetings"
//       description = "You don't have any past meetings to display."
//       break
//     default:
//       message = "No meetings found"
//       description = "Try adjusting your search or filters."
//   }

//   return (
//     <div className="flex flex-col items-center justify-center py-12 text-center">
//       <div className="rounded-full bg-muted p-4 mb-4">
//         <CalendarDays className="h-8 w-8 text-muted-foreground" />
//       </div>
//       <h3 className="text-lg font-medium mb-1">{message}</h3>
//       <p className="text-muted-foreground mb-4">{description}</p>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Meeting
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[525px]">
//           <DialogHeader>
//             <DialogTitle>Create New Meeting</DialogTitle>
//             <DialogDescription>Fill in the details below to schedule a new meeting.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="title">Meeting Title</Label>
//               <Input id="title" placeholder="Enter meeting title" />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline">Cancel</Button>
//             <Button>Create Meeting</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }