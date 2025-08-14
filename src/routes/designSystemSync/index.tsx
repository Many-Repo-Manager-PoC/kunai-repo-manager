import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { component$, useSignal } from "@qwik.dev/core";
import { server$, type DocumentHead } from "@qwik.dev/router";
import { Octokit } from "octokit";
import { z } from "zod";
import { BaseCard } from "~/components/cards/baseCard";
import { DesignSystemSyncForm } from "~/routes/designSystemSync/updateFromDesignSystemForm";
import { CreateRepositoryForm } from "~/routes/designSystemSync/createFromDesignSystemForm";
import { PageTitle } from "~/components/page/pageTitle";
import { FileMode, FileType, GitHubTreeItem, TreeItemInput } from "~/db/types";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import metadata from "~/db/metadata.json";
import { Button } from "@kunai-consulting/kunai-design-system";

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
    sourceRepoFullName: z.string().min(1, "Source repository is required"),
    filePaths: z.array(z.string()).min(1, "At least one file path is required"),
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

export const useCreateRepository = formAction$<
  CreateRepositoryFormType,
  { url: string }
>(async (formData, event) => {
  try {
    console.log("createRepository", formData);
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    const isOrg = formData.repoType === "org";
    let url = "";
    let targetRepoName = "";
    let targetRepoOwner = "";
    const [sourceRepoOwner, sourceRepoName] =
      formData.sourceRepoFullName.split("/");

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
      targetRepoName = repo.data.name;
      targetRepoOwner = repo.data.owner.login;
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
      targetRepoName = repo.data.name;
      targetRepoOwner = repo.data.owner.login;
    }

    // First get the SHA of the main branch for the target repo
    const mainBranch = await octokit.rest.repos.getBranch({
      owner: targetRepoOwner,
      repo: targetRepoName,
      branch: "main",
    });

    const sourceConfigFiles = await getRepoConfigFiles(
      octokit,
      sourceRepoOwner,
      sourceRepoName,
      formData.filePaths,
    );
    const newTree = await octokit.rest.git.createTree({
      owner: targetRepoOwner,
      repo: targetRepoName,
      tree: sourceConfigFiles,
      base_tree: mainBranch.data.commit.sha,
    });

    // // create the new PR for the target repo with the new tree and the main branch as the base
    const pr = await createPullRequest(
      octokit,
      sourceRepoOwner,
      sourceRepoName,
      `${targetRepoOwner}/${targetRepoName}`,
      "feature/sync-files",
      newTree.data.sha,
      mainBranch.data.commit.sha,
    );

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
});

export type DesignSystemSyncFormType = z.infer<typeof designSystemSyncSchema>;

export const useDesignSystemSync = formAction$<
  DesignSystemSyncFormType,
  { url: string }
>(async (data, { sharedMap, params }) => {
  try {
    console.log("designSystemSync", data);
    const octokit: Octokit = sharedMap.get(OCTOKIT_CLIENT);
    const { sourceRepoFullName, targetRepoFullName } = data;
    const [targetRepoOwner, targetRepoName] = targetRepoFullName.split("/");
    const [sourceRepoOwner, sourceRepoName] = sourceRepoFullName.split("/");

    // First get the SHA of the main branch for the target repo
    const mainBranch = await octokit.rest.repos.getBranch({
      owner: targetRepoOwner,
      repo: targetRepoName,
      branch: "main",
    });

    const sourceConfigFiles = await getRepoConfigFiles(
      octokit,
      sourceRepoOwner,
      sourceRepoName,
      data.filePaths,
    );
    const newTree = await octokit.rest.git.createTree({
      owner: targetRepoOwner,
      repo: targetRepoName,
      tree: sourceConfigFiles,
      base_tree: mainBranch.data.commit.sha,
    });

    // // create the new PR for the target repo with the new tree and the main branch as the base
    const pr = await createPullRequest(
      octokit,
      sourceRepoOwner,
      sourceRepoName,
      targetRepoFullName,
      "feature/sync-files",
      newTree.data.sha,
      mainBranch.data.commit.sha,
    );

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

export const getDesignSystemFiles = server$(async function (
  repoFullName: string,
) {
  const [repoOwner, repoName] = repoFullName.split("/");
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  if (!octokit) {
    throw new Error("Octokit not found");
  }
  const tree = await octokit.rest.git.getTree({
    owner: repoOwner,
    repo: repoName,
    tree_sha: "main",
    recursive: "true",
  });

  // console.log(tree);

  const files: GitHubTreeItem[] = tree.data.tree.filter(
    (item) => item.type === FileType.blob && item.mode === FileMode.blob,
  );

  // console.log(files);

  return files;
});

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

const getRepoConfigFiles = async (
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  filePaths: string[],
) => {
  const tree = await octokit.rest.git.getTree({
    owner: repoOwner,
    repo: repoName,
    tree_sha: "main",
    recursive: "true",
  });

  const configFiles: GitHubTreeItem[] = tree.data.tree.filter(
    (item) =>
      item.type === FileType.blob &&
      item.mode === FileMode.blob &&
      filePaths.some((path) => item.path.startsWith(path)),
  );

  // create the tree items for the new tree by copying the tsx files from the source repo
  const treeItems = await Promise.all(
    configFiles.map(async (item) => {
      // get the file content from the source repo
      const fileContent = await octokit.rest.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: item.path,
      });

      if (
        !Array.isArray(fileContent.data) &&
        fileContent.data.type === "file" &&
        "content" in fileContent.data
      ) {
        return {
          path: item.path,
          type: item.type as FileType,
          content: Buffer.from(fileContent.data.content, "base64").toString(), // Decode the base64 content
          mode: item.mode as FileMode,
        } satisfies TreeItemInput;
      }
    }),
  );

  const filteredTreeItems = treeItems.filter(
    (item): item is TreeItemInput => item !== undefined,
  );
  return filteredTreeItems;
};

const createPullRequest = async (
  octokit: Octokit,
  sourceRepoOwner: string,
  sourceRepoName: string,
  targetRepo: string,
  targetBranchName: string,
  treeSha: string,
  mainTargetBranchSha: string,
) => {
  const [targetRepoOwner, targetRepoName] = targetRepo.split("/");

  // Create a commit with the new tree
  const commit = await octokit.rest.git.createCommit({
    owner: targetRepoOwner,
    repo: targetRepoName,
    message: `Sync files from ${sourceRepoOwner}/${sourceRepoName}`,
    tree: treeSha,
    parents: [mainTargetBranchSha],
  });

  // Then create a new branch using that SHA for the target repo
  const targetBranch = await octokit.rest.git.createRef({
    owner: targetRepoOwner,
    repo: targetRepoName,
    ref: `refs/heads/${targetBranchName}`,
    sha: commit.data.sha,
  });

  // create a new PR for the target repo
  const pr = await octokit.rest.pulls.create({
    owner: targetRepoOwner,
    repo: targetRepoName,
    head: targetBranch.data.ref,
    base: "main",
    title: `Sync files: ${sourceRepoOwner}/${sourceRepoName} -> ${targetRepoOwner}/${targetRepoName}`,
    body: "",
  });

  return pr;
};
