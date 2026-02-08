export type PlaygroundPhase =
  | "idle"
  | "generating"
  | "ingesting"
  | "ready"
  | "searching"
  | "iterating"
  | "training"
  | "error";

export type PlaygroundState = {
  phase: PlaygroundPhase;
  status: string;
};

export type PlaygroundEvent =
  | { type: "RESET" }
  | { type: "GENERATE"; message: string }
  | { type: "INGEST"; message: string }
  | { type: "READY"; message: string }
  | { type: "SEARCH"; message: string }
  | { type: "ITERATE"; message: string }
  | { type: "TRAIN"; message: string }
  | { type: "ERROR"; message: string };

export const initialState: PlaygroundState = {
  phase: "idle",
  status: "Idle",
};

export function playgroundReducer(state: PlaygroundState, event: PlaygroundEvent): PlaygroundState {
  switch (event.type) {
    case "RESET":
      return initialState;
    case "GENERATE":
      return { phase: "generating", status: event.message };
    case "INGEST":
      return { phase: "ingesting", status: event.message };
    case "READY":
      return { phase: "ready", status: event.message };
    case "SEARCH":
      return { phase: "searching", status: event.message };
    case "ITERATE":
      return { phase: "iterating", status: event.message };
    case "TRAIN":
      return { phase: "training", status: event.message };
    case "ERROR":
      return { phase: "error", status: event.message };
    default:
      return state;
  }
}
