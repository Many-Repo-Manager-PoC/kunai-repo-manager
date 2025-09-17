import { server$ } from "@qwik.dev/router";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import { Octokit } from "octokit";
import {
  CreateRepositoryRequest,
  GetRepositoryFilesRequest,
  RepositoryRequest,
} from "./types";
import { FileMode, FileType, GitHubTreeItem, TreeItemInput } from "~/db/types";

export const createRepository = server$(async function (
  input: CreateRepositoryRequest,
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);

  if (input.type === "org") {
    return await octokit.rest.repos.createInOrg(input.request);
  } else {
    return await octokit.rest.repos.createForAuthenticatedUser(input.request);
  }
});

export const getBranch = server$(async function (
  request: RepositoryRequest<"getBranch">,
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  return await octokit.rest.repos.getBranch(request);
});
