import { type RequestHandler } from "@builder.io/qwik-city";
import { ServerError } from "@builder.io/qwik-city/middleware/request-handler";
import { isDev } from "@builder.io/qwik/build";
import { ApplicationError } from "~/util/errors";

export const onRequest: RequestHandler = async ({ next, error, redirect }) => {
  try {
    return await next();
  } catch (err) {
    if (isDev) {
      console.error("Development error...", error);
      throw error;
    } else {
      if (isApplicationError(err)) {
        console.log("Application error...", err);
        if (err.name === "UNAUTHORIZED") {
          throw redirect(302, "/home/login/");
        }

        // TODO: Add more error types here

        throw error(500, err.message);
      } else if (isServerError(err)) {
        console.log("Server error...", err);
        throw error(500, { message: "An error occurred" });
      } else {
        // Fallback to 500 error
        console.log("Unknown error...", err);
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
