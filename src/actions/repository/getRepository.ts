import { server$ } from "@builder.io/qwik-city";
import { executeQuery } from "../client";
import * as queries from "../../../dbschema/queries";

export const getRepositories = server$(async () => {
  const result = await executeQuery(queries.getRepositories);
  return result;
});

export const getRepoByName = server$(async (repoName: string) => {
  return await executeQuery(queries.getRepository, {
    name: repoName,
  });
});

export const getRepositoriesForAllTopics = server$(async () => {
  const result = await executeQuery(queries.getRepositories);
  return [
    ...new Set(
      result.flatMap((repo) => {
        // Split any comma-separated topics into individual topics
        const repoTopics = repo.topics;
        return repoTopics.flatMap((topic) =>
          typeof topic === "string"
            ? topic.split(",").map((t) => t.trim())
            : [],
        );
      }),
    ),
  ];
});
