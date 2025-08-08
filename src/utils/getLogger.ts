import type { RequestEvent } from "@qwik.dev/router";
import { logger, LOGGER_KEY, type RequestLogger } from "./logger";

/**
 * Get the request-scoped logger from the shared map
 * Falls back to the default logger if not available
 */
export const getLogger = (sharedMap?: Map<string, any>): RequestLogger => {
  if (sharedMap) {
    const requestLogger = sharedMap.get(LOGGER_KEY);
    if (requestLogger) {
      return requestLogger;
    }
  }

  return logger;
};

/**
 * Get the request-scoped logger from a RequestEvent
 */
export const getLoggerFromEvent = (event: RequestEvent): RequestLogger => {
  return getLogger(event.sharedMap);
};
