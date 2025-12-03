import { useCallback, useRef, useState, JSX } from "react";
import { VideoEvent, VideoEventLog, VideoEventType } from "./VideoEventLog";

export interface VideoPlayerProps {
  videoId: string;
  onEvent: (
    eventType: VideoEventType,
    meta?: { from?: number; to?: number }
  ) => void;
}

export type VideoPlayerComponent = (props: VideoPlayerProps) => JSX.Element;

interface LivestreamViewerProps {
  VideoPlayer: VideoPlayerComponent;
  videoId: string;
}

export function LivestreamViewer({
  VideoPlayer,
  videoId,
}: LivestreamViewerProps) {
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const nextIdRef = useRef(1);

  const handleVideoEvent = useCallback(
    (type: VideoEventType, meta?: { from?: number; to?: number }) => {
      const timestamp = new Date().toLocaleTimeString();
      const id = nextIdRef.current++;

      let details: string | undefined;
      if (type === "seek" && meta) {
        details = `from ${meta.from?.toFixed(1)}s to ${meta.to?.toFixed(1)}s`;
      }

      const event: VideoEvent = { id, type, timestamp, details };
      setEvents((prev) => [...prev, event]);

      console.log("[VideoEvent]", event);
    },
    []
  );

  const clearEvents = () => setEvents([]);

  return (
    <div>
      <VideoPlayer videoId={videoId} onEvent={handleVideoEvent} />
      <VideoEventLog events={events} onClear={clearEvents} />
    </div>
  );
}
