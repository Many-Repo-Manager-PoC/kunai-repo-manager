import metadata from "./metadata.json";
import { routeAction$ } from "@qwik.dev/router";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

/**
 * Dispatches a workflow event to update a package to its latest version and create a pull request
 * @param data - Contains repository and package information
 * @param data.repo - The repository where the workflow is being run
 * @param data.repo_name - The repository where package is being updated
 * @param data.package_name - The name of the package to update
 * @param data.package_version - The new version of the package
 * @param data.pr_title - The title for the pull request
 * @param data.pr_body - The body content for the pull request
 * @param event - Qwik event object containing Octokit client
 * @returns Success status and error message if applicable
 */
// eslint-disable-next-line qwik/loader-location
export const postWorkflowDispatchEvent = routeAction$(async (data, event) => {
  const session = event.sharedMap.get("session");
  const gh_access_token = session?.accessToken;
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    await octokit.rest.actions.createWorkflowDispatch({
      owner: metadata.owner,
      repo: "kunai-repo-manager",
      workflow_id: "update-package.yml",
      ref: "main",
      inputs: {
        repo_name: data.repo_name as string,
        package_name: data.package_name as string,
        package_version: data.package_version as string,
        pr_title: data.pr_title as string,
        pr_body: data.pr_body as string,
        owner: metadata.owner,
        gh_access_token: gh_access_token as string,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error dispatching workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});
