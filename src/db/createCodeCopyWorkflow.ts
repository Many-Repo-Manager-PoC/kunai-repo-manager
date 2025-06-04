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

    // get the tsx files from the source repo
    const tsxComponentFiles = tree.data.tree.filter(
      (item) =>
        item.type === "blob" &&
        item.path.startsWith("src/components/formInputs") && // This will likely be a dynamic path that will be passed in as a parameter
        item.path.endsWith(".tsx"),
    );

    console.log("tsxComponentFiles", tsxComponentFiles);

    // First get the SHA of the main branch for the target repo
    const mainBranch = await octokit.rest.repos.getBranch({
      owner: metadata.owner,
      repo: data.repo_name as string,
      branch: "main",
    });

    // Then create a new branch using that SHA for the target repo
    const targetBranch = await octokit.rest.git.createRef({
      owner: metadata.owner,
      repo: data.repo_name as string,
      ref: `refs/heads/copy-component-${data.repo_name}`,
      sha: mainBranch.data.commit.sha,
    });

    await Promise.all(
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
          // create the file in the target repo
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: metadata.owner,
            repo: data.repo_name as string,
            path: item.path,
            message: "Copy component",
            content: fileContent.data.content,
            branch: targetBranch.data.ref,
          });
        }
      }),
    );

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
