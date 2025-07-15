import { type FailReturn } from "@qwik.dev/router";
import { type ErrorContext } from "~/util/errors";

export interface Repo {
  id?: number | null;
  full_name?: string | null;
  name: string | null;
  repo?: string | null;
  html_url?: string | null;
  url?: string | null;
  language?: string | null;
  description?: string | null;
  updated_at?: string | null;
  stargazers_count?: number | null;
  forks_count?: number | null;
  watchers_count?: number | null;
  homepage?: string | null;
  topics?: string[] | null;
  open_issues_count?: number | null;
  license?: {
    name: string | null;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  repoOwner?: string;
}

export interface Dependency {
  repo: string | null;
  dependencies: {
    sbom: {
      spdxVersion: string | null;
      dataLicense: string | null;
      SPDXID: string | null;
      relationshipType: string | null;
      name: string | null;
      documentNamespace: string | null;
      creationInfo: {
        created: string | null;
        creators: string[] | null;
      } | null;
      packages: Package[] | null;
    } | null;
    relationships: Relationship[] | null;
  } | null;
  error: string | null;
}

export interface Relationship {
  spdxElementId: string | null;
  relationshipType: string | null;
  relatedSpdxElement: string | null;
}

export interface PackageJson {
  repo: string | null;
  packageJson: {
    name: string | null;
    version: string | null;
    dependencies: Record<string, string> | null;
    devDependencies: Record<string, string> | null;
  } | null;
  error: string | null;
}

export interface NewRepository {
  repoName: string | null;
  repoDescription: string | null;
  homepage: string | null;
  isPrivate: boolean | null;
  visibility: string | null;
  hasIssues: boolean | null;
  hasProjects: boolean | null;
  hasWiki: boolean | null;
  hasDownloads: boolean | null;
  isTemplate: boolean | null;
  teamId: number | null;
  autoInit: boolean | null;
  gitignoreTemplate: string | null;
  licenseTemplate: string | null;
  allowSquashMerge: boolean | null;
  allowMergeCommit: boolean | null;
  allowRebaseMerge: boolean | null;
  allowAutoMerge: boolean | null;
  deleteBranchOnMerge: boolean | null;
  useSquashPrTitleAsDefault: boolean | null;
  squashMergeCommitTitle: string | null;
  squashMergeCommitMessage: string | null;
  mergeCommitTitle: string | null;
  mergeCommitMessage: string | null;
  customProperties: Record<string, string> | null;
  hasDiscussions: boolean | null;
}

export interface Package {
  name: string | null;
  SPDXID: string | null;
  licenseConcluded: string | null;
  externalRefs: [] | null;
  downloadLocation: string | null;
  versionInfo: string | null;
  filesAnalyzed: boolean | null;
}

export interface Member {
  id: number | null;
  login: string | null;
  avatar_url: string | null;
  html_url: string | null;
}

export interface Commit {
  html_url: string | null;
  sha: string | null;
  commit: {
    message: string | null;
    author: {
      name: string | null;
      date: string | null;
    } | null;
  } | null;
  author: {
    login: string | null;
  } | null;
}

export enum FileMode {
  blob = "100644",
  executable = "100755",
  tree = "040000",
  commit = "160000",
  symlink = "120000",
}

export enum FileType {
  tree = "tree",
  commit = "commit",
  blob = "blob",
}

// this is the format of the tree item returned by the GitHub API
export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url?: string;
}

// this is the format of the tree item input to the GitHub API
export interface TreeItemInput {
  path: string;
  type: FileType;
  content: string;
  mode: FileMode;
}

export type Result<T, E = ErrorContext> =
  | { data: T; failed: false }
  | FailReturn<E>;
