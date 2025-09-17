import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { component$, useSignal } from "@qwik.dev/core";
import { server$, type DocumentHead } from "@qwik.dev/router";
import { z } from "zod";
import { BaseCard } from "~/components/cards/baseCard";
import { DesignSystemSyncForm } from "~/routes/designSystemSync/updateFromDesignSystemForm";
import { CreateRepositoryForm } from "~/routes/designSystemSync/createFromDesignSystemForm";
import { PageTitle } from "~/components/page/pageTitle";
import { Button } from "@kunai-consulting/kunai-design-system";
import {
  getBranch,
  getRepositoryTreeItems,
  createTree,
  getRepositoryFileTree,
  FileFilterOptions,
  CreateRepositoryRequest,
  createRepository,
} from "~/actions/services/github";
import { createPullRequestWorkflow } from "~/actions/services/github/pull-requests";
import { parseRepositoryFullName } from "~/actions/services/github/utils";
import { getRepoByName } from "~/actions/repository/queries";

// Helper function to sync files between repositories
const syncRepoFiles = async ({
  sourceRepoOwner,
  sourceRepoName,
  targetRepoOwner,
  targetRepoName,
  filePaths,
  excludeDirectories = "",
  excludeFileTypes = "",
  treeSha = "main",
}: {
  sourceRepoOwner: string;
  sourceRepoName: string;
  targetRepoOwner: string;
  targetRepoName: string;
  filePaths: string[];
  excludeDirectories?: string;
  excludeFileTypes?: string;
  treeSha?: string;
}) => {
  // Parse comma-separated exclusion values
  const excludeDirs = excludeDirectories
    ? excludeDirectories
        .split(",")
        .map((dir) => dir.trim())
        .filter(Boolean)
    : [];
  const excludeTypes = excludeFileTypes
    ? excludeFileTypes
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean)
    : [];

  // Get the SHA of the main branch for the target repo
  const mainBranch = await getBranch({
    owner: targetRepoOwner,
    repo: targetRepoName,
    branch: "main",
  });

  // Get source config files using service layer
  const treeItems = await getRepositoryTreeItems({
    owner: sourceRepoOwner,
    repo: sourceRepoName,
    tree_sha: treeSha,
    filters: {
      includeFilePaths: filePaths,
      excludeFilePaths: excludeDirs,
      excludeFileExtensions: excludeTypes,
    },
  });

  // Create tree using service layer
  const newTree = await createTree({
    owner: targetRepoOwner,
    repo: targetRepoName,
    tree: treeItems,
    base_tree: mainBranch.data.commit.sha,
  });

  // Create pull request workflow
  const pr = await createPullRequestWorkflow({
    sourceRepoOwner,
    sourceRepoName,
    targetRepoName,
    targetRepoOwner,
    targetBranchName: "feature/sync-files",
    treeSha: newTree.data.sha,
    mainTargetBranchSha: mainBranch.data.commit.sha,
  });

  return { pr };
};

export const createRepositorySchema = z.object({
  repoName: z.string().min(1, "Repository name is required"),
  repoDescription: z.string().optional(),
  sourceRepoFullName: z.string().min(1, "Source repository is required"),
  filePaths: z.array(z.string()).min(1, "At least one file path is required"),
  excludeDirectories: z.string().optional(),
  excludeFileTypes: z.string().optional(),
});

export type CreateRepositoryFormType = z.infer<typeof createRepositorySchema>;

export const useCreateRepository = formAction$<
  CreateRepositoryFormType,
  { url: string }
>(async (formData) => {
  try {
    let targetRepoName = "";
    let targetRepoOwner = "";
    const { owner: sourceRepoOwner, name: sourceRepoName } =
      parseRepositoryFullName(formData.sourceRepoFullName);
    const sourceRepository = await getRepoByName(formData.sourceRepoFullName);

    if (!sourceRepository) {
      throw new Error("Source repository not found");
    }

    const isOrg = sourceRepository.owner.role_type === "Organization";
    const request = {
      name: formData.repoName,
      description:
        formData.repoDescription ?? sourceRepository.description ?? undefined,
      homepage: sourceRepository.homepage ?? undefined,
      private: sourceRepository.private || false,
      visibility: sourceRepository.visibility ?? undefined,
      has_issues: sourceRepository.has_issues || true,
      has_projects: sourceRepository.has_projects || true,
      has_wiki: sourceRepository.has_wiki || true,
      has_downloads: sourceRepository.has_downloads || true,
      has_discussions: sourceRepository.has_discussions || false,
      is_template: sourceRepository.is_template || false,
      auto_init: false,
      license_template: sourceRepository.license?.name || undefined,
      allow_squash_merge: sourceRepository.allow_squash_merge || true,
      allow_merge_commit: sourceRepository.allow_merge_commit || true,
      allow_rebase_merge: sourceRepository.allow_rebase_merge || true,
      allow_auto_merge: sourceRepository.allow_auto_merge || false,
      allow_forking: sourceRepository.allow_forking ?? undefined,
      delete_branch_on_merge: sourceRepository.delete_branch_on_merge || false,
      squash_merge_commit_title: sourceRepository.squash_merge_commit_title as
        | "PR_TITLE"
        | "COMMIT_OR_PR_TITLE"
        | undefined,
      squash_merge_commit_message:
        sourceRepository.squash_merge_commit_message as
          | "PR_BODY"
          | "COMMIT_MESSAGES"
          | "BLANK"
          | undefined,
      merge_commit_title: sourceRepository.merge_commit_title as
        | "PR_TITLE"
        | "MERGE_MESSAGE"
        | undefined,
      merge_commit_message: sourceRepository.merge_commit_message as
        | "PR_TITLE"
        | "PR_BODY"
        | "BLANK"
        | undefined,
      team_id: sourceRepository.team_id ?? undefined,
    };

    const createRequest: CreateRepositoryRequest = isOrg
      ? {
          type: "org",
          request: { ...request, org: sourceRepoOwner },
        }
      : {
          type: "user",
          request: request,
        };

    // Create repo in github
    const repo = await createRepository(createRequest);

    // TODO: Add repo to database or sync data

    targetRepoName = repo.data.name;
    targetRepoOwner = repo.data.owner.login;

    // Use the helper function to sync files
    const { pr } = await syncRepoFiles({
      sourceRepoOwner,
      sourceRepoName,
      targetRepoOwner,
      targetRepoName,
      filePaths: formData.filePaths,
      excludeDirectories: formData.excludeDirectories,
      excludeFileTypes: formData.excludeFileTypes,
    });

    return {
      data: { url: pr.data.html_url },
      status: "success",
      message: "Repository successfully created and files synced",
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

export const designSystemSyncSchema = z.object({
  sourceRepoFullName: z.string().min(1, "Source repository is required"),
  targetRepoFullName: z.string().min(1, "Target repository is required"),
  filePaths: z.array(z.string()).min(1, "At least one file path is required"),
  excludeDirectories: z.string().optional(),
  excludeFileTypes: z.string().optional(),
});

export type DesignSystemSyncFormType = z.infer<typeof designSystemSyncSchema>;

export const useDesignSystemSync = formAction$<
  DesignSystemSyncFormType,
  { url: string }
>(async (data) => {
  try {
    console.log("designSystemSync", data);
    const { sourceRepoFullName, targetRepoFullName } = data;
    const { owner: sourceRepoOwner, name: sourceRepoName } =
      parseRepositoryFullName(sourceRepoFullName);
    const { owner: targetRepoOwner, name: targetRepoName } =
      parseRepositoryFullName(targetRepoFullName);

    // Use the helper function to sync files
    const { pr } = await syncRepoFiles({
      sourceRepoOwner,
      sourceRepoName,
      targetRepoOwner,
      targetRepoName,
      filePaths: data.filePaths,
      excludeDirectories: data.excludeDirectories,
      excludeFileTypes: data.excludeFileTypes,
    });

    return {
      status: "success",
      message: "Files synced successfully",
      data: {
        url: pr.data.html_url,
      },
    };
  } catch (error) {
    console.error("Error dispatching workflow:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}, zodForm$(designSystemSyncSchema));

export const getDesignSystemFiles = server$(
  async (repoFullName: string, filters: FileFilterOptions) => {
    const { owner, name } = parseRepositoryFullName(repoFullName);
    const files = await getRepositoryFileTree({
      owner,
      repo: name,
      filters,
    });
    console.log(files);
    return files;
  },
);

export default component$(() => {
  const selectedForm = useSignal<"update" | "create">("update");

  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        divider={false}
        rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50"
      >
        <div q:slot="header">
          <div class="flex items-center justify-between py-2">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedForm.value === "update"
                ? "Update Design System Files"
                : "Create Repository from Design System"}
            </h4>
            <div class="flex gap-3 ml-8">
              {selectedForm.value === "update" ? (
                <Button
                  class="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
                  kind="secondary"
                  onClick$={() => (selectedForm.value = "create")}
                  type="button"
                >
                  Create New
                </Button>
              ) : (
                <Button
                  class="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
                  kind="secondary"
                  onClick$={() => (selectedForm.value = "update")}
                  type="button"
                >
                  Update Existing
                </Button>
              )}
            </div>
          </div>
        </div>
        <div q:slot="body">
          <div class={selectedForm.value === "update" ? "" : "hidden"}>
            <DesignSystemSyncForm />
          </div>
          <div class={selectedForm.value === "create" ? "" : "hidden"}>
            <CreateRepositoryForm />
          </div>
        </div>
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Design System Sync",
};
