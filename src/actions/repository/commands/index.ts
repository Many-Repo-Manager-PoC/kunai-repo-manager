import { executeQuery } from "~/actions/client";
import * as queries from "@dbschema/queries";
import { server$ } from "@qwik.dev/router";

export const insertOrUpdateRepository = server$(
  async (args: Parameters<typeof queries.insertOrUpdateRepository>[1]) => {
    return await executeQuery(queries.insertOrUpdateRepository, args);
  },
);
