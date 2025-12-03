import { useEffect, useRef } from "react";
import { loadYouTubeIframeAPI } from "../youtubeApi";
import { VideoEventType } from "./VideoEventLog";
import { VideoPlayerComponent, VideoPlayerProps } from "./LivestreamViewer";

const YOUTUBE_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

const SEEK_THRESHOLD_SECONDS = 1.0;

export const YouTubePlayer: VideoPlayerComponent = ({
  videoId,
  onEvent,
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const lastReportedTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadYouTubeIframeAPI().then((YOUTUBE) => {
      if (!isMounted || !containerRef.current) return;

      playerRef.current = new YOUTUBE.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
        },
        events: {
          onReady: (event: any) => {
            try {
              const t = event.target.getCurrentTime?.() ?? 0;
              lastReportedTimeRef.current = t;
            } catch {
              lastReportedTimeRef.current = 0;
            }
          },
          onStateChange: (event: any) => {
            const state = event.data as number;
            const player = event.target;

            let currentTime = 0;
            try {
              currentTime = player.getCurrentTime?.() ?? 0;
            } catch {
              // ignore
            }

            const prevTime = lastReportedTimeRef.current;
            lastReportedTimeRef.current = currentTime;

            if (state === YOUTUBE_STATE.PLAYING) {
              handleVideoEvent("play", currentTime);
            } else if (state === YOUTUBE_STATE.PAUSED) {
              handleVideoEvent("pause", currentTime);
            }

            if (
              prevTime !== null &&
              Math.abs(currentTime - prevTime) > SEEK_THRESHOLD_SECONDS &&
              (state === YOUTUBE_STATE.PLAYING || state === YOUTUBE_STATE.BUFFERING)
            ) {
              handleVideoEvent("seek", currentTime, prevTime);
            }
          },
        },
      });
    });

    return () => {
      isMounted = false;
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onEvent]);

  const handleVideoEvent = (
    type: VideoEventType,
    currentTime: number,
    fromTime?: number
  ) => {
    if (type === "seek" && typeof fromTime === "number") {
      onEvent("seek", { from: fromTime, to: currentTime });
    } else {
      onEvent(type);
    }
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          backgroundColor: "#000",
        }}
        aria-label="youtube-player"
        data-testid="youtube-player"
      />
    </div>
  );
};
