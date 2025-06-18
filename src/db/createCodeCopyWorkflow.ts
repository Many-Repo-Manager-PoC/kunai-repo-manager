import metadata from "./metadata.json";
import { routeAction$ } from "@builder.io/qwik-city";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

export const createCodeCopyWorkflow = routeAction$(async (data, event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

    // get the tree of the source repo
    const tree = await octokit.rest.git.getTree({
      owner: metadata.owner,
      repo: "kunai-repo-manager",
      tree_sha: "main",
      recursive: "true",
    });

    const paths = ["src/components"];

    // get the tsx files from the source repo
    const tsxComponentFiles = tree.data.tree.filter(
      (item) =>
        item.type === "blob" &&
        paths.some((path) => item.path.startsWith(path)) && // This will likely be a dynamic path that will be passed in as a parameter
        item.path.endsWith(".tsx"),
    );

    console.log("tsxComponentFiles", tsxComponentFiles);

    // First get the SHA of the main branch for the target repo
    const mainBranch = await octokit.rest.repos.getBranch({
      owner: metadata.owner,
      repo: data.repo_name as string,
      branch: "main",
    });

    // create the tree items for the new tree by copying the tsx files from the source repo
    const treeItems = await Promise.all(
      tsxComponentFiles.map(async (item) => {
        // get the file content from the source repo
        const fileContent = await octokit.rest.repos.getContent({
          owner: metadata.owner,
          repo: "kunai-repo-manager",
          path: item.path,
        });

        if (
          !Array.isArray(fileContent.data) &&
          fileContent.data.type === "file" &&
          "content" in fileContent.data
        ) {
          return {
            path: item.path,
            type: item.type as "blob" | "commit" | "tree",
            content: Buffer.from(fileContent.data.content, "base64").toString(), // Decode the base64 content
            mode: "100644" as
              | "100644"
              | "100755"
              | "040000"
              | "160000"
              | "120000",
            // sha: item.sha,
          };
        }
      }),
    );
    const filteredTreeItems = treeItems.filter(
      (item): item is NonNullable<typeof item> => item !== undefined,
    );

    const newTree = await octokit.rest.git.createTree({
      owner: metadata.owner,
      repo: data.repo_name as string,
      tree: filteredTreeItems,
      base_tree: mainBranch.data.commit.sha,
    });

    // Create a commit with the new tree
    const commit = await octokit.rest.git.createCommit({
      owner: metadata.owner,
      repo: data.repo_name as string,
      message: "Copy components",
      tree: newTree.data.sha,
      parents: [mainBranch.data.commit.sha],
    });

    // Then create a new branch using that SHA for the target repo
    const targetBranch = await octokit.rest.git.createRef({
      owner: metadata.owner,
      repo: data.repo_name as string,
      ref: `refs/heads/copy-component-${data.repo_name}`,
      sha: commit.data.sha,
    });

    // create a new PR for the target repo
    await octokit.rest.pulls.create({
      owner: metadata.owner,
      repo: data.repo_name as string,
      head: targetBranch.data.ref,
      base: "main",
      title: "Copy component",
      body: "Copy component",
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error dispatching workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});
