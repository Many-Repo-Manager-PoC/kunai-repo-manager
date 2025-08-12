import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { component$ } from "@qwik.dev/core";
import { server$, type DocumentHead } from "@qwik.dev/router";
import { Octokit } from "octokit";
import { z } from "zod";
import { BaseCard } from "~/components/cards/baseCard";
import { DesignSystemSyncForm } from "~/components/forms/designSystemSyncForm";
import { PageTitle } from "~/components/page/pageTitle";
import { FileMode, FileType, GitHubTreeItem, TreeItemInput } from "~/db/types";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
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
    (item) =>
      item.type === FileType.blob &&
      item.mode === FileMode.blob &&
      !item.path.includes("src"),
  );

  // console.log(files);

  return files;
});

export default component$(() => {
  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        divider={false}
        rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50"
      >
        <div q:slot="header">
          <h4>Design System Sync</h4>
        </div>
        <div q:slot="body">
          <DesignSystemSyncForm />
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
