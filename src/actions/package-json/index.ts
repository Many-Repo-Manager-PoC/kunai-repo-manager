import { executeQuery } from "../client";
import * as queries from "../../../dbschema/queries";
import { server$ } from "@qwik.dev/router";

export const getPackageJson = server$(async (repoName: string) => {
  return await executeQuery(queries.getPackageJson, {
    name: repoName,
  });
});

export const getDependenciesForRepo = server$(async (repoId: number) => {
  if (!repoId) {
    return [];
  }
  return await executeQuery(queries.getDependenciesForRepo, {
    repository_id: repoId,
  });
});

export const getAllPackageJsons = server$(async () => {
  return await executeQuery(queries.getAllPackageJsons);
});
