import { insertOrUpdateRepository } from "./commands";
import { server$ } from "@qwik.dev/router";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import type { Octokit } from "octokit";
import type { InsertOrUpdateRepositoryArgs } from "@dbschema/queries";

/**
 * Helper to ensure topics is a comma-separated string.
 *
 * @param {string[] | string | undefined | null} topics - The topics to format
 * @returns A comma-separated string of topics, or empty string if no topics provided
 *
 * @example
 * ```typescript
 *  normalizeTopics(['react', 'typescript']) // returns "react,typescript"
 *  normalizeTopics('react,typescript') // returns "react,typescript"
 *  normalizeTopics(undefined) // returns ""
 * ```
 */
function normalizeTopics(topics?: string[] | string | null): string {
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

const updateRepo = async (
  repository: Awaited<
    ReturnType<InstanceType<typeof Octokit>["rest"]["repos"]["get"]>
  >["data"],
) => {
  try {
    // Ensure topics is a comma-separated string for DB
    const topics = normalizeTopics(repository.topics);

    // Map GitHub API data to InsertOrUpdateRepositoryArgs
    const repoArgs: InsertOrUpdateRepositoryArgs = {
      repository_id: repository.id,
      archived: repository.archived,
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
      contents_url: repository.contents_url,
      contributors_url: repository.contributors_url,
      created_at: repository.created_at,
      default_branch: repository.default_branch,
      deployments_url: repository.deployments_url,
      description: repository.description ?? "",
      disabled: repository.disabled,
      downloads_url: repository.downloads_url,
      events_url: repository.events_url,
      fork: repository.fork,
      forks: repository.forks,
      forks_count: repository.forks_count,
      full_name: repository.full_name,
      has_discussions: repository.has_discussions,
      has_issues: repository.has_issues,
      has_pages: repository.has_pages,
      has_projects: repository.has_projects,
      has_wiki: repository.has_wiki,
      homepage: repository.homepage ?? "",
      hooks_url: repository.hooks_url,
      html_url: repository.html_url,
      issue_comment_url: repository.issue_comment_url,
      issue_events_url: repository.issue_events_url,
      issues_url: repository.issues_url,
      keys_url: repository.keys_url,
      labels_url: repository.labels_url,
      language: repository.language ?? "",
      languages_url: repository.languages_url,
      name: repository.name,
      node_id: repository.node_id,
      notifications_url: repository.notifications_url,
      open_issues: repository.open_issues,
      open_issues_count: repository.open_issues_count,
      owner_user_id: repository.owner.id,
      owner_avatar_url: repository.owner.avatar_url,
      owner_name: repository.owner.name ?? "",
      owner_email: repository.owner.email ?? "",
      owner_login: repository.owner.login,
      owner_role_type: repository.owner.type,
      owner_site_admin: repository.owner.site_admin,
      owner_received_events_url: repository.owner.received_events_url,
      owner_repos_url: repository.owner.repos_url,
      owner_starred_url: repository.owner.starred_url,
      owner_subscriptions_url: repository.owner.subscriptions_url,
      owner_url: repository.owner.url,
      //   owner_user_view_type: repository.user_view_type ?? null,
      private: repository.private,
      pulls_url: repository.pulls_url,
      pushed_at: repository.pushed_at,
      releases_url: repository.releases_url,
      // role_type: repository.owner?.role_type ?? "", // Remove, not in InsertOrUpdateRepositoryArgs
      size: repository.size,
      ssh_url: repository.ssh_url,
      stargazers_count: repository.stargazers_count,
      stargazers_url: repository.stargazers_url,
      statuses_url: repository.statuses_url,
      subscribers_url: repository.subscribers_url,
      subscription_url: repository.subscription_url,
      svn_url: repository.svn_url,
      tags_url: repository.tags_url,
      teams_url: repository.teams_url,
      trees_url: repository.trees_url,
      updated_at: repository.updated_at,
      url: repository.url,
      watchers_count: repository.watchers_count,
      forks_url: repository.forks_url,
    };

    console.log(repoArgs);
    await insertOrUpdateRepository(repoArgs);
  } catch (error) {
    console.error(`Error processing repositories:`, error);
  }
};

export const updateRepository = server$(async function (
  repoName: string,
  ownerName: string,
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const getRepo = await octokit.rest.repos.get({
    owner: ownerName,
    repo: repoName,
  });
  await updateRepo(getRepo.data);
});

export const updateRepositories = server$(async function (
  repositories: { repo: string; owner: string }[],
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const repoPromises = await Promise.allSettled(
    repositories.map(async (repo) => {
      const res = await octokit.rest.repos.get(repo);

      return { ...res.data };
    }),
  );
  for (const res of repoPromises) {
    if (res.status === "fulfilled") {
      await updateRepo(res.value);
    } else {
      console.error(`Error refreshing repository:`, res.reason);
    }
  }
});
