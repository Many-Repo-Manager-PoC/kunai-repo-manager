import { type RequestHandler } from "@builder.io/qwik-city";
import { ServerError } from "@builder.io/qwik-city/middleware/request-handler";
import { isDev } from "@builder.io/qwik/build";
import { ApplicationError } from "~/util/error";

export const onRequest: RequestHandler = async ({ next, error, redirect }) => {
  try {
    console.log("Attempting to execute next middleware in the chain...");
    return await next();
  } catch (err) {
    if (isDev) {
      console.error("Development error...", error);
      throw error;
    } else {
      if (isServerError(err)) {
        console.log("ServerError...");
        throw error(500, { message: "An error occurred" });
      } else if (isApplicationError(err)) {
        console.log("ApplicationError...");
        if (err.status === 401) {
          throw redirect(302, "/home/login/");
        }
      } else {
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
