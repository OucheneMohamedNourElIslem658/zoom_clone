import { useConnectionState } from "@livekit/components-react";
import { ConnectionState, type Room } from "livekit-client";
import { CloudOff, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

/** @public */
export interface CustomConnectionStateToastProps extends React.HTMLAttributes<HTMLDivElement> {
  room?: Room;
}

export function CustomConnectionStateToast(props: CustomConnectionStateToastProps) {
  const [notification, setNotification] = useState<React.ReactElement | undefined>(undefined);
  const state = useConnectionState(props.room);

  useEffect(() => {
    switch (state) {
      case ConnectionState.Reconnecting:
        setNotification(
            <div className="flex items-center gap-2">
                <Loader className="lk-spinner" /> Reconnecting
            </div>
        );
        break;
      case ConnectionState.Connecting:
        setNotification(
            <div className="flex items-center gap-2">
                <Loader className="lk-spinner" /> Connecting
            </div>
        );
        break;
      case ConnectionState.Disconnected:
        setNotification(
            <div className="flex items-center gap-2">
                <CloudOff /> Disconnected
            </div>,
        );
        break;
      default:
        setNotification(undefined);
        break;
    }
  }, [state]);
  return notification ? 
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 p-3">
        {notification}
    </Card> 
    : <></>;
}
