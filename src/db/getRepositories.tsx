import { routeLoader$ } from "@builder.io/qwik-city";
import metadata from "./metadata.json";
import { type Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";
import type { Repo, Result } from "./types";
import { type ErrorContext } from "~/util/errors";

/**
 * Gets all repositories from the given owner and list of repositories in metadata.json
 * @param event - Qwik event object containing Octokit client
 * @returns Array of repository data or empty array if error occurs
 */
// eslint-disable-next-line qwik/loader-location
export const useGetRepos = routeLoader$(
  async ({
    sharedMap,
    fail,
  }): Promise<Result<{ repositories: Repo[]; errors: ErrorContext[] }>> => {
    const octokit: Octokit = sharedMap.get(OCTOKIT_CLIENT);
    sharedMap.set("repos", metadata.repositories);
    const repositories: Repo[] = [];
    const errors: ErrorContext[] = [];

    const repoPromises = await Promise.allSettled(
      metadata.repositories.map(async (repoName) => {
        const res = await octokit.rest.repos.get({
          owner: metadata.owner,
          repo: repoName,
        });

        return { ...res.data, repoOwner: metadata.owner };
      }),
    );

    repoPromises.forEach((promise) => {
      if (promise.status === "fulfilled") {
        repositories.push(promise.value);
      } else {
        errors.push({
          name: "GET_REPOSITORIES_ERROR",
          message: promise.reason.message,
        });
      }
    });

    if (repositories.length === 0) {
      return fail(500, {
        name: "GET_REPOSITORIES_ERROR",
        message: "Failed to get repositories",
      });
    }

    return { data: { repositories, errors }, failed: false };
  },
);
