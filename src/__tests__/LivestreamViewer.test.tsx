import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { loadYouTubeIframeAPI } from "../youtubeApi";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { JSX } from "react";

import {
  LivestreamViewer,
  VideoPlayerProps,
  VideoPlayerComponent,
} from "../components/LivestreamViewer";
import { VideoEventType } from "../components/VideoEventLog";

const STORAGE_KEY = "user-isLoggedIn";

jest.mock("../youtubeApi", () => ({
  loadYouTubeIframeAPI: jest.fn(),
}));

beforeEach(() => {
  window.localStorage.setItem(STORAGE_KEY, "true");
  jest.clearAllMocks();
});

function TestVideoPlayer({ onEvent }: VideoPlayerProps): JSX.Element {
  const emit =
    (type: VideoEventType, meta?: { from?: number; to?: number }) => () =>
      onEvent(type, meta);

  return (
    <div>
      <p>Test Video Player</p>

      <button aria-label="simulate-play" onClick={emit("play")}>
        simulate play
      </button>
      <button aria-label="simulate-pause" onClick={emit("pause")}>
        simulate pause
      </button>
      <button
        aria-label="simulate-seek"
        onClick={emit("seek", { from: 5, to: 15 })}
      >
        simulate seek
      </button>
    </div>
  );
}

const TestVideoPlayerComponent: VideoPlayerComponent = TestVideoPlayer;

test("tracks play, pause and seek events from the dummy video player", () => {
  render(
    <LivestreamViewer
      VideoPlayer={TestVideoPlayerComponent}
      videoId="dummy-video-id"
    />
  );
  expect(screen.getByText(/test video player/i)).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("simulate-play"));
  fireEvent.click(screen.getByLabelText("simulate-pause"));
  fireEvent.click(screen.getByLabelText("simulate-seek"));

  const events = screen.getAllByTestId("event-item");
  expect(events).toHaveLength(3);

  const text = events
    .map((e) => e.textContent || "")
    .join(" ")
    .toLowerCase();
  expect(text).toContain("play");
  expect(text).toContain("pause");
  expect(text).toContain("seek");
});

test("tracks play, pause and seek from YouTube iframe events", async () => {
  const loadMock = loadYouTubeIframeAPI as jest.Mock;

  let onStateChange: ((event: any) => void) | undefined;
  let onReady: ((event: any) => void) | undefined;
  let currentTime = 0;
  let playerInstance: any;

  loadMock.mockResolvedValue({
    Player: function PlayerCtor(_element: HTMLElement, config: any) {
      onStateChange = config.events.onStateChange;
      onReady = config.events.onReady;

      playerInstance = {
        getCurrentTime: jest.fn(() => currentTime),
        destroy: jest.fn(),
      };

      return playerInstance;
    },
  });

  render(
    <LivestreamViewer VideoPlayer={YouTubePlayer} videoId="dummy-video-id" />
  );

  await waitFor(() => {
    expect(loadMock).toHaveBeenCalled();
  });

  await act(async () => {
    if (onReady && playerInstance) {
      onReady({ target: playerInstance });
    }

    onStateChange?.({ data: 1, target: playerInstance });

    currentTime = 0.5;
    onStateChange?.({ data: 2, target: playerInstance });

    currentTime = 20;
    onStateChange?.({ data: 3, target: playerInstance });
  });

  const events = await screen.findAllByTestId("event-item");
  expect(events).toHaveLength(3);

  const text = events
    .map((e) => e.textContent || "")
    .join(" ")
    .toLowerCase();
  expect(text).toContain("play");
  expect(text).toContain("pause");
  expect(text).toContain("seek");
});
