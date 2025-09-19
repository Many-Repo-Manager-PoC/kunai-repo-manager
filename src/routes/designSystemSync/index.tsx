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
  type FileFilterOptions,
  createRepository,
} from "~/actions/services/github";
import { createPullRequestWorkflow } from "~/actions/services/github/pull-requests";
import {
  parseRepositoryFullName,
  mapGelDataToGithubCreateRepoRequest,
  mapGithubResponseToGelData,
} from "~/actions/services/github/utils";
import { getRepoByName } from "~/actions/repository/queries";
import { getClient } from "~/actions/client";
import * as queries from "@dbschema/queries";
import { upsertRepository } from "~/actions/repository/repository.service";

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
    // Create a modified source repository with the new name and description
    const modifiedSourceRepo = {
      ...sourceRepository,
      name: formData.repoName,
      description: formData.repoDescription ?? "",
      auto_init: true,
    };

    // Use the type mapper to create the GitHub request
    const createRequest = mapGelDataToGithubCreateRepoRequest({
      ...modifiedSourceRepo,
    });

    // Create repo in github
    const repo = await createRepository(createRequest);

    await upsertRepository(repo.data.name, repo.data.owner.login);

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
