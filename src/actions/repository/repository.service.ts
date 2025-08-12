import { server$ } from "@qwik.dev/router";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
import type { Octokit } from "octokit";
import e from "@dbschema/edgeql-js";
import { executeQuery } from "../client";

const updateRepo = async (
  repository: Awaited<
    ReturnType<InstanceType<typeof Octokit>["rest"]["repos"]["get"]>
  >["data"],
) => {
  try {
    const owner = {
      name: repository.owner.name ?? "",
      login: repository.owner.login,
      avatar_url: repository.owner.avatar_url,
      email: repository.owner.email ?? "",
      site_admin: repository.owner.site_admin,
      received_events_url: repository.owner.received_events_url,
      role_type: repository.owner.type,
      user_id: repository.owner.id,
    };
    const license = {
      name: repository.license?.name ?? "",
      key: repository.license?.key ?? "",
      spdx_id: repository.license?.spdx_id ?? "",
      url: repository.license?.url ?? "",
      html_url: repository.license?.html_url ?? "",
      node_id: repository.license?.node_id ?? "",
    };
    const repoUpdate = {
      owner: e.insert(e.User, owner).unlessConflict((user) => ({
        on: user.user_id,
        else: e.update(e.User, () => ({
          filter_single: {
            user_id: repository.owner.id,
          },
          set: owner,
        })),
      })),
      repository_id: repository.id,
      archived: repository.archived,
      template_repository: repository.template_repository?.id
        ? e.select(e.Repository, () => ({
            id: true,
            filter_single: {
              repository_id: repository.template_repository?.id ?? 0,
            },
          }))
        : undefined, // TODO: Handle inserting template repositories
      topics: repository.topics,
      visibility: repository.visibility as "private" | "public",
      is_template: repository.is_template ?? false,
      license:
        repository.license !== null
          ? e.insert(e.License, license).unlessConflict((lic) => ({
              on: lic.name,
              else: e.select(e.License, () => ({
                id: true,
                filter_single: {
                  name: repository.license?.name ?? "",
                },
              })),
            }))
          : undefined,
      contents_url: repository.contents_url,
      contributors_url: repository.contributors_url,
      created_at: repository.created_at,
      default_branch: repository.default_branch,
      deployments_url: repository.deployments_url,
      description: repository.description ?? "",
      disabled: repository.disabled,
      downloads_url: repository.downloads_url,
      events_url: repository.events_url,
      fork: repository.fork,
      forks: repository.forks,
      forks_count: repository.forks_count,
      full_name: repository.full_name,
      has_discussions: repository.has_discussions,
      has_issues: repository.has_issues,
      has_pages: repository.has_pages,
      has_projects: repository.has_projects,
      has_wiki: repository.has_wiki,
      homepage: repository.homepage ?? "",
      hooks_url: repository.hooks_url,
      html_url: repository.html_url,
      issue_comment_url: repository.issue_comment_url,
      issue_events_url: repository.issue_events_url,
      issues_url: repository.issues_url,
      keys_url: repository.keys_url,
      labels_url: repository.labels_url,
      language: repository.language ?? "",
      languages_url: repository.languages_url,
      name: repository.name,
      node_id: repository.node_id,
      notifications_url: repository.notifications_url,
      open_issues: repository.open_issues,
      open_issues_count: repository.open_issues_count,
      private: repository.private,
      pulls_url: repository.pulls_url,
      pushed_at: repository.pushed_at,
      releases_url: repository.releases_url,
      size: repository.size,
      ssh_url: repository.ssh_url,
      stargazers_count: repository.stargazers_count,
      stargazers_url: repository.stargazers_url,
      statuses_url: repository.statuses_url,
      subscribers_url: repository.subscribers_url,
      subscription_url: repository.subscription_url,
      svn_url: repository.svn_url,
      tags_url: repository.tags_url,
      teams_url: repository.teams_url,
      trees_url: repository.trees_url,
      updated_at: repository.updated_at,
      url: repository.url,
      watchers_count: repository.watchers_count,
      forks_url: repository.forks_url,
    };
    await executeQuery((client) => {
      console.info(`Upserting repository: ${repository.full_name}`);
      return e
        .insert(e.Repository, repoUpdate)
        .unlessConflict((repo) => ({
          on: repo.repository_id,
          else: e.update(e.Repository, () => ({
            filter_single: {
              repository_id: repository.id,
            },
            set: repoUpdate,
          })),
        }))
        .run(client);
    });
  } catch (error) {
    console.error(`Error processing repository:`, error);
  }
};

export const upsertRepository = server$(async function (
  repoName: string,
  ownerName: string,
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const getRepo = await octokit.rest.repos.get({
    owner: ownerName,
    repo: repoName,
  });
  await updateRepo(getRepo.data);
});

export const upsertRepositories = server$(async function (
  repositories: { repo: string; owner: string }[],
) {
  const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
  const repoPromises = await Promise.allSettled(
    repositories.map(async (repo) => {
      const res = await octokit.rest.repos.get(repo);

      return { ...res.data };
    }),
  );
  for (const res of repoPromises) {
    if (res.status === "fulfilled") {
      await updateRepo(res.value);
    } else {
      console.error(`Error refreshing repository:`, res.reason);
    }
  }
});
