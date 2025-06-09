'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import { Badge, CalendarDays, Clock, Loader2, Video } from 'lucide-react';
import { Meeting, SearchMeetingsRequest_MeetingCategory } from '@/api/pb/schedule';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { getMeetings } from '@/services/schedule'
import { toast } from 'sonner';

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function MeetingCard({ meeting } : { meeting : Meeting}) {
  const isPast = meeting.startTime!.getTime() < new Date().getTime();
  const isNow =
    new Date().getTime() === meeting.startTime!.getTime()
  

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{meeting.title}</h3>
            {isNow && <Badge className="bg-green-500">Now</Badge>}
          </div>
          <div className="flex items-center text-muted-foreground gap-4">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(meeting.startTime!)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(meeting.startTime!)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {meeting.firstThreeParticipants.map((participant, i) => (
                <Avatar key={i} className="rounded-full overflow-hidden border-2 border-background h-8 w-8">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={participant.avatarUrl || "/placeholder.svg"}
                    alt={participant.name}
                  />
                  <AvatarFallback className="rounded-full w-full h-full flex items-center justify-center bg-card">
                    {(participant.name.charAt(0) || participant.email.charAt(0)).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {meeting.participantsCount > meeting.firstThreeParticipants.length && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{meeting.participantsCount - meeting.firstThreeParticipants.length}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Hosted by <span className="font-medium">{meeting.host!.name}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-center">
          {isPast ? (
            <>
              <Button variant="outline" size="sm">
                View Recording
              </Button>
              <Button variant="outline" size="sm">
                Meeting Notes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm" className="gap-1">
                <Video className="h-4 w-4" />
                {isNow ? "Join Now" : "Join"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface MeetingsListProps {
    category?: SearchMeetingsRequest_MeetingCategory;
    searchQuery?: string;
}

const MeetingsList = (props : MeetingsListProps) => {
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);

  const next = async () => {
    setLoading(true);
    setTimeout(async () => {
      const pageSize = 3;
      try {
        const data = await getMeetings({
            query: props.searchQuery || "",
            category: props.category || SearchMeetingsRequest_MeetingCategory.ALL,
            lastID: meetings.length > 0 ? meetings[meetings.length - 1].id : 0,
            pageSize: pageSize,
        });
        setMeetings((prev) => [...prev, ...data]);
        if (data.length < pageSize) {
            setHasMore(false);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }, 800);
  };
  return (
    <div className="flex flex-col gap-4">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
        <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
          {hasMore && (
            <div className="flex justify-center">
              <Loader2 className="my-4 h-8 w-8 animate-spin" />
            </div>
          )}
        </InfiniteScroll>
    </div>
  );
};

export default MeetingsList;
