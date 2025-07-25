import { executeQuery } from "../client";
import * as queries from "../../../dbschema/queries";
import { server$ } from "@builder.io/qwik-city";

export const insertOrUpdateRepository = server$(
  async (args: Parameters<typeof queries.insertOrUpdateRepository>[1]) => {
    return await executeQuery(queries.insertOrUpdateRepository, args);
  },
);
