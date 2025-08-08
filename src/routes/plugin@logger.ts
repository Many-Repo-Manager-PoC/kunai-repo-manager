import type { RequestHandler } from "@qwik.dev/router";
import { createLogger, LOGGER_KEY } from "~/util/logger";
import { nanoid } from "nanoid/non-secure";

export const onRequest: RequestHandler = async ({
  sharedMap,
  request,
  next,
}) => {
  // Generate a unique request ID (no crypto dependency)
  const requestId = nanoid();

  // Create a request-scoped logger with request metadata
  const logger = createLogger({
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent"),
    ip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      "unknown",
  });

  // Store the logger in the shared map for the duration of the request
  sharedMap.set(LOGGER_KEY, logger);

  // Log the incoming request
  logger.info("Request started", {
    method: request.method,
    url: request.url,
  });

  try {
    return await next();
  } catch (error) {
    // Log any errors that occur during request processing
    logger.error("Request failed", error as Error, {
      method: request.method,
      url: request.url,
    });

    throw error;
  }
};
