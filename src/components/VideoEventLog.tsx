export type VideoEventType = "play" | "pause" | "seek";

export interface VideoEvent {
  id: number;
  type: VideoEventType;
  timestamp: string;
  details?: string;
}

interface VideoEventLogProps {
  events: VideoEvent[];
  onClear?: () => void;
}

export function VideoEventLog({ events, onClear }: VideoEventLogProps) {
  return (
    <section aria-label="video-event-log">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Event Log</h2>
        <button
          onClick={onClear}
          disabled={events.length === 0}
          aria-label="clear-events"
        >
          Clear
        </button>
      </div>
      {events.length === 0 ? (
        <p>No events recorded yet.</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id} data-testid="event-item">
              <strong>{e.type.toUpperCase()}</strong> – {e.timestamp}
              {e.details ? ` (${e.details})` : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
