import metadata from "./metadata.json";
import { routeAction$ } from "@builder.io/qwik-city";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

export const createCodeCopyWorkflow = routeAction$(async (data, event) => {
  const session = event.sharedMap.get("session");
  const gh_access_token = session?.accessToken;
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);

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

    // get the contents of the formInputs directory from the main branch on the source repo
    const contents = await octokit.rest.repos.getContent({
      owner: metadata.owner,
      repo: "kunai-repo-manager",
      path: "src/components/formInputs",
    });

    // First check if it's an array
    if (Array.isArray(contents.data)) {
      // Now TypeScript knows data is an array of files/directories
      for (const item of contents.data) {
        if (item.type === "file") {
          // Get the file contents
          const fileContent = await octokit.rest.repos.getContent({
            owner: metadata.owner,
            repo: "kunai-repo-manager",
            path: item.path,
          });

          // Now we need to check if fileContent.data is a file with content
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
        }
      }
    } else {
      // Handle single file case
      if (contents.data.type === "file" && "content" in contents.data) {
        // create the file in the target repo
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: metadata.owner,
          repo: data.repo_name as string,
          path: contents.data.path,
          message: "Copy component",
          content: contents.data.content,
          branch: targetBranch.data.ref,
        });
      }
    }

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
