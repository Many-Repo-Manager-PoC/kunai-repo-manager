// src/hooks/useRepositories.ts
import { useSignal, useTask$ } from "@builder.io/qwik";

import type * as queries from "../../dbschema/queries";
import {
  getAllPackageJsons,
  getDependenciesForRepo,
  getPackageJson,
} from "~/actions/package-json";
import { insertOrUpdateRepository } from "~/actions/repository";

export * from "./repository.hooks";

export function useGetPackageJson(repoName: string) {
  const packageJson =
    useSignal<Awaited<ReturnType<typeof getPackageJson>>>(null);

  useTask$(async () => {
    const result = await getPackageJson(repoName);
    packageJson.value = result;
  });
  return packageJson;
}

export function useGetDependenciesForRepo(repoId: number) {
  const dependencies = useSignal<
    Awaited<ReturnType<typeof getDependenciesForRepo>>
  >([]);

  useTask$(async () => {
    if (!repoId) {
      dependencies.value = [];
      return;
    }
    const result = await getDependenciesForRepo(repoId);
    dependencies.value = result;
  });
  return dependencies;
}

export function useGetAllPackageJsons() {
  const packageJsons = useSignal<
    Awaited<ReturnType<typeof getAllPackageJsons>>
  >([]);

  useTask$(async () => {
    const result = await getAllPackageJsons();
    packageJsons.value = result;
  });
  return packageJsons;
}

export function useInsertOrUpdateRepository(
  args: queries.InsertOrUpdateRepositoryArgs,
) {
  const signal =
    useSignal<Awaited<ReturnType<typeof insertOrUpdateRepository>>>(null);

  useTask$(async () => {
    const result = await insertOrUpdateRepository(args);
    signal.value = result;
  });
  return signal;
}
