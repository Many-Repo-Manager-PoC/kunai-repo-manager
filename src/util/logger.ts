import pino from "pino";

// Create a base logger instance
const baseLogger = pino({
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

// Request-scoped logger type
export interface RequestLogger {
  info: (msg: string, data?: Record<string, any>) => void;
  error: (msg: string, error?: Error | any, data?: Record<string, any>) => void;
  warn: (msg: string, data?: Record<string, any>) => void;
  debug: (msg: string, data?: Record<string, any>) => void;
  child: (bindings: Record<string, any>) => RequestLogger;
}

// Create a request-scoped logger
export const createLogger = (
  bindings: Record<string, any> = {},
): RequestLogger => {
  const logger = baseLogger.child(bindings);

  return {
    info: (msg: string, data?: Record<string, any>) => {
      logger.info(data || {}, msg);
    },
    error: (msg: string, error?: Error | any, data?: Record<string, any>) => {
      const logData = { ...data };
      if (error) {
        logData.error =
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : error;
      }
      logger.error(logData, msg);
    },
    warn: (msg: string, data?: Record<string, any>) => {
      logger.warn(data || {}, msg);
    },
    debug: (msg: string, data?: Record<string, any>) => {
      logger.debug(data || {}, msg);
    },
    child: (childBindings: Record<string, any>) => {
      return createLogger({ ...bindings, ...childBindings });
    },
  };
};

// Default logger for use outside of request context
export const logger = createLogger();

// Shared map key for the logger
export const LOGGER_KEY = "request_logger";
