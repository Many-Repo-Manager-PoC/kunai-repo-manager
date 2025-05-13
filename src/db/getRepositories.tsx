import { routeLoader$ } from "@builder.io/qwik-city";
import metadata from "./metadata.json";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";

/**
 * Gets all repositories from the given owner and list of repositories in metadata.json
 * @param event - Qwik event object containing Octokit client
 * @returns Array of repository data or empty array if error occurs
 */
// eslint-disable-next-line qwik/loader-location
export const useGetRepos = routeLoader$(async (event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    // Set initial state in shared map
    event.sharedMap.set("repos", metadata.repositories);

    const repositories = await Promise.all(
      metadata.repositories.map(async (repoName) => {
        const { data } = await octokit.rest.repos.get({
          owner: metadata.owner,
          repo: repoName,
        });
        return { ...data, repoOwner: metadata.owner };
      }),
    );
    return repositories;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
});
