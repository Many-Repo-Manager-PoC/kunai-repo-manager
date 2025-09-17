import { server$ } from "@qwik.dev/router";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { Octokit } from "octokit";
import { GetRepositoryFilesRequest, CreateTreeRequest } from "./types";
import { FileMode, FileType, GitHubTreeItem, TreeItemInput } from "~/db/types";

export const getRepositoryFileTree = server$(async function ({
  filters,
  tree_sha = "main",
  owner,
  repo,
}: GetRepositoryFilesRequest) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const tree = await octokit.rest.git.getTree({
    tree_sha,
    recursive: "true",
    owner,
    repo,
  });

  const filteredTree: GitHubTreeItem[] = tree.data.tree.filter(
    (item) =>
      item.type === FileType.blob &&
      item.mode === FileMode.blob &&
      // Only exclude if excludeFilePaths is provided and non-empty
      (!filters.excludeFilePaths?.length ||
        !filters.excludeFilePaths.some((path) => item.path.startsWith(path))) &&
      // Only exclude if excludeFileExtensions is provided and non-empty
      (!filters.excludeFileExtensions?.length ||
        !filters.excludeFileExtensions.some((extension) =>
          item.path.endsWith(extension),
        )) &&
      // Only include if includeFilePaths is provided and non-empty, otherwise include all
      (!filters.includeFilePaths?.length ||
        filters.includeFilePaths.some((path) => item.path.startsWith(path))),
  );

  return filteredTree;
});

export const getRepositoryTreeItems = server$(async function ({
  filters,
  tree_sha = "main",
  owner,
  repo,
}: GetRepositoryFilesRequest) {
  const filteredTree = await getRepositoryFileTree({
    filters,
    tree_sha,
    owner,
    repo,
  });

  // create the tree items for the new tree by copying the tsx files from the source repo
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const treeItems = await Promise.all(
    filteredTree.map(async (item) => {
      // get the file content from the source repo
      const fileContent = await octokit.rest.repos.getContent({
        owner,
        repo,
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
});

export const createTree = server$(async function ({
  owner,
  repo,
  tree,
  base_tree,
}: CreateTreeRequest) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);

  const response = await octokit.rest.git.createTree({
    owner,
    repo,
    tree,
    base_tree,
  });

  return response;
});
