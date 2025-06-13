'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import { Badge, CalendarDays, Clock, Loader2, Video } from 'lucide-react';
import { Meeting, SearchMeetingsRequest_MeetingCategory } from '@/api/pb/schedule';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { getMeetings, updateMeeting } from '@/services/schedule'
import UpdateMeetingDialog from './update_meeting_dialog';
import { ActionConfiramationDialog } from './action_confirmation_dialog';
import { Link } from 'react-router-dom';

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

function MeetingCard({ meeting, onUpdate } : { meeting : Meeting, onUpdate: () => void }) {
  const isPast = meeting.startTime!.getTime() < new Date().getTime();
  const isNow =
    new Date().getTime() === meeting.startTime!.getTime()

  const authorizedToEdit = meeting.currentuserId == meeting.host?.id && !meeting.isCancelled;
  

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium text-lg ${meeting.isCancelled ? "line-through text-destructive" : ""}`}>{meeting.title}</h3>
            {isNow && <Badge className="bg-green-500">Now</Badge>}
          </div>
            <p className="text-muted-foreground">{meeting.description}</p>
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
              {meeting.participantsCount -1 > meeting.firstThreeParticipants.length && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{meeting.participantsCount - meeting.firstThreeParticipants.length - 1}
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
          ) : 
            <>
              { authorizedToEdit && (<UpdateMeetingDialog 
                meetingID={meeting.id}
                onUpdate={onUpdate}
              />)}
                <Link to={`/meetings/${meeting.id}/preparation`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-1">
                  <Video/>
                  Join
                </Button>
                </Link>
              { authorizedToEdit && (<ActionConfiramationDialog
                title='Cancel Meeting'
                description='Are you sure you want to cancel this meeting? This action cannot be undone.'
                onCancel={() => {}}
                action={async () => {
                  await updateMeeting({
                    id: meeting.id,
                    isCanceled: true,
                  });
                  onUpdate();
                }}
                trigger={
                  <Button size="sm" className="gap-1" variant={"destructive"}>Cancel</Button>
                }
              />)}
            </>
          }
        </div>
      </div>
    </div>
  )
}

interface MeetingsListProps {
    category?: SearchMeetingsRequest_MeetingCategory;
    searchQuery?: string;
}

const MeetingsList = (props: MeetingsListProps) => {
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [refreshCounter, setRefreshCounter] = React.useState(0);
  const prevCategory = React.useRef(props.category);
  const prevQuery = React.useRef(props.searchQuery);

  // Reset meetings when category or searchQuery changes
  React.useEffect(() => {
    if (
      prevCategory.current !== props.category ||
      prevQuery.current !== props.searchQuery
    ) {
      setMeetings([]);
      setHasMore(true);
      prevCategory.current = props.category;
      prevQuery.current = props.searchQuery;
    }
  }, [props.category, props.searchQuery]);

  // Refetch meetings when refreshCounter changes
  React.useEffect(() => {
    setMeetings([]);
    setHasMore(true);
  }, [refreshCounter]);

  const next = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(async () => {
      const pageSize = 10;
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

  // Increment refreshCounter when onUpdate is triggered
  const handleUpdate = () => {
    setRefreshCounter((c) => c + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} onUpdate={handleUpdate} />
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
