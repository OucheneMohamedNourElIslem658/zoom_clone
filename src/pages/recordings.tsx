import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Video, Play, Download } from "lucide-react"
import { getRecodrings } from "@/services/room"

interface Recording {
  url: string
  roomId: string
  userId: string
  timestamp: number
  roomName: string
  date: Date
}

function parseRecordingUrl(url: string): Recording | null {
  try {
    const pathParts = new URL(url).pathname.split("/")
    const roomsIndex = pathParts.indexOf("rooms")
    if (roomsIndex === -1 || pathParts.length < roomsIndex + 5) return null

    const [roomId, userId, timestampStr, filename] = pathParts.slice(roomsIndex + 1, roomsIndex + 5)
    const timestamp = Number.parseInt(timestampStr)
    const roomName = decodeURIComponent(filename).replace(".mp4", "")

    return {
      url,
      roomId,
      userId,
      timestamp,
      roomName,
      date: new Date(timestamp / 1000),
    }
  } catch {
    return null
  }
}

export default function RecordingsPage() {
  const { id: roomID } = useParams()
  const [recordings, setRecordings] = useState<string[]>([])
  const [roomInfo, setRoomInfo] = useState<{ roomName: string; roomDesc: string } | null>(null)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRecordings = async () => {
      setLoading(true)
      const [response, err] = await getRecodrings(roomID || "")
      if (err || !response) {
        setError(err)
      } else {
        setRecordings(response.urls)
        setRoomInfo({
          roomName: response.meetingName,
          roomDesc: response.meetingDescription,
        })
      }
      setLoading(false)
    }

    if (roomID) fetchRecordings()
  }, [roomID])

  const parsedRecordings = useMemo(() => (
    recordings
      .map(parseRecordingUrl)
      .filter((r): r is Recording => r !== null)
      .sort((a, b) => b.timestamp - a.timestamp)
  ), [recordings])

  const handleDownload = (rec: Recording) => {
    const link = document.createElement("a")
    link.href = rec.url
    link.download = `${rec.roomName}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
        {roomInfo && (
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold">{roomInfo.roomName}</h1>
                    <p className="text-muted-foreground">{roomInfo.roomDesc}</p>
                </div>
            </div>
        )}

      {/* Skeleton Loader */}
      {loading && (
        <>
          <div className="space-y-4 mb-6">
            <div>
              <div className="h-8 w-1/3 bg-muted rounded mb-2 animate-pulse"></div>
              <div className="h-5 w-1/2 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Now Playing */}
      {!loading && selectedRecording && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Now Playing: {selectedRecording.roomName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <video
              controls
              className="w-full max-w-4xl mx-auto rounded-lg"
              src={selectedRecording.url}
              preload="metadata"
            />
          </CardContent>
        </Card>
      )}

      {/* Recordings */}
      {!loading && parsedRecordings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parsedRecordings.map((rec, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <video className="w-full h-full object-cover rounded-lg" src={rec.url} preload="metadata" muted />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setSelectedRecording(rec)} className="flex-1" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button onClick={() => handleDownload(rec)} variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {rec.date.toLocaleTimeString()}
                  </CardDescription>
                  <Badge variant="secondary" className="text-xs">
                    MP4
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Recordings */}
      {!loading && parsedRecordings.length === 0 && !error && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No recordings found</h3>
          <p className="text-muted-foreground">
            No video recordings are available or they are still being processed. Please check back later.
          </p>
        </div>
      )}
    </div>
  )
}
