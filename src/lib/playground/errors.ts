import { DebugInfo, PlaygroundError } from "./types";

export const ERROR_CODES = {
  VALIDATION: "VALIDATION",
  WASM_INIT: "WASM_INIT",
  INGEST: "INGEST",
  SEARCH: "SEARCH",
  ITERATE: "ITERATE",
  TRAIN: "TRAIN",
  EXPORT: "EXPORT",
};

export function toPlaygroundError(code: string, message: string, cause?: unknown): PlaygroundError {
  const details = cause instanceof Error ? cause.stack ?? cause.message : String(cause ?? "");
  return {
    code,
    userMessage: message,
    details,
    cause,
  };
}

export function toDebugInfo(error: PlaygroundError, context?: Record<string, unknown>): DebugInfo {
  return {
    code: error.code,
    message: error.userMessage,
    details: error.details,
    context,
  };
}

export function logPlaygroundError(error: PlaygroundError) {
  // eslint-disable-next-line no-console
  console.error(`[Playground:${error.code}] ${error.userMessage}`, error.details);
}
