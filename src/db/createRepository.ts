import type { Octokit } from "octokit";
import metadata from "./metadata.json";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { zodForm$ } from "@modular-forms/qwik";
import { formAction$ } from "@modular-forms/qwik";
import { z } from "zod";

export const createRepositorySchema = z
  .object({
    repoType: z.enum(["user", "org"]).default("user"),
    repoName: z.string().min(1, "Repository name is required"),
    repoDescription: z.string().optional(),
    homepage: z.string().url().optional(),
    visibility: z.enum(["public", "private"]).default("public").optional(),
    hasIssues: z.boolean().default(true).optional(),
    hasProjects: z.boolean().default(true).optional(),
    hasWiki: z.boolean().default(true).optional(),
    hasDownloads: z.boolean().default(true).optional(),
    isTemplate: z.boolean().default(false).optional(),
    // teamId: z.number().optional(),
    autoInit: z.boolean().default(false).optional(),
    gitignoreTemplate: z.string().optional(),
    licenseTemplate: z.string().optional(),
    allowSquashMerge: z.boolean().default(true).optional(),
    allowMergeCommit: z.boolean().default(true).optional(),
    allowRebaseMerge: z.boolean().default(true).optional(),
    allowAutoMerge: z.boolean().default(false).optional(),
    deleteBranchOnMerge: z.boolean().default(false).optional(),
    // useSquashPrTitleAsDefault: z.boolean().default(false).optional(),
    // squashMergeCommitTitle: z.string().optional(),
    // squashMergeCommitMessage: z.string().optional(),
    // mergeCommitTitle: z.string().optional(),
    // mergeCommitMessage: z.string().optional(),
  })
  .refine(
    ({ allowMergeCommit, allowSquashMerge, allowRebaseMerge }) => {
      if (!allowMergeCommit && !allowSquashMerge && !allowRebaseMerge) {
        return false;
      }
      return true;
    },
    { message: "At least one merge method must be enabled" },
  );

export type CreateRepositoryFormType = z.infer<typeof createRepositorySchema>;

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
export const useCreateRepository = formAction$<
  CreateRepositoryFormType,
  { url: string }
>(async (formData, event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    const isOrg = formData.repoType === "org";
    let url = "";

    if (isOrg) {
      const repo = await octokit.rest.repos.createInOrg({
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
      url = repo.data.html_url;
    } else {
      const repo = await octokit.rest.repos.createForAuthenticatedUser({
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
      url = repo.data.html_url;
    }
    return {
      data: { url },
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
}, zodForm$(createRepositorySchema));
