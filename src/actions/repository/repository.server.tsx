import { server$ } from "@qwik.dev/router";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../../routes/plugin@octokit";
import metadata from "../../db/metadata.json";
import * as queries from "../../../dbschema/queries";
import { getClient } from "~/actions/client";
import { upsertRepositories } from "./repository.service";

/**
 * Helper to ensure topics is a comma-separated string.
 * Accepts: string[] | string | undefined/null
 * Returns: string (comma-separated, or empty string)
 */
function normalizeTopics(topics: any): string {
  if (Array.isArray(topics)) {
    // Defensive: filter out non-string, trim, and join
    return topics
      .map((t) => (typeof t === "string" ? t.trim() : String(t)))
      .filter((t) => t.length > 0)
      .join(",");
  } else if (typeof topics === "string") {
    // Already a string, just trim
    return topics.trim();
  }
  return "";
}

export const useRefreshRepositoriesV2 = server$(async function () {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const res = await octokit.rest.repos.listForOrg({
    org: metadata.owner,
  });
  await upsertRepositories(
    res.data.map((repo) => ({ repo: repo.name, owner: repo.owner.login })),
  );
  return {
    success: true,
    message: "Repositories refreshed",
  };
});

export const useRefreshRepositories = server$(async function () {
  try {
    const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);

    // Get all repositories from GitHub
    const repoPromises = await Promise.allSettled(
      metadata.repositories.map(async (repoName) => {
        const res = await octokit.rest.repos.get({
          owner: metadata.owner,
          repo: repoName,
        });

        return { ...res.data };
      }),
    );

    // Filter successful responses and extract the data
    const datarepositories = repoPromises
      .filter(
        (promise): promise is PromiseFulfilledResult<any> =>
          promise.status === "fulfilled",
      )
      .map((promise) => promise.value);

    // Loop through each repository and update/insert it in the database
    for (const repository of datarepositories) {
      try {
        // Ensure topics is a comma-separated string for DB
        const topics = normalizeTopics(repository.topics);

        // Map GitHub API data to InsertOrUpdateRepositoryArgs
        const repoArgs: queries.InsertOrUpdateRepositoryArgs = {
          repository_id: repository.id,
          archived: repository.archived ?? false,
          template_repository_id: repository.template_repository?.id ?? 0,
          topics, // Now always a string
          visibility: repository.visibility ?? "",
          is_template: repository.is_template ?? false,
          license_name: repository.license?.name ?? "",
          license_key: repository.license?.key ?? "",
          license_spdx_id: repository.license?.spdx_id ?? "",
          license_url: repository.license?.url ?? "",
          license_html_url: repository.license?.html_url ?? "",
          license_node_id: repository.license?.node_id ?? "",
          contents_url: repository.contents_url ?? "",
          contributors_url: repository.contributors_url ?? "",
          created_at: repository.created_at ?? "",
          default_branch: repository.default_branch ?? "",
          deployments_url: repository.deployments_url ?? "",
          description: repository.description ?? "",
          disabled: repository.disabled ?? false,
          downloads_url: repository.downloads_url ?? "",
          events_url: repository.events_url ?? "",
          fork: repository.fork ?? false,
          forks: repository.forks ?? 0,
          forks_count: repository.forks_count ?? 0,
          full_name: repository.full_name ?? "",
          has_discussions: repository.has_discussions ?? false,
          has_issues: repository.has_issues ?? false,
          has_pages: repository.has_pages ?? false,
          has_projects: repository.has_projects ?? false,
          has_wiki: repository.has_wiki ?? false,
          homepage: repository.homepage ?? "",
          hooks_url: repository.hooks_url ?? "",
          html_url: repository.html_url ?? "",
          issue_comment_url: repository.issue_comment_url ?? "",
          issue_events_url: repository.issue_events_url ?? "",
          issues_url: repository.issues_url ?? "",
          keys_url: repository.keys_url ?? "",
          labels_url: repository.labels_url ?? "",
          language: repository.language ?? "",
          languages_url: repository.languages_url ?? "",
          name: repository.name ?? "",
          node_id: repository.node_id ?? "",
          notifications_url: repository.notifications_url ?? "",
          open_issues: repository.open_issues ?? 0,
          open_issues_count: repository.open_issues_count ?? 0,
          owner_user_id: repository.owner?.id ?? 0,
          owner_avatar_url: repository.owner?.avatar_url ?? "",
          owner_name: repository.owner?.name ?? "",
          owner_email: repository.owner?.email ?? "",
          owner_login: repository.owner?.login ?? "",
          owner_role_type: repository.owner?.role_type ?? "",
          owner_site_admin: repository.owner?.site_admin ?? false,
          owner_received_events_url:
            repository.owner?.received_events_url ?? null,
          owner_repos_url: repository.owner?.repos_url ?? null,
          owner_starred_url: repository.owner?.starred_url ?? null,
          owner_subscriptions_url: repository.owner?.subscriptions_url ?? null,
          owner_url: repository.owner?.url ?? null,
          owner_user_view_type: repository.user_view_type ?? null,
          private: repository.private ?? false,
          pulls_url: repository.pulls_url ?? "",
          pushed_at: repository.pushed_at ?? "",
          releases_url: repository.releases_url ?? "",
          size: repository.size ?? 0,
          ssh_url: repository.ssh_url ?? "",
          stargazers_count: repository.stargazers_count ?? 0,
          stargazers_url: repository.stargazers_url ?? "",
          statuses_url: repository.statuses_url ?? "",
          subscribers_url: repository.subscribers_url ?? "",
          subscription_url: repository.subscription_url ?? "",
          svn_url: repository.svn_url ?? "",
          tags_url: repository.tags_url ?? "",
          teams_url: repository.teams_url ?? "",
          trees_url: repository.trees_url ?? "",
          updated_at: repository.updated_at ?? "",
          url: repository.url ?? "",
          watchers_count: repository.watchers_count ?? 0,
          forks_url: repository.forks_url ?? "",
        };

        await queries.insertOrUpdateRepository(getClient(), repoArgs);
      } catch (error) {
        console.error(`Error processing repositories:`, error);
      }
    }

    return {
      success: true,
      message: `Repositories successfully processed`,
      data: {
        processedCount: datarepositories.length,
      },
    };
  } catch (error) {
    console.error("Error getting and processing repositories:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
});
