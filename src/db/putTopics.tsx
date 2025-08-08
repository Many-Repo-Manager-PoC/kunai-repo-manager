import metadata from "./metadata.json";
import { routeAction$ } from "@qwik.dev/router";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { getLogger } from "~/utils/getLogger";

/**
 * Replaces all topics for a single repository
 * @param data - Contains repo name and topics array
 * @param event - Qwik event object containing Octokit client
 * @returns Success status and error message if applicable
 */
// eslint-disable-next-line qwik/loader-location
export const usePutTopics = routeAction$(async (data, event) => {
  const logger = getLogger(event.sharedMap);
  const repo = data.repo as string;
  const topics = data.topics as string[];

  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    logger.info("Updating repository topics", { repo, topics });

    await Promise.all([
      octokit.rest.repos.replaceAllTopics({
        owner: metadata.owner,
        repo: repo,
        names: topics,
      }),
    ]);

    logger.info("Repository topics updated successfully", { repo });

    return { success: true };
  } catch (error) {
    logger.error("Error updating topics", error as Error, { repo, topics });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
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
  const logger = getLogger(event.sharedMap);
  const repos = data.repos as string[];
  const reposTopics = data.reposTopics as Record<string, string[]>;

  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    logger.info("Updating bulk repository topics", {
      repoCount: repos.length,
      repos,
    });

    await Promise.all(
      repos.map(async (repo) => {
        logger.debug("Updating repository topics", {
          repo,
          topics: reposTopics[repo],
        });

        await octokit.rest.repos.replaceAllTopics({
          owner: metadata.owner,
          repo: repo,
          names: reposTopics[repo],
        });
      }),
    );

    logger.info("Bulk repository topics updated successfully", {
      repoCount: repos.length,
    });

    return { success: true };
  } catch (error) {
    logger.error("Error updating repo topics", error as Error, { repos });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});
