import type { CreateRepositoryRequest, RepositoryResponse } from "./types";
import type { GetRepositoryReturns } from "@dbschema/queries";
import type { InsertOrUpdateRepositoryArgs } from "@dbschema/queries";

export const parseRepositoryFullName = (
  fullName: string,
): { owner: string; name: string } => {
  const [owner, name] = fullName.split("/");
  return { owner, name };
};

/**
 * Maps database repository data to GitHub CreateRepositoryRequest format
 * @param sourceRepo - Repository data from database (getRepoByName result)
 * @returns CreateRepositoryRequest for GitHub API
 */
export const mapGelDataToGithubCreateRepoRequest = (
  sourceRepo: GetRepositoryReturns,
): CreateRepositoryRequest => {
  if (!sourceRepo) {
    throw new Error("Source repository not found");
  }

  const isOrg = sourceRepo.owner.role_type === "Organization";

  const baseRequest = {
    name: sourceRepo.name,
    description: sourceRepo.description ?? undefined,
    homepage: sourceRepo.homepage ?? undefined,
    private: sourceRepo.private ?? false,
    visibility: sourceRepo.visibility ?? undefined,
    has_issues: sourceRepo.has_issues ?? true,
    has_projects: sourceRepo.has_projects ?? true,
    has_wiki: sourceRepo.has_wiki ?? true,
    has_downloads: sourceRepo.has_downloads ?? true,
    has_discussions: sourceRepo.has_discussions,
    is_template: sourceRepo.is_template ?? false,
    auto_init: sourceRepo.auto_init ?? false,
    license_template: sourceRepo.license?.name ?? undefined,
    allow_squash_merge: sourceRepo.allow_squash_merge ?? true,
    allow_merge_commit: sourceRepo.allow_merge_commit ?? true,
    allow_rebase_merge: sourceRepo.allow_rebase_merge ?? true,
    allow_auto_merge: sourceRepo.allow_auto_merge ?? false,
    allow_forking: sourceRepo.allow_forking ?? undefined,
    delete_branch_on_merge: sourceRepo.delete_branch_on_merge ?? false,
    squash_merge_commit_title: sourceRepo.squash_merge_commit_title as
      | "PR_TITLE"
      | "COMMIT_OR_PR_TITLE"
      | undefined,
    squash_merge_commit_message: sourceRepo.squash_merge_commit_message as
      | "PR_BODY"
      | "COMMIT_MESSAGES"
      | "BLANK"
      | undefined,
    merge_commit_title: sourceRepo.merge_commit_title as
      | "PR_TITLE"
      | "MERGE_MESSAGE"
      | undefined,
    merge_commit_message: sourceRepo.merge_commit_message as
      | "PR_TITLE"
      | "PR_BODY"
      | "BLANK"
      | undefined,
    team_id: sourceRepo.team_id ?? undefined,
  };

  if (isOrg) {
    return {
      type: "org",
      request: {
        ...baseRequest,
        org: sourceRepo.owner.login,
      },
    };
  } else {
    return {
      type: "user",
      request: baseRequest,
    };
  }
};

/**
 * Maps GitHub repository response to database InsertOrUpdateRepositoryArgs format
 * @param repo - GitHub repository response data from createRepository
 * @returns InsertOrUpdateRepositoryArgs for database insertion
 */
export const mapGithubResponseToGelData = (
  repo: RepositoryResponse<
    "createForAuthenticatedUser" | "createInOrg"
  >["data"],
): InsertOrUpdateRepositoryArgs => {
  return {
    repository_id: repo.id,
    archived: repo.archived,
    contents_url: repo.contents_url,
    contributors_url: repo.contributors_url,
    created_at: repo.created_at,
    default_branch: repo.default_branch,
    deployments_url: repo.deployments_url,
    description: repo.description ?? "",
    disabled: repo.disabled,
    downloads_url: repo.downloads_url,
    events_url: repo.events_url,
    fork: repo.fork,
    forks: repo.forks,
    forks_count: repo.forks_count,
    full_name: repo.full_name,
    has_discussions: repo.has_discussions,
    has_issues: repo.has_issues,
    has_pages: repo.has_pages,
    has_projects: repo.has_projects,
    has_wiki: repo.has_wiki,
    homepage: repo.homepage ?? "",
    hooks_url: repo.hooks_url,
    html_url: repo.html_url,
    issue_comment_url: repo.issue_comment_url,
    issue_events_url: repo.issue_events_url,
    issues_url: repo.issues_url,
    keys_url: repo.keys_url,
    labels_url: repo.labels_url,
    language: repo.language ?? "",
    languages_url: repo.languages_url,
    license_key: repo.license?.key ?? "",
    license_name: repo.license?.name ?? "",
    license_node_id: repo.license?.node_id ?? "",
    license_spdx_id: repo.license?.spdx_id ?? "",
    license_url: repo.license?.url ?? "",
    name: repo.name,
    node_id: repo.node_id,
    notifications_url: repo.notifications_url,
    open_issues: repo.open_issues,
    open_issues_count: repo.open_issues_count,
    owner_avatar_url: repo.owner.avatar_url,
    owner_email: repo.owner.email ?? "",
    owner_login: repo.owner.login,
    owner_name: repo.owner.name ?? "",
    owner_role_type: repo.owner.type,
    owner_site_admin: repo.owner.site_admin,
    owner_user_id: repo.owner.id,
    private: repo.private,
    pushed_at: repo.pushed_at,
    size: repo.size,
    ssh_url: repo.ssh_url,
    stargazers_count: repo.stargazers_count,
    template_repository_id: 0, // Default value, can be overridden
    updated_at: repo.updated_at,
    url: repo.url,
    watchers_count: repo.watchers_count,
    // Optional fields
    allow_auto_merge: repo.allow_auto_merge ?? null,
    allow_forking: repo.allow_forking ?? null,
    allow_merge_commit: repo.allow_merge_commit ?? null,
    allow_rebase_merge: repo.allow_rebase_merge ?? null,
    allow_squash_merge: repo.allow_squash_merge ?? null,
    archive_url: repo.archive_url,
    assignees_url: repo.assignees_url,
    blobs_url: repo.blobs_url,
    branches_url: repo.branches_url,
    clone_url: repo.clone_url,
    collaborators_url: repo.collaborators_url,
    comments_url: repo.comments_url,
    commits_url: repo.commits_url,
    compare_url: repo.compare_url,
    delete_branch_on_merge: repo.delete_branch_on_merge,
    forks_url: repo.forks_url,
    git_commits_url: repo.git_commits_url,
    git_refs_url: repo.git_refs_url,
    git_tags_url: repo.git_tags_url,
    git_url: repo.git_url,
    has_downloads: repo.has_downloads,
    is_template: repo.is_template,
    license_html_url: repo.license?.html_url,
    master_branch: repo.master_branch,
    merges_url: repo.merges_url,
    milestones_url: repo.milestones_url,
    mirror_url: repo.mirror_url,
    owner_events_url: repo.owner.events_url,
    owner_followers_url: repo.owner.followers_url,
    owner_following_url: repo.owner.following_url,
    owner_gists_url: repo.owner.gists_url,
    owner_gravatar_id: repo.owner.gravatar_id,
    owner_html_url: repo.owner.html_url,
    owner_node_id: repo.owner.node_id,
    owner_organizations_url: repo.owner.organizations_url,
    owner_received_events_url: repo.owner.received_events_url,
    owner_repos_url: repo.owner.repos_url,
    owner_starred_at: repo.owner.starred_at,
    owner_starred_url: repo.owner.starred_url,
    owner_subscriptions_url: repo.owner.subscriptions_url,
    owner_url: repo.owner.url,
    owner_user_view_type: repo.owner.user_view_type,
    pulls_url: repo.pulls_url,
    releases_url: repo.releases_url,
    stargazers_url: repo.stargazers_url,
    statuses_url: repo.statuses_url,
    subscribers_url: repo.subscribers_url,
    subscription_url: repo.subscription_url,
    svn_url: repo.svn_url,
    tags_url: repo.tags_url,
    teams_url: repo.teams_url,
    topics: repo.topics?.join(","),
    trees_url: repo.trees_url,
    visibility: repo.visibility,
  };
};
