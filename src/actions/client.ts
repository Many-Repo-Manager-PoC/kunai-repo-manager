import { createClient, type Executor } from "gel";
import { logger } from "~/util/logger";

// Private state via closure
let client: Executor | null = null;

const isConnectionError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("invalidreferenceerror")
  );
};

const createNewClient = (): Executor => {
  logger.info("Creating new database client");
  return createClient();
};

const closeClient = (): void => {
  if (client) {
    client = null;
    logger.info("Database client closed");
  }
};

// Main client management functions
export const getClient = (): Executor => {
  if (!client) {
    closeClient();
    client = createNewClient();
  }

  return client;
};

// Regular async function preserves generic types with optional args
export const executeQuery = async <T, TArgs = void>(
  queryFn: TArgs extends void
    ? (client: Executor) => Promise<T>
    : (client: Executor, args: TArgs) => Promise<T>,
  args?: TArgs,
): Promise<T> => {
  const dbClient = getClient();

  try {
    if (args === undefined) {
      return await (queryFn as (client: Executor) => Promise<T>)(dbClient);
    } else {
      return await (queryFn as (client: Executor, args: TArgs) => Promise<T>)(
        dbClient,
        args,
      );
    }
  } catch (error) {
    logger.error("Database query failed", error as Error);

    if (isConnectionError(error)) {
      logger.info("Connection error detected, recreating client");
      closeClient();
      const newClient = getClient();
      if (args === undefined) {
        return await (queryFn as (client: Executor) => Promise<T>)(newClient);
      } else {
        return await (queryFn as (client: Executor, args: TArgs) => Promise<T>)(
          newClient,
          args,
        );
      }
    }

    throw error;
  }
};
