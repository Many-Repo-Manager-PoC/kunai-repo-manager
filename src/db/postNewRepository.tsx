import type { Octokit } from "octokit";
import metadata from "./metadata.json";
import { routeAction$, type JSONObject } from "@qwik.dev/router";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

/**
 * Creates a new repository in the organization
 * @param form - Form data containing repository configuration
 * @param form.repoName - Name of the repository
 * @param form.repoDescription - Description of the repository
 * @param form.homepage - Repository homepage URL
 * @param form.isPrivate - Whether the repository is private
 * @param form.visibility - Repository visibility (private/public)
 * @param form.hasIssues - Whether issues are enabled
 * @param form.hasProjects - Whether projects are enabled
 * @param form.hasWiki - Whether wiki is enabled
 * @param form.hasDownloads - Whether downloads are enabled
 * @param form.isTemplate - Whether repository is a template
 * @param form.teamId - Team ID that owns the repository
 * @param form.autoInit - Whether to initialize repository with README
 * @param form.gitignoreTemplate - Gitignore template to use
 * @param form.licenseTemplate - License template to use
 * @param form.allowSquashMerge - Whether to allow squash merging
 * @param form.allowMergeCommit - Whether to allow merge commits
 * @param form.allowRebaseMerge - Whether to allow rebase merging
 * @param form.allowAutoMerge - Whether to allow auto-merging
 * @param form.deleteBranchOnMerge - Whether to delete branches after merging
 * @param form.useSquashPrTitleAsDefault - Whether to use PR title as default squash commit title
 * @param form.squashMergeCommitTitle - Title format for squash merge commits
 * @param form.squashMergeCommitMessage - Message format for squash merge commits
 * @param form.mergeCommitTitle - Title format for merge commits
 * @param form.mergeCommitMessage - Message format for merge commits
 * @param form.customProperties - Custom repository properties
 * @param event - Qwik event object containing Octokit client
 * @returns Success status and error message if applicable
 */
// eslint-disable-next-line qwik/loader-location
export const usePostNewOrgRepository = routeAction$(
  async (form: JSONObject, event) => {
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
        use_squash_pr_title_as_default: form.useSquashPrTitleAsDefault as
          | boolean
          | undefined,
        squash_merge_commit_title: form.squashMergeCommitTitle as
          | "PR_TITLE"
          | "COMMIT_OR_PR_TITLE"
          | undefined,
        squash_merge_commit_message: form.squashMergeCommitMessage as
          | "PR_BODY"
          | "COMMIT_MESSAGES"
          | "BLANK"
          | undefined,
        merge_commit_title: form.mergeCommitTitle as
          | "PR_TITLE"
          | "MERGE_MESSAGE"
          | undefined,
        merge_commit_message: form.mergeCommitMessage as
          | "PR_TITLE"
          | "PR_BODY"
          | "BLANK"
          | undefined,
        custom_properties: form.customProperties as
          | { [key: string]: unknown }
          | undefined,
      });

      return { success: true };
    } catch (error) {
      console.error("Error creating repository:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
);

/**
 * Creates a new repository for a user
 * @param form - Form data containing repository configuration
 * @param form.repoName - Name of the repository
 * @param form.repoDescription - Description of the repository
 * @param form.homepage - Repository homepage URL
 * @param form.isPrivate - Whether the repository is private
 * @param form.hasIssues - Whether issues are enabled
 * @param form.hasProjects - Whether projects are enabled
 * @param form.hasWiki - Whether wiki is enabled
 * @param form.hasDiscussions - Whether discussions are enabled
 * @param form.teamId - Team ID that owns the repository
 * @param form.autoInit - Whether to initialize repository with README
 * @param form.gitignoreTemplate - Gitignore template to use
 * @param form.licenseTemplate - License template to use
 * @param form.hasDownloads - Whether downloads are enabled
 * @param form.isTemplate - Whether repository is a template
 * @param form.allowSquashMerge - Whether to allow squash merging
 * @param form.allowMergeCommit - Whether to allow merge commits
 * @param form.allowRebaseMerge - Whether to allow rebase merging
 * @param form.allowAutoMerge - Whether to allow auto-merging
 * @param form.deleteBranchOnMerge - Whether to delete branches after merging
 * @param form.useSquashPrTitleAsDefault - Whether to use PR title as default squash commit title
 * @param form.squashMergeCommitTitle - Title format for squash merge commits
 * @param form.squashMergeCommitMessage - Message format for squash merge commits
 * @param form.mergeCommitTitle - Title format for merge commits
 * @param form.mergeCommitMessage - Message format for merge commits
 * @param event - Qwik event object containing Octokit client
 * @returns Success status and error message if applicable
 */
// eslint-disable-next-line qwik/loader-location
export const usePostNewUserRepository = routeAction$(
  async (form: JSONObject, event) => {
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
        use_squash_pr_title_as_default: form.useSquashPrTitleAsDefault as
          | boolean
          | undefined,
        squash_merge_commit_title: form.squashMergeCommitTitle as
          | "PR_TITLE"
          | "COMMIT_OR_PR_TITLE"
          | undefined,
        squash_merge_commit_message: form.squashMergeCommitMessage as
          | "PR_BODY"
          | "COMMIT_MESSAGES"
          | "BLANK"
          | undefined,
        merge_commit_title: form.mergeCommitTitle as
          | "PR_TITLE"
          | "MERGE_MESSAGE"
          | undefined,
        merge_commit_message: form.mergeCommitMessage as
          | "PR_TITLE"
          | "PR_BODY"
          | "BLANK"
          | undefined,
      });

      return { success: true };
    } catch (error) {
      console.error("Error creating repository:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
);
