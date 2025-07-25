import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { z } from "zod";
import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  FileMode,
  FileType,
  type GitHubTreeItem,
  type TreeItemInput,
} from "~/db/types";

export const createComponentCopySchema = z.object({
  targetRepo: z.string().min(1, "Target repository is required"),
  targetBranch: z.string().min(1, "Target branch name is required"),
  targetPath: z.string().optional(),
  componentPaths: z
    .array(z.string())
    .min(1, "At least one component is required"),
});

export type CreateComponentCopyFormType = z.infer<
  typeof createComponentCopySchema
>;

export const useCreateComponentCopy = formAction$<
  CreateComponentCopyFormType,
  { url: string }
>(async (data, { sharedMap, params }) => {
  try {
    const octokit: Octokit = sharedMap.get(OCTOKIT_CLIENT);
    const { repoOwner: sourceRepoOwner, name: sourceRepoName } = params;
    const {
      targetRepo,
      targetBranch: targetBranchName,
      targetPath: basePathOverride,
      componentPaths,
    } = data;
    const [targetRepoOwner, targetRepoName] = targetRepo.split("/");

    // First get the SHA of the main branch for the target repo
    const mainBranch = await octokit.rest.repos.getBranch({
      owner: targetRepoOwner,
      repo: targetRepoName,
      branch: "main",
    });

    // get a list of the component files with their content in the format needed for the createTree API
    const componentTreeList = await getComponentTreeList(
      octokit,
      sourceRepoOwner,
      sourceRepoName,
      componentPaths,
      basePathOverride,
    );

    const newTree = await octokit.rest.git.createTree({
      owner: targetRepoOwner,
      repo: targetRepoName,
      tree: componentTreeList,
      base_tree: mainBranch.data.commit.sha,
    });

    // create the new PR for the target repo with the new tree and the main branch as the base
    const pr = await createPullRequest(
      octokit,
      sourceRepoOwner,
      sourceRepoName,
      targetRepo,
      targetBranchName,
      newTree.data.sha,
      mainBranch.data.commit.sha,
    );

    return {
      status: "success",
      message: "Component copy created",
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
}, zodForm$(createComponentCopySchema));

// get the component tree for the source repo - route loader
// eslint-disable-next-line qwik/loader-location
export const useGetRepositoryComponentTree = routeLoader$(
  async ({ sharedMap, params }) => {
    const componentPaths = ["src/components"]; // TODO: make this dynamic in a future phase.  Right now we are assuming all relevant components are in the src/components directory at the root of the repo.
    const octokit: Octokit = sharedMap.get(OCTOKIT_CLIENT);
    const { repoOwner, name: repoName } = params;

    const componentFiles = await findComponentFiles(
      octokit,
      repoOwner,
      repoName,
      componentPaths,
    );

    return componentFiles;
  },
);

// get the component tree for the source repo
const findComponentFiles = async (
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  componentPaths: string[],
) => {
  const tree = await octokit.rest.git.getTree({
    owner: repoOwner,
    repo: repoName,
    tree_sha: "main",
    recursive: "true",
  });

  const tsxComponentFiles: GitHubTreeItem[] = tree.data.tree.filter(
    (item) =>
      item.type === FileType.blob &&
      item.mode === FileMode.blob &&
      componentPaths.some((path) => item.path.startsWith(path)) &&
      item.path.endsWith(".tsx"),
  );

  return tsxComponentFiles;
};

// get the component tree list for the source repo
const getComponentTreeList = async (
  octokit: Octokit,
  sourceRepoOwner: string,
  sourceRepoName: string,
  componentPaths: string[],
  basePathOverride?: string,
) => {
  const tsxComponentFiles = await findComponentFiles(
    octokit,
    sourceRepoOwner,
    sourceRepoName,
    componentPaths,
  );

  // create the tree items for the new tree by copying the tsx files from the source repo
  const treeItems = await Promise.all(
    tsxComponentFiles.map(async (item) => {
      // get the file content from the source repo
      const fileContent = await octokit.rest.repos.getContent({
        owner: sourceRepoOwner,
        repo: sourceRepoName,
        path: item.path,
      });

      if (
        !Array.isArray(fileContent.data) &&
        fileContent.data.type === "file" &&
        "content" in fileContent.data
      ) {
        const newPath = basePathOverride
          ? item.path.replace("src/components", basePathOverride) // TODO: See above comment about dynamic component paths
          : item.path;

        return {
          path: newPath,
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
    message: `Copy components from ${sourceRepoOwner}/${sourceRepoName}`,
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
    title: `Component Copy: ${sourceRepoOwner}/${sourceRepoName} -> ${targetRepoOwner}/${targetRepoName}`,
    body: "",
  });

  return pr;
};
