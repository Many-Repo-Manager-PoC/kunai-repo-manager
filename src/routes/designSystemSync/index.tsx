import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { component$ } from "@qwik.dev/core";
import { server$, type DocumentHead } from "@qwik.dev/router";
import { Octokit } from "octokit";
import { z } from "zod";
import { BaseCard } from "~/components/cards/baseCard";
import { DesignSystemSyncForm } from "~/components/forms/designSystemSyncForm";
import { PageTitle } from "~/components/page/pageTitle";
import { FileMode, FileType, GitHubTreeItem } from "~/db/types";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
export const designSystemSyncSchema = z.object({
  sourceRepoFullName: z.string().min(1, "Source repository is required"),
  targetRepoFullName: z.string().min(1, "Target repository is required"),
  filePaths: z.array(z.string()).min(1, "At least one file path is required"),
});

export type DesignSystemSyncFormType = z.infer<typeof designSystemSyncSchema>;

export const useCreateComponentCopy = formAction$<
  DesignSystemSyncFormType,
  { url: string }
>(async (data, { sharedMap, params }) => {
  try {
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

    // get the config files from the source repo
    const sourceTree = await octokit.rest.git.getTree({
      owner: sourceRepoOwner,
      repo: sourceRepoName,
      tree_sha: "main",
      recursive: "true",
    });

    // const newTree = await octokit.rest.git.createTree({
    //   owner: targetRepoOwner,
    //   repo: targetRepoName,
    //   tree: componentTreeList,
    //   base_tree: mainBranch.data.commit.sha,
    // });

    // // create the new PR for the target repo with the new tree and the main branch as the base
    // const pr = await createPullRequest(
    //   octokit,
    //   sourceRepoOwner,
    //   sourceRepoName,
    //   targetRepo,
    //   targetBranchName,
    //   newTree.data.sha,
    //   mainBranch.data.commit.sha,
    // );

    return {
      status: "success",
      message: "Component copy created",
      data: {
        url: "",
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

  console.log(tree);

  const files: GitHubTreeItem[] = tree.data.tree.filter(
    (item) => item.type === FileType.blob && item.mode === FileMode.blob,
  );

  console.log(files);

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
      !item.path.endsWith(".tsx"),
  );

  return configFiles;
};
