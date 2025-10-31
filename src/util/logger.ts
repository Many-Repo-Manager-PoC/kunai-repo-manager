import pino from "pino";

// Create a base logger instance

// Default logger for use outside of request context
export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:mm:ss:l",
            ignore: "pid,hostname",
            singleLine: true,
          },
        }
      : undefined,
});

// Shared map key for the logger
export const LOGGER_KEY = "request_logger";
