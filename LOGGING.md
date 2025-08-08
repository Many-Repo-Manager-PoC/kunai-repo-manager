## Logging

This app uses Pino for structured logging with a request-scoped logger bound via a Qwik middleware.

### What’s included

- Request-scoped logger initialized per request in `src/routes/plugin@logger.ts`
- Helper utilities in `src/utils/logger.ts` and `src/utils/getLogger.ts`
- Pretty, colorized logs in development; compact JSON logs in production

### Getting a logger

- Server loaders/actions (`routeLoader$`, `routeAction$`):

  ```ts
  import { getLogger } from "~/utils/getLogger";

  // inside your handler
  const logger = getLogger(event.sharedMap);
  logger.info("Doing work", { some: "context" });
  ```

- `server$` functions:

  ```ts
  import { getLogger } from "~/utils/getLogger";

  export const myAction = server$(async function () {
    const logger = getLogger(this.sharedMap);
    logger.debug("Handling server$ request");
  });
  ```

- Client/non-request code (e.g., components/utilities):

  ```ts
  import { logger } from "~/utils/logger";
  logger.debug("Component mounted");
  ```

### Best practices

- Prefer structured fields over string interpolation:
  ```ts
  logger.info("Created repository", { name, visibility });
  ```
- Include useful identifiers early (e.g., `repositoryName`, `userId`, `jobId`).
- Use appropriate levels: `debug` (verbose), `info` (normal ops), `warn` (recoverable), `error` (failures).
- Log errors with the error object to preserve stack traces:
  ```ts
  logger.error("Failed to update", err, { repositoryName });
  ```
- Create child loggers for module- or operation-specific context:
  ```ts
  const opLogger = logger.child({ module: "component-copy" });
  opLogger.info("Start");
  ```
- Avoid logging secrets or PII. Never log access tokens, passwords, raw headers, or full request bodies.
- Pass plain objects as the second/third argument; avoid pre-serializing to JSON.
- Keep messages short; put details in the object payload.

### Request-scoped metadata

Every request-scoped logger automatically includes:

- `requestId`: unique per request
- `method`, `url`, `userAgent`, `ip`

This makes it easy to correlate logs across code paths for a single request.

### Local vs production

- Development: pretty output via `pino-pretty` with timestamps and colors.
- Production: JSON logs optimized for ingestion by log platforms.

### Files of interest

- `src/routes/plugin@logger.ts`: binds the request-scoped logger
- `src/utils/logger.ts`: logger factory and base instance
- `src/utils/getLogger.ts`: helpers to fetch the current request logger
