import type { Octokit } from "octokit";
import metadata from "./metadata.json";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { zodForm$ } from "@modular-forms/qwik";
import {
  createRepositorySchema,
  type CreateRepositoryFormType,
} from "~/components/forms/createRepoForm";
import { formAction$ } from "@modular-forms/qwik";

/**
 * Creates a new GitHub repository based on the provided form data.
 *
 * This action creates either an organization repository or a personal repository
 * depending on the selected repository type. It handles all repository configuration
 * parameters from the form submission.
 *
 * @param {CreateRepositoryFormType} formData - The form data containing repository configuration
 * @param {RequestEvent} event - The event object containing shared data including the Octokit client
 * @returns {Promise<{status: string, message: string}>} Result object indicating success or error
 */
export const useCreateRepository = formAction$<CreateRepositoryFormType>(
  async (formData, event) => {
    console.log(formData);

    try {
      const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
      const isOrg = formData.repoType === "org";

      if (isOrg) {
        await octokit.rest.repos.createInOrg({
          org: metadata.owner,
          name: formData.repoName,
          description: formData.repoDescription,
          homepage: formData.homepage,
          private: formData.visibility === "private",
          visibility: formData.visibility,
          has_issues: formData.hasIssues,
          has_projects: formData.hasProjects,
          has_wiki: formData.hasWiki,
          has_downloads: formData.hasDownloads,
          is_template: formData.isTemplate,
          auto_init: formData.autoInit,
          gitignore_template: formData.gitignoreTemplate,
          license_template: formData.licenseTemplate,
          allow_squash_merge: formData.allowSquashMerge,
          allow_merge_commit: formData.allowMergeCommit,
          allow_rebase_merge: formData.allowRebaseMerge,
        });
      } else {
        await octokit.rest.repos.createForAuthenticatedUser({
          name: formData.repoName,
          description: formData.repoDescription,
          homepage: formData.homepage,
          private: formData.visibility === "private",
          visibility: formData.visibility,
          has_issues: formData.hasIssues,
          has_projects: formData.hasProjects,
          has_wiki: formData.hasWiki,
          has_downloads: formData.hasDownloads,
          is_template: formData.isTemplate,
          auto_init: formData.autoInit,
          gitignore_template: formData.gitignoreTemplate,
          license_template: formData.licenseTemplate,
          allow_squash_merge: formData.allowSquashMerge,
          allow_merge_commit: formData.allowMergeCommit,
          allow_rebase_merge: formData.allowRebaseMerge,
          allow_auto_merge: formData.allowAutoMerge,
          delete_branch_on_merge: formData.deleteBranchOnMerge,
        });
      }
      return {
        status: "success",
        message: "Repository created successfully",
      };
    } catch (error) {
      console.error("Error creating repository:", error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
  zodForm$(createRepositorySchema),
);
