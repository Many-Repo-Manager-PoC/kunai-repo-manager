import type { Octokit } from "octokit";
import type { TreeItemInput } from "~/db/types";

export type RepositoryResponse<T extends keyof Octokit["rest"]["repos"]> =
  Awaited<ReturnType<InstanceType<typeof Octokit>["rest"]["repos"][T]>>;

export type RepositoryRequest<T extends keyof Octokit["rest"]["repos"]> =
  Parameters<InstanceType<typeof Octokit>["rest"]["repos"][T]>[0];

export type CreateRepositoryRequest =
  | { type: "user"; request: RepositoryRequest<"createForAuthenticatedUser"> }
  | { type: "org"; request: RepositoryRequest<"createInOrg"> };

export type FileFilterOptions = {
  excludeFilePaths?: string[];
  excludeFileExtensions?: string[];
  includeFilePaths?: string[];
};

export type GetRepositoryFilesRequest = {
  owner: string;
  repo: string;
  tree_sha?: string;
  filters: FileFilterOptions;
};

export type CreatePullRequestWorkflowRequest = {
  sourceRepoOwner: string;
  sourceRepoName: string;
  targetRepoName: string;
  targetRepoOwner: string;
  targetBranchName: string;
  treeSha: string;
  mainTargetBranchSha: string;
};

export type CreateTreeRequest = {
  owner: string;
  repo: string;
  tree: TreeItemInput[];
  base_tree?: string;
};
