import type pino from "pino";
import { logger, LOGGER_KEY } from "./logger";

/**
 * Get the request-scoped logger from the shared map
 * Falls back to the default logger if not available
 */
export const getLogger = (sharedMap?: Map<string, any>) => {
  if (sharedMap) {
    const requestLogger = sharedMap.get(LOGGER_KEY) as pino.Logger;
    if (requestLogger) {
      return requestLogger;
    }
  }

  return logger;
};
