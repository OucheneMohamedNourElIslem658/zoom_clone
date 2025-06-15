import { ChatIcon, ChatToggle, MediaDeviceMenu, useConnectionState, useLocalParticipantPermissions, useMaybeLayoutContext, usePersistentUserChoices, useRoomContext } from "@livekit/components-react";
import { ConnectionState, Room, Track } from "livekit-client";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { CustomTrackToggle } from "./track_toogle";
import { Button } from "../ui/button";
import { mergeProps } from "./merge_props";
import { PhoneOff } from "lucide-react";
import { RecordingSwitcher } from "./recording_switcher";
import { recordRoom, stopRecordingRoom } from "@/services/room";
import { toast } from "sonner";

/** @public */
export interface CustomControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  variation?: 'minimal' | 'verbose' | 'textOnly';
  saveUserChoices?: boolean;
  initialState: {
    isCameraOn: boolean
    isAudioOn: boolean
    camerDeviceId?: string
    audioDeviceId?: string
  }
}

export function CustomControlBar({
  saveUserChoices = true,
  onDeviceError,
  initialState = {
    isCameraOn: true,
    isAudioOn: true
  }
}: CustomControlBarProps) {
  let variation = "minimal";
  const controls = {
    microphone: true,
    camera: true,
    chat: true,
    screenShare: true,
    leave: true,
  }

  const meetingID = useRoomContext().name;

  const [_, setIsChatOpen] = useState(false);
  const layoutContext = useMaybeLayoutContext();
  useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);
  const isTooLittleSpace = false

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { ...controls, leave: true };

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const showIcon = useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation],
  );
  const showText = useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation],
  );

  const browserSupportsScreenSharing = true;

  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);

  const onScreenShareChange = useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled],
  );

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const microphoneOnChange = useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  const cameraOnChange = useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled],
  );

  // handle the onToggle(isRecording: boolean) function for the RecordingSwitcher
  const handleRecordingToggle = async (isRecording: boolean) => {
    if (isRecording) {
      let err = await recordRoom(meetingID)
      if (err) {
        console.error("Error starting recording:", err);
        toast.error("Failed to start recording: " + err.message);
      } else {
        toast.success("Recording started successfully.");
      }
    } else {
      let err = await stopRecordingRoom(meetingID)
      if (err) {
        console.error("Error stopping recording:", err);
        toast.error("Failed to stop recording: " + err.message);
      } else {
        toast.success("Recording stopped successfully.");
      }
    }
  };


  return (
    <div className="flex gap-2 justify-center lk-control-bar fixed bottom-0 left-0 right-0 bg-card h-[100px]">
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <CustomTrackToggle
            initialState={initialState.isAudioOn}
            source={Track.Source.Microphone}
            showIcon={showIcon}
            onChange={microphoneOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
          >
            {showText && 'Microphone'}
          </CustomTrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={initialState.audioDeviceId}
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) =>
                saveAudioInputDeviceId(deviceId ?? 'default')
              }
            />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="lk-button-group">
          <CustomTrackToggle
            initialState={initialState.isCameraOn}
            source={Track.Source.Camera}
            showIcon={showIcon}
            onChange={cameraOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Camera, error })}
          >
            {showText && 'Camera'}
          </CustomTrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={initialState.camerDeviceId}
              kind="videoinput"
              onActiveDeviceChange={(_kind, deviceId) =>
                saveVideoInputDeviceId(deviceId ?? 'default')
              }
            />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <CustomTrackToggle
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
          showIcon={showIcon}
          onChange={onScreenShareChange}
          onDeviceError={(error) => onDeviceError?.({ source: Track.Source.ScreenShare, error })}
        >
          {showText && (isScreenShareEnabled ? 'Stop screen share' : 'Share screen')}
        </CustomTrackToggle>
      )}
      <RecordingSwitcher onToggle={async (isRecording) => await handleRecordingToggle(isRecording)}/>
      {visibleControls.chat && (
        <ChatToggle className="h-full">
          {showIcon && <ChatIcon />}
          {showText && 'Chat'}
        </ChatToggle>
      )}
      {visibleControls.leave && (
        <DisconnectButton className="text-white hover:bg-red-700" style={{ padding: '21px', backgroundColor: '#dc2626' }}>
          {showIcon && <PhoneOff className="h-[45px] w-[45px]" />}
          {showText && 'Leave'}
        </DisconnectButton>
      )}
    </div>
  );
}

export interface DisconnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  stopTracks?: boolean;
}

export const DisconnectButton: (
  props: DisconnectButtonProps & React.RefAttributes<HTMLButtonElement>,
) => React.ReactNode = /* @__PURE__ */ forwardRef<HTMLButtonElement, DisconnectButtonProps>(
  function DisconnectButton(props: DisconnectButtonProps, ref) {
    const { buttonProps } = useDisconnectButton(props);
    return (
      <Button ref={ref} {...buttonProps} variant={'outline'} className="cursor-pointer hover:bg-red-500">
        {props.children}
      </Button>
    );
  },
);

export function useDisconnectButton(props: DisconnectButtonProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);

  const buttonProps = useMemo(() => {
    const { className, disconnect } = setupDisconnectButton(room);
    const mergedProps = mergeProps(props, {
      className,
      onClick: () => disconnect(props.stopTracks ?? true),
      disabled: connectionState === ConnectionState.Disconnected,
    });
    return mergedProps;
  }, [room, props, connectionState]);

  return { buttonProps };
}

export function setupDisconnectButton(room: Room) {
  const disconnect = (stopTracks?: boolean) => {
    room.disconnect(stopTracks);
  };
  const className: string = "lk-button lk-button-disconnect";
  return { className, disconnect };
}
