import { routeLoader$ } from "@qwik.dev/router";
import metadata from "./metadata.json";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";

/**
 * Gets the package.json content for all repositories specified in metadata.json
 * @param event - Qwik event object containing Octokit client
 * @returns Array of objects containing repository name, package.json content, and any error messages
 */
// eslint-disable-next-line qwik/loader-location
export const useGetPackageJson = routeLoader$(async (event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    const paths = metadata.dependencyPaths;

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
          return {
            repo: path[0],
            packageJson: null,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      }),
    );

    return packageJsons;
  } catch (error) {
    console.error("Error fetching package.json:", error);
    return [];
  }
});
