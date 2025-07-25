with NewRepository := (insert Repository {
     repository_id:= <int64>$repository_id,
     archived:= <bool>$archived,
     contents_url:= <str>$contents_url,
     contributors_url:= <str>$contributors_url,
     created_at:= <str>$created_at,
     default_branch:= <str>$default_branch,
     deployments_url:= <str>$deployments_url,
     description:= <str>$description,
     disabled:= <bool>$disabled,
     downloads_url:= <str>$downloads_url,
     events_url:= <str>$events_url,
     fork:= <bool>$fork,
     forks:= <int64>$forks,
     forks_count:= <int64>$forks_count,
     full_name:= <str>$full_name,
     has_discussions:= <bool>$has_discussions,
     has_issues:= <bool>$has_issues,
     has_pages:= <bool>$has_pages,
     has_projects:= <bool>$has_projects,
     has_wiki:= <bool>$has_wiki,
     homepage:= <str>$homepage,
     hooks_url:= <str>$hooks_url,
     html_url:= <str>$html_url,
     issue_comment_url:= <str>$issue_comment_url,
     issue_events_url:= <str>$issue_events_url,
     issues_url:= <str>$issues_url,
     keys_url:= <str>$keys_url,
     labels_url:= <str>$labels_url,
     language:= <str>$language,
     languages_url:= <str>$languages_url,
     name:= <str>$name,
     node_id:= <str>$node_id,
     notifications_url:= <str>$notifications_url,
     open_issues:= <int64>$open_issues,
     open_issues_count:= <int64>$open_issues_count,
     owner:= (
        select User 
        # this is what the constraint exclusive is on
        filter .user_id = <int64>$owner_user_id
        limit 1
     ) ?? (
        insert User {
            avatar_url := <str>$owner_avatar_url,
            name := <str>$owner_name,
            email := <str>$owner_email, 
            login := <str>$owner_login,
            user_id := <int64>$owner_user_id,
            role_type := <str>$owner_role_type,
            site_admin := <bool>$owner_site_admin,
            events_url := <optional str>$owner_events_url,
            followers_url := <optional str>$owner_followers_url,
            following_url := <optional str>$owner_following_url,
            gists_url := <optional str>$owner_gists_url,
            gravatar_id := <optional str>$owner_gravatar_id, 
            html_url := <optional str>$owner_html_url,
            node_id := <optional str>$owner_node_id,
            organizations_url := <optional str>$owner_organizations_url,
            received_events_url := <optional str>$owner_received_events_url,
            repos_url := <optional str>$owner_repos_url,
            starred_url := <optional str>$owner_starred_url,
            starred_at := <optional str>$owner_starred_at,
            subscriptions_url := <optional str>$owner_subscriptions_url,
            url := <optional str>$owner_url,
            user_view_type := <optional str>$owner_user_view_type,
        }
     ),
    private:= <bool>$private,
    pushed_at:= <str>$pushed_at,
    url:= <str>$url,
    ssh_url:= <str>$ssh_url,
    size:= <int64>$size,
    stargazers_count:= <int64>$stargazers_count,
    updated_at:= <str>$updated_at,
    watchers_count:= <int64>$watchers_count,
    license := (
        select License 
        # this is what the constraint exclusive is on
        filter .name = <str>$license_name
        limit 1
    ) ?? (
        insert License {
            key := <str>$license_key,
            name := <str>$license_name,
            url := <str>$license_url,
            spdx_id := <str>$license_spdx_id,
            node_id := <str>$license_node_id,
            html_url := <optional str>$license_html_url,

        }
    ),
    archive_url:= <optional str>$archive_url,
    assignees_url:= <optional str>$assignees_url,
    blobs_url:= <optional str>$blobs_url,
    branches_url:= <optional str>$branches_url,
    clone_url:= <optional str>$clone_url,
    collaborators_url:= <optional str>$collaborators_url,
    comments_url:= <optional str>$comments_url,
    commits_url:= <optional str>$commits_url,
    compare_url:= <optional str>$compare_url,
    merges_url:= <optional str>$merges_url,
    milestones_url:= <optional str>$milestones_url,
    mirror_url:= <optional str>$mirror_url,
    git_commits_url:= <optional str>$git_commits_url,
    git_refs_url:= <optional str>$git_refs_url,
    git_tags_url:= <optional str>$git_tags_url,
    git_url:= <optional str>$git_url,
    stargazers_url:= <optional str>$stargazers_url,
    statuses_url:= <optional str>$statuses_url,
    subscribers_url:= <optional str>$subscribers_url,
    subscription_url:= <optional str>$subscription_url,
    pulls_url:= <optional str>$pulls_url,
    releases_url:= <optional str>$releases_url,
    svn_url:= <optional str>$svn_url,
    tags_url:= <optional str>$tags_url,
    teams_url:= <optional str>$teams_url,
    trees_url:= <optional str>$trees_url,
    allow_auto_merge:= <optional bool>$allow_auto_merge,
    allow_forking:= <optional bool>$allow_forking,
    allow_merge_commit:= <optional bool>$allow_merge_commit,
    allow_rebase_merge:= <optional bool>$allow_rebase_merge,
    allow_squash_merge:= <optional bool>$allow_squash_merge,
    delete_branch_on_merge:= <optional bool>$delete_branch_on_merge,
    forks_url:= <optional str>$forks_url,
    has_downloads:= <optional bool>$has_downloads,
    is_template:= <optional bool>$is_template,
    master_branch:= <optional str>$master_branch,
    template_repository:= 
        assert_single(
            (select detached Repository 
            filter detached Repository.repository_id = <int64>$template_repository_id limit 1)
        ),
    multi topics:= <optional str>$topics,
    visibility:= <optional str>$visibility,
    }
  unless conflict on .repository_id
  else (
    update Repository 
    filter .repository_id = <int64>$repository_id
    set {
     repository_id:= <int64>$repository_id,
     archived:= <bool>$archived,
     contents_url:= <str>$contents_url,
     contributors_url:= <str>$contributors_url,
     created_at:= <str>$created_at,
     default_branch:= <str>$default_branch,
     deployments_url:= <str>$deployments_url,
     description:= <str>$description,
     disabled:= <bool>$disabled,
     downloads_url:= <str>$downloads_url,
     events_url:= <str>$events_url,
     fork:= <bool>$fork,
     forks:= <int64>$forks,
     forks_count:= <int64>$forks_count,
     full_name:= <str>$full_name,
     has_discussions:= <bool>$has_discussions,
     has_issues:= <bool>$has_issues,
     has_pages:= <bool>$has_pages,
     has_projects:= <bool>$has_projects,
     has_wiki:= <bool>$has_wiki,
     homepage:= <str>$homepage,
     hooks_url:= <str>$hooks_url,
     html_url:= <str>$html_url,
     issue_comment_url:= <str>$issue_comment_url,
     issue_events_url:= <str>$issue_events_url,
     issues_url:= <str>$issues_url,
     keys_url:= <str>$keys_url,
     labels_url:= <str>$labels_url,
     language:= <str>$language,
     languages_url:= <str>$languages_url,
     name:= <str>$name,
     node_id:= <str>$node_id,
     notifications_url:= <str>$notifications_url,
     open_issues:= <int64>$open_issues,
     open_issues_count:= <int64>$open_issues_count,
     owner:= (
        select User 
        # this is what the constraint exclusive is on
        filter .user_id = <int64>$owner_user_id
        limit 1
     ) ?? (
        insert User {
            avatar_url := <str>$owner_avatar_url,
            name := <str>$owner_name,
            email := <str>$owner_email, 
            login := <str>$owner_login,
            user_id := <int64>$owner_user_id,
            role_type := <str>$owner_role_type,
            site_admin := <bool>$owner_site_admin,
            events_url := <optional str>$owner_events_url,
            followers_url := <optional str>$owner_followers_url,
            following_url := <optional str>$owner_following_url,
            gists_url := <optional str>$owner_gists_url,
            gravatar_id := <optional str>$owner_gravatar_id, 
            html_url := <optional str>$owner_html_url,
            node_id := <optional str>$owner_node_id,
            organizations_url := <optional str>$owner_organizations_url,
            received_events_url := <optional str>$owner_received_events_url,
            repos_url := <optional str>$owner_repos_url,
            starred_url := <optional str>$owner_starred_url,
            starred_at := <optional str>$owner_starred_at,
            subscriptions_url := <optional str>$owner_subscriptions_url,
            url := <optional str>$owner_url,
            user_view_type := <optional str>$owner_user_view_type,
        }
     ),
    private:= <bool>$private,
    pushed_at:= <str>$pushed_at,
    url:= <str>$url,
    ssh_url:= <str>$ssh_url,
    size:= <int64>$size,
    stargazers_count:= <int64>$stargazers_count,
    updated_at:= <str>$updated_at,
    watchers_count:= <int64>$watchers_count,
    license := (
        select License 
        # this is what the constraint exclusive is on
        filter .name = <str>$license_name
        limit 1
    ) ?? (
        insert License {
            key := <str>$license_key,
            name := <str>$license_name,
            url := <str>$license_url,
            spdx_id := <str>$license_spdx_id,
            node_id := <str>$license_node_id,
            html_url := <optional str>$license_html_url,

        }
    ),
    archive_url:= <optional str>$archive_url,
    assignees_url:= <optional str>$assignees_url,
    blobs_url:= <optional str>$blobs_url,
    branches_url:= <optional str>$branches_url,
    clone_url:= <optional str>$clone_url,
    collaborators_url:= <optional str>$collaborators_url,
    comments_url:= <optional str>$comments_url,
    commits_url:= <optional str>$commits_url,
    compare_url:= <optional str>$compare_url,
    merges_url:= <optional str>$merges_url,
    milestones_url:= <optional str>$milestones_url,
    mirror_url:= <optional str>$mirror_url,
    git_commits_url:= <optional str>$git_commits_url,
    git_refs_url:= <optional str>$git_refs_url,
    git_tags_url:= <optional str>$git_tags_url,
    git_url:= <optional str>$git_url,
    stargazers_url:= <optional str>$stargazers_url,
    statuses_url:= <optional str>$statuses_url,
    subscribers_url:= <optional str>$subscribers_url,
    subscription_url:= <optional str>$subscription_url,
    pulls_url:= <optional str>$pulls_url,
    releases_url:= <optional str>$releases_url,
    svn_url:= <optional str>$svn_url,
    tags_url:= <optional str>$tags_url,
    teams_url:= <optional str>$teams_url,
    trees_url:= <optional str>$trees_url,
    allow_auto_merge:= <optional bool>$allow_auto_merge,
    allow_forking:= <optional bool>$allow_forking,
    allow_merge_commit:= <optional bool>$allow_merge_commit,
    allow_rebase_merge:= <optional bool>$allow_rebase_merge,
    allow_squash_merge:= <optional bool>$allow_squash_merge,
    delete_branch_on_merge:= <optional bool>$delete_branch_on_merge,
    forks_url:= <optional str>$forks_url,
    has_downloads:= <optional bool>$has_downloads,
    is_template:= <optional bool>$is_template,
    master_branch:= <optional str>$master_branch,
    template_repository:= 
        assert_single(
            (select detached Repository 
            filter detached Repository.repository_id = <int64>$template_repository_id limit 1)
        ),
    multi topics:= <optional str>$topics,
    visibility:= <optional str>$visibility,
    }
  )
)
select NewRepository {**};