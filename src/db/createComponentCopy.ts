import { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { z } from "zod";
import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import {
  FileMode,
  FileType,
  type GitHubTreeItem,
  type TreeItemInput,
} from "~/db/types";
import { getDependencyPaths } from "~/util/oxc-utils";

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

export const useCreateComponentCopy = formAction$<CreateComponentCopyFormType>(
  async (data, { sharedMap, params }) => {
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
      const componentTreeList = await getComponentListForDependencyTree(
        componentPaths,
        basePathOverride,
      );

      const newTree = await octokit.rest.git.createTree({
        owner: targetRepoOwner,
        repo: targetRepoName,
        tree: componentTreeList,
        base_tree: mainBranch.data.commit.sha,
      });

      // // create the new PR for the target repo with the new tree and the main branch as the base
      await createPullRequest(
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
      };
    } catch (error) {
      console.error("Error dispatching workflow:", error);
      return {
        status: "error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
  zodForm$(createComponentCopySchema),
);

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

  const tsxComponentFiles = tree.data.tree.filter(
    (item) =>
      item.type === FileType.blob &&
      item.mode === FileMode.blob &&
      componentPaths.some((path) => item.path.startsWith(path)) &&
      item.path.endsWith(".tsx"),
  );

  return tsxComponentFiles;
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
  await octokit.rest.pulls.create({
    owner: targetRepoOwner,
    repo: targetRepoName,
    head: targetBranch.data.ref,
    base: "main",
    title: `Component Copy: ${sourceRepoOwner}/${sourceRepoName} -> ${targetRepoOwner}/${targetRepoName}`,
    body: "",
  });
};

// get the component tree list for the source repo
export const getComponentListForDependencyTree = server$(async function (
  userSelectedPaths: string[],
  basePathOverride?: string,
): Promise<Array<TreeItemInput>> {
  // Access the Octokit instance from the shared map
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const { repoOwner: sourceRepoOwner, name: sourceRepoName } = this.params;

  const allTsxComponentFiles = await findComponentFiles(
    octokit,
    sourceRepoOwner,
    sourceRepoName,
    ["src/components"], // TODO: make this dynamic in a future phase.  Right now we are assuming all relevant components are in the src/components directory at the root of the repo.
  );

  // filter the component files to only include the user selected paths
  const userSelectedTsxComponentFiles = allTsxComponentFiles.filter((item) => {
    const path = item.path;
    const isUserSelected = userSelectedPaths.some((selectedPath) =>
      path.startsWith(selectedPath),
    );
    return isUserSelected;
  });

  const treeItems: TreeItemInput[] = [];
  const processedFiles: Set<string> = new Set();

  const buildDependencyTree = async (item: GitHubTreeItem) => {
    if (processedFiles.has(item.path)) return;
    processedFiles.add(item.path);

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

      const stringContent = Buffer.from(
        fileContent.data.content,
        "base64",
      ).toString();

      treeItems.push({
        path: newPath,
        type: item.type as FileType,
        content: stringContent, // Decode the base64 content
        mode: item.mode as FileMode,
      } satisfies TreeItemInput);

      const dependencyPaths = getDependencyPaths(stringContent, item.path);
      console.debug("dependencyPaths", dependencyPaths);

      // TODO: Probably want to update this to avoid the inner search for the import item
      for (const dependencyPath of dependencyPaths) {
        const dependencyItem = allTsxComponentFiles.find(
          (i) => i.path === dependencyPath,
        );
        console.debug("dependencyItem", dependencyItem);
        if (dependencyItem) {
          await buildDependencyTree(dependencyItem);
        }
      }
    }
  };

  await Promise.all(userSelectedTsxComponentFiles.map(buildDependencyTree));
  console.log("treeItems", treeItems);
  return treeItems;
});
