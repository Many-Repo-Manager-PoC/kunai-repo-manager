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
  info: (data?: Record<string, any>, msg?: string) => void;
  error: (data?: Record<string, any>, msg?: string) => void;
  warn: (data?: Record<string, any>, msg?: string) => void;
  debug: (data?: Record<string, any>, msg?: string) => void;
  child: (bindings: Record<string, any>) => RequestLogger;
}

// Create a request-scoped logger
export const createLogger = (
  bindings: Record<string, any> = {},
): RequestLogger => {
  const logger = baseLogger.child(bindings);

  return {
    info: (data?: Record<string, any>, msg?: string) => {
      logger.info(data || {}, msg);
    },
    error: (data?: Record<string, any>, msg?: string) => {
      const logData = { ...(data || {}) } as Record<string, any>;
      if (logData.error && logData.error instanceof Error) {
        const err = logData.error as Error;
        logData.error = {
          message: err.message,
          stack: err.stack,
          name: err.name,
        };
      }
      logger.error(logData, msg);
    },
    warn: (data?: Record<string, any>, msg?: string) => {
      logger.warn(data || {}, msg);
    },
    debug: (data?: Record<string, any>, msg?: string) => {
      logger.debug(data || {}, msg);
    },
    child: (childBindings: Record<string, any>) => {
      return logger.child({ ...childBindings });
    },
  };
};

// Default logger for use outside of request context
export const logger = createLogger();

// Shared map key for the logger
export const LOGGER_KEY = "request_logger";
