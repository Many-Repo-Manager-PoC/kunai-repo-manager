// src/hooks/useRepositories.ts
import { useSignal, useTask$ } from "@builder.io/qwik";
import { createClient } from "gel";
import * as queries from "../../dbschema/queries";
import type { GetRepositoryReturns } from "../../dbschema/queries";

export function useGetRepositories() {
  const repositories = useSignal<GetRepositoryReturns[]>([]);

  useTask$(async () => {
    const result = await queries.getRepositories(createClient());
    repositories.value = result;
  });

  return repositories;
}

export function useGetRepoByName(repoName: string) {
  const repository = useSignal<GetRepositoryReturns | null>(null);

  useTask$(async () => {
    const result = await queries.getRepository(createClient(), {
      name: repoName,
    });
    repository.value = result;
  });

  return repository;
}
export function useGetRepositoriesForAllTopics() {
  const allTopics = useSignal<string[]>([]);

  useTask$(async () => {
    const result = await queries.getRepositories(createClient());
    const topics = result.flatMap((repo) => {
      // Split any comma-separated topics into individual topics
      const repoTopics = repo.topics || [];
      return repoTopics.flatMap((topic) =>
        typeof topic === "string" ? topic.split(",").map((t) => t.trim()) : [],
      );
    });
    allTopics.value = [...new Set(topics)]; // Remove duplicates
  });

  return allTopics;
}
