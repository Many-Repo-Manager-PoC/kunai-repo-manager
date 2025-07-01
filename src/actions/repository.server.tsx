import { server$ } from "@builder.io/qwik-city";

import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";
import metadata from "../db/metadata.json";

// Import the functions from the existing actions file
import { insertAndUpdateRepository } from "../../dbschema/actions";

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
        // Create form data for the update
        const formData = new FormData();
        formData.append("repository_id", JSON.stringify(repository.id));
        formData.append("user_id", JSON.stringify(repository.owner.id));
        formData.append("name", repository.name);
        formData.append("description", repository.description);
        formData.append("archive_url", repository.archive_url);
        formData.append("contributors_url", repository.contributors_url);
        formData.append("contents_url", repository.contents_url);
        formData.append("clone_url", repository.clone_url);
        formData.append("forks", repository.forks);
        formData.append("forks_count", repository.forks_count);
        formData.append("forks_url", repository.forks_url);
        formData.append("topics", JSON.stringify(repository.topics));
        formData.append("owner", JSON.stringify(repository.owner));
        formData.append("full_name", repository.full_name);
        formData.append("private", repository.private);
        formData.append("fork", repository.fork);
        formData.append("created_at", repository.created_at);
        formData.append("updated_at", repository.updated_at);
        formData.append("pushed_at", repository.pushed_at);
        formData.append("size", repository.size);
        formData.append("stargazers_count", repository.stargazers_count);
        formData.append("watchers_count", repository.watchers_count);
        formData.append("language", repository.language);
        formData.append("has_issues", repository.has_issues);
        formData.append("has_projects", repository.has_projects);
        formData.append("has_downloads", repository.has_downloads);
        formData.append("has_wiki", repository.has_wiki);
        formData.append("has_pages", repository.has_pages);
        formData.append("has_discussions", repository.has_discussions);
        formData.append("forks_count", repository.forks_count);
        formData.append("archived", repository.archived);
        formData.append("disabled", repository.disabled);
        formData.append("license", JSON.stringify(repository.license));
        formData.append("allow_forking", repository.allow_forking);
        formData.append("is_template", repository.is_template);
        formData.append(
          "web_commit_signoff_required",
          repository.web_commit_signoff_required,
        );
        formData.append("default_branch", repository.default_branch);
        formData.append("open_issues_count", repository.open_issues_count);
        formData.append("visibility", repository.visibility);
        formData.append("network_count", repository.network_count);
        formData.append("subscribers_count", repository.subscribers_count);
        formData.append("node_id", repository.node_id);
        formData.append("git_url", repository.git_url);
        formData.append("ssh_url", repository.ssh_url);
        formData.append("clone_url", repository.clone_url);
        formData.append("svn_url", repository.svn_url);
        formData.append("homepage", repository.homepage);
        formData.append("language_color", repository.language_color);
        formData.append("mirror_url", repository.mirror_url);
        formData.append("archived_at", repository.archived_at);
        formData.append("allow_squash_merge", repository.allow_squash_merge);
        formData.append("allow_merge_commit", repository.allow_merge_commit);
        formData.append("allow_rebase_merge", repository.allow_rebase_merge);
        formData.append("allow_auto_merge", repository.allow_auto_merge);
        formData.append(
          "delete_branch_on_merge",
          repository.delete_branch_on_merge,
        );
        formData.append("allow_update_branch", repository.allow_update_branch);
        formData.append(
          "use_squash_pr_title_as_default",
          repository.use_squash_pr_title_as_default,
        );
        formData.append(
          "squash_merge_commit_message",
          repository.squash_merge_commit_message,
        );
        formData.append(
          "squash_merge_commit_title",
          repository.squash_merge_commit_title,
        );
        formData.append(
          "merge_commit_message",
          repository.merge_commit_message,
        );
        formData.append("merge_commit_title", repository.merge_commit_title);
        formData.append(
          "security_and_analysis",
          JSON.stringify(repository.security_and_analysis),
        );
        formData.append("temp_clone_token", repository.temp_clone_token);
        formData.append("open_issues", repository.open_issues);
        formData.append("watchers", repository.watchers);
        formData.append("master_branch", repository.master_branch);
        formData.append(
          "anonymous_access_enabled",
          repository.anonymous_access_enabled,
        );
        formData.append("source", JSON.stringify(repository.source));
        formData.append("parent", JSON.stringify(repository.parent));
        formData.append(
          "template_repository",
          JSON.stringify(repository.template_repository),
        );
        formData.append(
          "organization",
          JSON.stringify(repository.organization),
        );
        formData.append("permissions", JSON.stringify(repository.permissions));
        formData.append("role_name", repository.role_name);
        formData.append("teams_url", repository.teams_url);
        formData.append("hooks_url", repository.hooks_url);
        formData.append("issue_events_url", repository.issue_events_url);
        formData.append("events_url", repository.events_url);
        formData.append("assignees_url", repository.assignees_url);
        formData.append("branches_url", repository.branches_url);
        formData.append("tags_url", repository.tags_url);
        formData.append("blobs_url", repository.blobs_url);
        formData.append("git_tags_url", repository.git_tags_url);
        formData.append("git_refs_url", repository.git_refs_url);
        formData.append("trees_url", repository.trees_url);
        formData.append("statuses_url", repository.statuses_url);
        formData.append("languages_url", repository.languages_url);
        formData.append("stargazers_url", repository.stargazers_url);
        formData.append(
          "contributors_url",
          JSON.stringify(repository.contributors_url),
        );
        formData.append("subscribers_url", repository.subscribers_url);
        formData.append("subscription_url", repository.subscription_url);
        formData.append("commits_url", repository.commits_url);
        formData.append("git_commits_url", repository.git_commits_url);
        formData.append("comments_url", repository.comments_url);
        formData.append("issue_comment_url", repository.issue_comment_url);
        formData.append("contents_url", repository.contents_url);
        formData.append("compare_url", repository.compare_url);
        formData.append("merges_url", repository.merges_url);
        formData.append("archive_url", repository.archive_url);
        formData.append("downloads_url", repository.downloads_url);
        formData.append("issues_url", repository.issues_url);
        formData.append("pulls_url", repository.pulls_url);
        formData.append("milestones_url", repository.milestones_url);
        formData.append("notifications_url", repository.notifications_url);
        formData.append("labels_url", repository.labels_url);
        formData.append("releases_url", repository.releases_url);
        formData.append("deployments_url", repository.deployments_url);
        formData.append("forks", repository.forks);
        formData.append("html_url", repository.html_url);
        formData.append("keys_url", repository.keys_url);
        formData.append("url", repository.url);

        // Update the repository using the existing function
        await insertAndUpdateRepository(formData);
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
