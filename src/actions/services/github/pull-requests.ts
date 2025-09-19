import { server$ } from "@qwik.dev/router";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { Octokit } from "octokit";
import { CreatePullRequestWorkflowRequest } from "./types";

export const createPullRequestWorkflow = server$(async function (
  request: CreatePullRequestWorkflowRequest,
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const {
    sourceRepoOwner,
    sourceRepoName,
    targetRepoName,
    targetRepoOwner,
    targetBranchName,
    treeSha,
    mainTargetBranchSha,
  } = request;

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
});
