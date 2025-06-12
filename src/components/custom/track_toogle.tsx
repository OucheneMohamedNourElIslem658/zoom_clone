import { useTrackToggle } from "@livekit/components-react";
import { Track, type AudioCaptureOptions, type ScreenShareCaptureOptions, type TrackPublishOptions, type VideoCaptureOptions } from "livekit-client";
import { forwardRef, useEffect, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, ScreenShare, ScreenShareOff } from "lucide-react";

type ToggleSource = Exclude<
  Track.Source,
  Track.Source.ScreenShareAudio | Track.Source.Unknown
>;

export type CaptureOptionsBySource<T extends ToggleSource> = T extends Track.Source.Camera
  ? VideoCaptureOptions
  : T extends Track.Source.Microphone
    ? AudioCaptureOptions
    : T extends Track.Source.ScreenShare
      ? ScreenShareCaptureOptions
      : never;

export interface TrackToggleProps<T extends ToggleSource>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  source: T;
  showIcon?: boolean;
  initialState?: boolean;
  /**
   * Function that is called when the enabled state of the toggle changes.
   * The second function argument `isUserInitiated` is `true` if the change was initiated by a user interaction, such as a click.
   */
  onChange?: (enabled: boolean, isUserInitiated: boolean) => void;
  captureOptions?: CaptureOptionsBySource<T>;
  publishOptions?: TrackPublishOptions;
  onDeviceError?: (error: Error) => void;
}

export const CustomTrackToggle: <T extends ToggleSource>(
  props: TrackToggleProps<T> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactNode = /* @__PURE__ */ forwardRef(function TrackToggle<
  T extends ToggleSource,
>({ showIcon, ...props }: TrackToggleProps<T>, ref: React.ForwardedRef<HTMLButtonElement>) {
  const { buttonProps, enabled } = useTrackToggle(props);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    isClient && (
    <button ref={ref} {...buttonProps}>
      {(showIcon ?? true) && getSourceIcon(props.source, enabled)}
      {props.children}
    </button>
    )
  );
});


function getSourceIcon(source: Track.Source, enabled: boolean) {
  switch (source) {
    case Track.Source.Microphone:
      return enabled ? <Mic/> : <MicOff />;
    case Track.Source.Camera:
      return enabled ? <Camera /> : <CameraOff />;
    case Track.Source.ScreenShare:
      return enabled ? <ScreenShare /> : <ScreenShareOff />;
    default:
      return undefined;
  }
}
