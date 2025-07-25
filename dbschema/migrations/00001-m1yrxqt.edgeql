CREATE MIGRATION m1yrxqtcmpx2cr3v3u74powyqvadit2saldwat2iupvitwab6z4nva
    ONTO initial
{
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::Dependency {
      CREATE REQUIRED PROPERTY dependency_version: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::PackageJson {
      CREATE REQUIRED MULTI LINK dependencies: default::Dependency;
      CREATE REQUIRED MULTI LINK dev_dependencies: default::Dependency;
      CREATE REQUIRED PROPERTY repository_id: std::int64;
      CREATE INDEX ON (.repository_id);
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY package_version: std::str;
  };
  CREATE TYPE default::License {
      CREATE PROPERTY html_url: std::str;
      CREATE REQUIRED PROPERTY key: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY node_id: std::str;
      CREATE REQUIRED PROPERTY spdx_id: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  CREATE TYPE default::Permissions {
      CREATE REQUIRED PROPERTY admin: std::bool;
      CREATE PROPERTY maintain: std::bool;
      CREATE REQUIRED PROPERTY pull: std::bool;
      CREATE REQUIRED PROPERTY push: std::bool;
      CREATE PROPERTY triage: std::bool;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY avatar_url: std::str;
      CREATE PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY events_url: std::str;
      CREATE REQUIRED PROPERTY followers_url: std::str;
      CREATE REQUIRED PROPERTY following_url: std::str;
      CREATE REQUIRED PROPERTY gists_url: std::str;
      CREATE REQUIRED PROPERTY gravatar_id: std::str;
      CREATE REQUIRED PROPERTY html_url: std::str;
      CREATE REQUIRED PROPERTY login: std::str;
      CREATE PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY node_id: std::str;
      CREATE REQUIRED PROPERTY organizations_url: std::str;
      CREATE REQUIRED PROPERTY received_events_url: std::str;
      CREATE REQUIRED PROPERTY repos_url: std::str;
      CREATE REQUIRED PROPERTY role_type: std::str;
      CREATE REQUIRED PROPERTY site_admin: std::bool;
      CREATE PROPERTY starred_at: std::str;
      CREATE REQUIRED PROPERTY starred_url: std::str;
      CREATE REQUIRED PROPERTY subscriptions_url: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
      CREATE REQUIRED PROPERTY user_id: std::int64;
      CREATE PROPERTY user_view_type: std::str;
  };
  CREATE TYPE default::Repository {
      CREATE REQUIRED LINK license: default::License;
      CREATE LINK permissions: default::Permissions;
      CREATE REQUIRED PROPERTY repository_id: std::int64;
      CREATE INDEX ON (.repository_id);
      CREATE REQUIRED LINK owner: default::User;
      CREATE LINK template_repository: default::Repository;
      CREATE PROPERTY allow_auto_merge: std::bool;
      CREATE PROPERTY allow_forking: std::bool;
      CREATE PROPERTY allow_merge_commit: std::bool;
      CREATE PROPERTY allow_rebase_merge: std::bool;
      CREATE PROPERTY allow_squash_merge: std::bool;
      CREATE REQUIRED PROPERTY archive_url: std::str;
      CREATE REQUIRED PROPERTY archived: std::bool;
      CREATE REQUIRED PROPERTY assignees_url: std::str;
      CREATE REQUIRED PROPERTY blobs_url: std::str;
      CREATE REQUIRED PROPERTY branches_url: std::str;
      CREATE REQUIRED PROPERTY clone_url: std::str;
      CREATE REQUIRED PROPERTY collaborators_url: std::str;
      CREATE REQUIRED PROPERTY comments_url: std::str;
      CREATE REQUIRED PROPERTY commits_url: std::str;
      CREATE REQUIRED PROPERTY compare_url: std::str;
      CREATE REQUIRED PROPERTY contents_url: std::str;
      CREATE REQUIRED PROPERTY contributors_url: std::str;
      CREATE REQUIRED PROPERTY created_at: std::str;
      CREATE REQUIRED PROPERTY default_branch: std::str;
      CREATE PROPERTY delete_branch_on_merge: std::bool;
      CREATE REQUIRED PROPERTY deployments_url: std::str;
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY disabled: std::bool;
      CREATE REQUIRED PROPERTY downloads_url: std::str;
      CREATE REQUIRED PROPERTY events_url: std::str;
      CREATE REQUIRED PROPERTY fork: std::bool;
      CREATE REQUIRED PROPERTY forks: std::int64;
      CREATE REQUIRED PROPERTY forks_count: std::int64;
      CREATE PROPERTY forks_url: std::str;
      CREATE REQUIRED PROPERTY full_name: std::str;
      CREATE REQUIRED PROPERTY git_commits_url: std::str;
      CREATE REQUIRED PROPERTY git_refs_url: std::str;
      CREATE REQUIRED PROPERTY git_tags_url: std::str;
      CREATE REQUIRED PROPERTY git_url: std::str;
      CREATE REQUIRED PROPERTY has_discussions: std::bool;
      CREATE PROPERTY has_downloads: std::bool;
      CREATE REQUIRED PROPERTY has_issues: std::bool;
      CREATE REQUIRED PROPERTY has_pages: std::bool;
      CREATE REQUIRED PROPERTY has_projects: std::bool;
      CREATE REQUIRED PROPERTY has_wiki: std::bool;
      CREATE REQUIRED PROPERTY homepage: std::str;
      CREATE REQUIRED PROPERTY hooks_url: std::str;
      CREATE REQUIRED PROPERTY html_url: std::str;
      CREATE PROPERTY is_template: std::bool;
      CREATE REQUIRED PROPERTY issue_comment_url: std::str;
      CREATE REQUIRED PROPERTY issue_events_url: std::str;
      CREATE REQUIRED PROPERTY issues_url: std::str;
      CREATE REQUIRED PROPERTY keys_url: std::str;
      CREATE REQUIRED PROPERTY labels_url: std::str;
      CREATE REQUIRED PROPERTY language: std::str;
      CREATE REQUIRED PROPERTY languages_url: std::str;
      CREATE PROPERTY master_branch: std::str;
      CREATE REQUIRED PROPERTY merges_url: std::str;
      CREATE REQUIRED PROPERTY milestones_url: std::str;
      CREATE REQUIRED PROPERTY mirror_url: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY node_id: std::str;
      CREATE REQUIRED PROPERTY notifications_url: std::str;
      CREATE REQUIRED PROPERTY open_issues: std::int64;
      CREATE REQUIRED PROPERTY open_issues_count: std::int64;
      CREATE REQUIRED PROPERTY private: std::bool;
      CREATE REQUIRED PROPERTY pulls_url: std::str;
      CREATE REQUIRED PROPERTY pushed_at: std::str;
      CREATE REQUIRED PROPERTY releases_url: std::str;
      CREATE REQUIRED PROPERTY size: std::int64;
      CREATE REQUIRED PROPERTY ssh_url: std::str;
      CREATE REQUIRED PROPERTY stargazers_count: std::int64;
      CREATE REQUIRED PROPERTY stargazers_url: std::str;
      CREATE REQUIRED PROPERTY statuses_url: std::str;
      CREATE REQUIRED PROPERTY subscribers_url: std::str;
      CREATE REQUIRED PROPERTY subscription_url: std::str;
      CREATE REQUIRED PROPERTY svn_url: std::str;
      CREATE REQUIRED PROPERTY tags_url: std::str;
      CREATE REQUIRED PROPERTY teams_url: std::str;
      CREATE MULTI PROPERTY topics: std::str;
      CREATE REQUIRED PROPERTY trees_url: std::str;
      CREATE REQUIRED PROPERTY updated_at: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
      CREATE PROPERTY visibility: std::str;
      CREATE REQUIRED PROPERTY watchers_count: std::int64;
  };
};
