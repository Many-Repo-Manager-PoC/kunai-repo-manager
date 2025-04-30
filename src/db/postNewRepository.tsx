import type { Octokit } from "octokit";
import metadata from "./metadata.json";
import { routeAction$, type JSONObject } from '@builder.io/qwik-city';
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

// Creates a new repository in the organization 
// eslint-disable-next-line qwik/loader-location
export const usePostNewOrgRepository = routeAction$(async (form: JSONObject, event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    await octokit.rest.repos.createInOrg({
      org: metadata.owner,
      name: form.repoName as string,
      description: form.repoDescription as string | undefined,
      homepage: form.homepage as string | undefined,
      private: form.isPrivate as boolean | undefined,
      visibility: form.visibility as "private" | "public" | undefined,
      has_issues: form.hasIssues as boolean | undefined,
      has_projects: form.hasProjects as boolean | undefined,
      has_wiki: form.hasWiki as boolean | undefined,
      has_downloads: form.hasDownloads as boolean | undefined,
      is_template: form.isTemplate as boolean | undefined,
      team_id: form.teamId as number | undefined,
      auto_init: form.autoInit as boolean | undefined,
      gitignore_template: form.gitignoreTemplate as string | undefined,
      license_template: form.licenseTemplate as string | undefined,
      allow_squash_merge: form.allowSquashMerge as boolean | undefined,
      allow_merge_commit: form.allowMergeCommit as boolean | undefined,
      allow_rebase_merge: form.allowRebaseMerge as boolean | undefined,
      allow_auto_merge: form.allowAutoMerge as boolean | undefined,
      delete_branch_on_merge: form.deleteBranchOnMerge as boolean | undefined,
      use_squash_pr_title_as_default: form.useSquashPrTitleAsDefault as boolean | undefined,
      squash_merge_commit_title: form.squashMergeCommitTitle as "PR_TITLE" | "COMMIT_OR_PR_TITLE" | undefined,
      squash_merge_commit_message: form.squashMergeCommitMessage as "PR_BODY" | "COMMIT_MESSAGES" | "BLANK" | undefined,
      merge_commit_title: form.mergeCommitTitle as "PR_TITLE" | "MERGE_MESSAGE" | undefined,
      merge_commit_message: form.mergeCommitMessage as "PR_TITLE" | "PR_BODY" | "BLANK" | undefined,
      custom_properties: form.customProperties as { [key: string]: unknown } | undefined,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating repository:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
});

// Creates a new repository for a user
// eslint-disable-next-line qwik/loader-location
export const usePostNewUserRepository = routeAction$(async (form: JSONObject, event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    await octokit.rest.repos.createForAuthenticatedUser({
      name: form.repoName as string,
      description: form.repoDescription as string | undefined,
      homepage: form.homepage as string | undefined,
      private: form.isPrivate as boolean | undefined,
      has_issues: form.hasIssues as boolean | undefined,
      has_projects: form.hasProjects as boolean | undefined,
      has_wiki: form.hasWiki as boolean | undefined,
      has_discussions: form.hasDiscussions as boolean | undefined,
      team_id: form.teamId as number | undefined,
      auto_init: form.autoInit as boolean | undefined,
      gitignore_template: form.gitignoreTemplate as string | undefined,
      license_template: form.licenseTemplate as string | undefined,
      has_downloads: form.hasDownloads as boolean | undefined,
      is_template: form.isTemplate as boolean | undefined,
      allow_squash_merge: form.allowSquashMerge as boolean | undefined,
      allow_merge_commit: form.allowMergeCommit as boolean | undefined,
      allow_rebase_merge: form.allowRebaseMerge as boolean | undefined,
      allow_auto_merge: form.allowAutoMerge as boolean | undefined,
      delete_branch_on_merge: form.deleteBranchOnMerge as boolean | undefined,
      use_squash_pr_title_as_default: form.useSquashPrTitleAsDefault as boolean | undefined,
      squash_merge_commit_title: form.squashMergeCommitTitle as "PR_TITLE" | "COMMIT_OR_PR_TITLE" | undefined,
      squash_merge_commit_message: form.squashMergeCommitMessage as "PR_BODY" | "COMMIT_MESSAGES" | "BLANK" | undefined,
      merge_commit_title: form.mergeCommitTitle as "PR_TITLE" | "MERGE_MESSAGE" | undefined,
      merge_commit_message: form.mergeCommitMessage as "PR_TITLE" | "PR_BODY" | "BLANK" | undefined
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating repository:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
});