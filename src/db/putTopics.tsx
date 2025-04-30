import metadata from "./metadata.json";
import { routeAction$ } from '@builder.io/qwik-city';
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

/**
 * Replaces all topics for a single repository
 * @param data - Contains repo name and topics array
 * @param event - Qwik event object containing Octokit client
 * @returns Success status and error message if applicable
 */
// eslint-disable-next-line qwik/loader-location
export const usePutTopics = routeAction$(async (data, event) => {
  const repo = data.repo as string;
  const topics = data.topics as string[];

  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    await octokit.rest.repos.replaceAllTopics({
      owner: metadata.owner,
      repo: repo,
      names: topics,
    });

    return { success: true };

  } catch (error) {
    console.error("Error updating topics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
});

/**
 * Replaces all topics for multiple repositories
 * @param data - Contains array of repo names and mapping of repos to their topics
 * @param event - Qwik event object containing Octokit client
 * @returns Success status and error message if applicable
 */
// eslint-disable-next-line qwik/loader-location
export const usePutBulkTopics = routeAction$(async (data, event) => {
  const repos = data.repos as string[];
  const reposTopics = data.reposTopics as Record<string, string[]>;

  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    
    await Promise.all(repos.map(async (repo) => {
      console.log(`Updating repo ${repo} with topics:`, reposTopics[repo]);
      
      await octokit.rest.repos.replaceAllTopics({
        owner: metadata.owner,
        repo: repo,
        names: reposTopics[repo],
      });
    }));

    return { success: true };

  } catch (error) {
    console.error("Error updating repo topics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
});
