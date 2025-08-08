import { component$, useSignal } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";
import { Button } from "@kunai-consulting/kunai-design-system";
import { BaseCard } from "~/components/cards/baseCard";
import { CreateRepositoryForm } from "~/components/forms/createRepoForm";
import { CreateRepositoryFromTemplateForm } from "~/components/forms/createRepoFromTemplateForm";
import { PageTitle } from "~/components/page/pageTitle";
import type { Octokit } from "octokit";
import metadata from "~/db/metadata.json";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { zodForm$ } from "@modular-forms/qwik";
import { formAction$ } from "@modular-forms/qwik";
import { z } from "zod";
import { getLogger } from "~/util/getLogger";

export const createRepositoryFromTemplateSchema = z.object({
  repoType: z.enum(["user", "org"]).default("user"),
  repoName: z.string().min(1, "Repository name is required"),
  repoDescription: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public").optional(),
  templateRepoFullName: z.string().min(1, "Template repository is required"),
});

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
    autoInit: z.boolean().default(false).optional(),
    gitignoreTemplate: z.string().optional(),
    licenseTemplate: z.string().optional(),
    allowSquashMerge: z.boolean().default(true).optional(),
    allowMergeCommit: z.boolean().default(true).optional(),
    allowRebaseMerge: z.boolean().default(true).optional(),
    allowAutoMerge: z.boolean().default(false).optional(),
    deleteBranchOnMerge: z.boolean().default(false).optional(),
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

export type CreateRepositoryFromTemplateFormType = z.infer<
  typeof createRepositoryFromTemplateSchema
>;

export const useCreateRepository = formAction$<
  CreateRepositoryFormType,
  { url: string }
>(async (formData, event) => {
  const logger = getLogger(event.sharedMap);

  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    const isOrg = formData.repoType === "org";
    let url = "";

    logger.info("Creating repository", {
      name: formData.repoName,
      type: formData.repoType,
      visibility: formData.visibility,
    });

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

    logger.info("Repository created successfully", { url });

    return {
      data: { url },
      status: "success",
      message: "Repository created successfully",
    };
  } catch (error) {
    logger.error("Error creating repository", error as Error, {
      repoName: formData.repoName,
      repoType: formData.repoType,
    });
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}, zodForm$(createRepositorySchema));

export const useCreateTemplateRepository = formAction$<
  CreateRepositoryFromTemplateFormType,
  { url: string }
>(async (formData, event) => {
  const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
  const [templateOwner, templateRepo] =
    formData.templateRepoFullName.split("/");
  const { data: repo } = await octokit.rest.repos.createUsingTemplate({
    template_owner: templateOwner,
    template_repo: templateRepo,
    owner: formData.repoType === "org" ? templateOwner : undefined,
    name: formData.repoName,
    description: formData.repoDescription,
    private: formData.visibility === "private",
  });
  return {
    data: { url: repo.html_url },
    status: "success",
    message: "Repository created successfully",
  };
}, zodForm$(createRepositoryFromTemplateSchema));

export default component$(() => {
  const showTemplateForm = useSignal(false);
  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        divider={false}
        rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50"
      >
        <div q:slot="header" class="w-full">
          <div class="flex justify-between items-center">
            <h4>New Repository</h4>
            <Button
              class="cursor-pointer text-sm"
              type="button"
              onClick$={() =>
                (showTemplateForm.value = !showTemplateForm.value)
              }
            >
              {showTemplateForm.value
                ? "Create from Scratch"
                : "Create from Template"}
            </Button>
          </div>
        </div>
        <div q:slot="body">
          {showTemplateForm.value ? (
            <CreateRepositoryFromTemplateForm />
          ) : (
            <CreateRepositoryForm />
          )}
        </div>
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create a Repository",
};
