export interface Repo {
  full_name: string;
  name: string;
  repo: string;
  html_url: string;
  url: string;
  language: string;
  description: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  homepage: string;
  topics: string[];
  open_issues_count: number;
  license: License;
  owner: Owner;
  repoOwner: string;
}

export interface License {
  name: string;
}

export interface Owner {
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface Dependency {
  repo: string;
  dependencies: Dependencies;
  error: string;
}

export interface Dependencies {
  sbom: SBOM;
  relationships: Relationship[];
}

export interface SBOM {
  spdxVersion: string;
  dataLicense: string;
  SPDXID: string;
  relationshipType: string;
  name: string;
  documentNamespace: string;
  creationInfo: CreationInfo;
  packages: Package[];
}

export interface CreationInfo {
  created: string;
  creators: string[];
}

export interface Relationship {
  spdxElementId: string;
  relationshipType: string;
  relatedSpdxElement: string;
}

export interface PackageJson {
  repo: string;
  packageJson: PackageJsonData;
  error: string;
}

export interface PackageJsonData {
  name: string;
  version: string;
  dependencies: any;
  devDependencies: any;
}

export interface Package {
  name: string;
  SPDXID: string;
  licenseConcluded: string;
  externalRefs: any[];
  downloadLocation: string;
  versionInfo: string;
  filesAnalyzed: boolean;
}

export interface Member {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface ShaCommit {
  html_url: string;
  sha: string;
  commitData: CommitData;
  author: CommitAuthor;
}

export interface CommitData {
  message: string;
  author: CommitAuthorData;
}

export interface CommitAuthorData {
  name: string;
  date: string;
}

export interface CommitAuthor {
  login: string;
}
