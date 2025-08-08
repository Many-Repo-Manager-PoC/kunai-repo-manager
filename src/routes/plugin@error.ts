import { type RequestHandler } from "@qwik.dev/router";
import { ServerError } from "@qwik.dev/router/middleware/request-handler";
import { isDev } from "@qwik.dev/core/build";
import { ApplicationError } from "~/util/errors";
import { getLogger } from "~/util/getLogger";

export const onRequest: RequestHandler = async ({
  next,
  error,
  redirect,
  sharedMap,
}) => {
  const logger = getLogger(sharedMap);

  try {
    return await next();
  } catch (err) {
    if (isDev) {
      if (err instanceof ApplicationError) {
        logger.error("Application error", err as Error, {
          errorType: err.name,
        });
        if (err.name === "UNAUTHORIZED") {
          throw redirect(302, "/home/login/");
        }
      }

      logger.error("Development error", err as Error);
      throw err;
    } else {
      if (isApplicationError(err)) {
        logger.error("Application error", err as Error, {
          errorType: err.name,
        });
        if (err.name === "UNAUTHORIZED") {
          throw redirect(302, "/home/login/");
        }

        // TODO: Add more error types here

        throw error(500, err.message);
      } else if (isServerError(err)) {
        logger.error("Server error", err as Error);
        throw error(500, { message: "An error occurred" });
      } else {
        // Fallback to 500 error
        logger.error("Unknown error", err as Error);
        throw error(500, { message: "An error occurred" });
      }
    }
  }
};

const isServerError = (err: unknown): err is ServerError => {
  return (
    err instanceof ServerError ||
    // This is required for dev environments due to an issue with vite: https://github.com/vitejs/vite/issues/3910
    (isDev && err instanceof Error && err.constructor.name === "ServerError")
  );
};

const isApplicationError = (err: unknown): err is ApplicationError => {
  return err instanceof ApplicationError;
};
