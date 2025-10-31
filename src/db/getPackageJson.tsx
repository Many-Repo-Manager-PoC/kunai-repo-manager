import { routeLoader$ } from "@qwik.dev/router";
import metadata from "./metadata.json";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";
import { getLogger } from "~/util/getLogger";

/**
 * Gets the package.json content for all repositories specified in metadata.json
 * @param event - Qwik event object containing Octokit client
 * @returns Array of objects containing repository name, package.json content, and any error messages
 */
// eslint-disable-next-line qwik/loader-location
export const useGetPackageJson = routeLoader$(async (event) => {
  const logger = getLogger(event.sharedMap);

  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    const paths = metadata.dependencyPaths;

    logger.info({ pathCount: paths.length }, "Fetching package.json files");

    const packageJsons: Array<{
      repo: string;
      packageJson: any;
      error: string | null;
    }> = await Promise.all(
      paths.map(async (path: string[]) => {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner: metadata.owner,
            repo: path[0],
            path: path[1],
            mediaType: {
              format: "object",
            },
          });
          const content = atob((data as { content: string }).content || "");
          const packageJson = JSON.parse(content);
          return {
            repo: path[0],
            packageJson,
            error: null,
          };
        } catch (error) {
          logger.warn(
            {
              repo: path[0],
              path: path[1],
              error: error instanceof Error ? error.message : "Unknown error",
            },
            "Failed to fetch package.json for repository",
          );
          return {
            repo: path[0],
            packageJson: null,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      }),
    );

    logger.info(
      {
        total: paths.length,
        successful: packageJsons.filter((p) => p.error === null).length,
      },
      "Package.json files fetched successfully",
    );

    return packageJsons;
  } catch (error) {
    logger.error({ error: error as Error }, "Error fetching package.json");
    return [];
  }
});
