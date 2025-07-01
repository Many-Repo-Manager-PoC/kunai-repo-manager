import { createClient } from "gel";
import e from "../dbschema/edgeql-js";

export async function insertPackageJson(formData: FormData) {
  const client = createClient();

  const name = formData.get("name") as string;
  const packageVersion = formData.get("version") as string;
  const dependencies = formData.get("dependencies")
    ? JSON.parse(formData.get("dependencies") as string)
    : [];
  const devDependencies = formData.get("devDependencies")
    ? JSON.parse(formData.get("devDependencies") as string)
    : [];

  // Insert PackageJson and its dependencies in a single transaction
  await e
    .params(
      {
        name: e.str,
        package_version: e.str,
        dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
        dev_dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
      },
      (params) => {
        // Insert the PackageJson
        const packageJson = e.insert(e.PackageJson, {
          name: params.name,
          package_version: params.package_version,
          repository: e
            .select(e.Repository, (repo) => ({
              filter: e.op(repo.name, "=", params.name),
            }))
            .assert_single(),
        });

        // Insert production dependencies
        const prodDeps = e.for(e.array_unpack(params.dependencies), (dep) =>
          e.insert(e.ProdDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: packageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        // Insert development dependencies
        const devDeps = e.for(e.array_unpack(params.dev_dependencies), (dep) =>
          e.insert(e.DevDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: packageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        return e.select({
          package_json: packageJson,
          prod_dependencies: prodDeps,
          dev_dependencies: devDeps,
        });
      },
    )
    .run(client, {
      name,
      package_version: packageVersion,
      dependencies,
      dev_dependencies: devDependencies,
    });
}

export async function updatePackageJson(formData: FormData) {
  const client = createClient();

  const name = formData.get("name") as string;
  const packageVersion = formData.get("version") as string;
  const dependencies = formData.get("dependencies")
    ? JSON.parse(formData.get("dependencies") as string)
    : [];
  const devDependencies = formData.get("devDependencies")
    ? JSON.parse(formData.get("devDependencies") as string)
    : [];

  console.log("name", name);
  console.log("packageVersion", packageVersion);
  console.log("dependencies", dependencies);
  console.log("devDependencies", devDependencies);

  await e
    .params(
      {
        name: e.str,
        package_version: e.str,
        dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
        dev_dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
      },
      (params) => {
        // Get the existing PackageJson for this repository
        const existingPackageJson = e
          .select(e.PackageJson, (pkg) => ({
            filter: e.op(pkg.repository.name, "=", params.name),
          }))
          .assert_single();

        // Delete all existing dependencies associated with this PackageJson
        const deleteProdDependencies = e.delete(
          e.ProdDependency,
          (dependency) => ({
            filter: e.op(
              dependency.package_json.id,
              "=",
              existingPackageJson.id,
            ),
          }),
        );

        const deleteDevDependencies = e.delete(
          e.DevDependency,
          (dependency) => ({
            filter: e.op(
              dependency.package_json.id,
              "=",
              existingPackageJson.id,
            ),
          }),
        );

        // Update the PackageJson with new values
        const updatedPackageJson = e
          .update(e.PackageJson, (pkg) => ({
            filter: e.op(pkg.repository.name, "=", params.name),
            set: {
              name: params.name,
              package_version: params.package_version,
            },
          }))
          .assert_single();

        // Insert new production dependencies
        const prodDeps = e.for(e.array_unpack(params.dependencies), (dep) =>
          e.insert(e.ProdDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: updatedPackageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        // Insert new development dependencies
        const devDeps = e.for(e.array_unpack(params.dev_dependencies), (dep) =>
          e.insert(e.DevDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: updatedPackageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        return e.select({
          deleted_prod_dependencies: deleteProdDependencies,
          deleted_dev_dependencies: deleteDevDependencies,
          updated_package_json: updatedPackageJson,
          new_prod_dependencies: prodDeps,
          new_dev_dependencies: devDeps,
        });
      },
    )
    .run(client, {
      name,
      package_version: packageVersion,
      dependencies,
      dev_dependencies: devDependencies,
    });
}

export async function deletePackageJson(formData: FormData) {
  const client = createClient();

  const repositoryName = formData.get("repository_name") as string;

  await e
    .params(
      {
        name: e.str,
      },
      (params) => {
        // First, delete existing dependencies for this repository
        const deleteDependencies = e.delete(e.Dependency, (dependency) => ({
          filter: e.op(dependency.repository.name, "=", params.name),
        }));

        // Then, delete the PackageJson
        const deletePackageJson = e.delete(e.PackageJson, (pkg) => ({
          filter: e.op(pkg.repository.name, "=", params.name),
        }));

        return e.select({
          deleted_dependencies: deleteDependencies,
          deleted_package_json: deletePackageJson,
        });
      },
    )
    .run(client, { name: repositoryName });
}

export async function insertAndUpdateRepository(formData: FormData) {
  const client = createClient();

  const data = formData as FormData;
  const repository_id = Number(JSON.parse(data.get("repository_id") as string));
  const user_id = Number(JSON.parse(formData.get("user_id") as string));
  const name = data.get("name") as string;

  const existingRepository = await e
    .select(e.Repository, (repository) => ({
      id: true,
      filter: e.op(repository.repository_id, "=", repository_id),
    }))
    .run(client);
  if (existingRepository.length > 0) {
    // Repository exists, update it
    await e
      .update(e.Repository, (repository) => ({
        filter: e.op(repository.repository_id, "=", repository_id),
        set: {
          name: name,
          description: data.get("description") as string,
          topics: JSON.parse((data.get("topics") as string) || "[]"),
          full_name: data.get("full_name") as string,
          private: data.get("private") === "true" ? true : false,
          fork: data.get("fork") === "true" ? true : false,
          size: Number(data.get("size")),
          stargazers_count: Number(data.get("stargazers_count")),
          watchers_count: Number(data.get("watchers_count")),
          language: data.get("language") as string,
          has_issues: data.get("has_issues") === "true" ? true : false,
          has_projects: data.get("has_projects") === "true" ? true : false,
          has_downloads: data.get("has_downloads") === "true" ? true : false,
          has_wiki: data.get("has_wiki") === "true" ? true : false,
          has_pages: data.get("has_pages") === "true" ? true : false,
          has_discussions:
            data.get("has_discussions") === "true" ? true : false,
          forks_count: Number(data.get("forks_count")),
          archived: data.get("archived") === "true" ? true : false,
          disabled: data.get("disabled") === "true" ? true : false,
          license: JSON.parse((data.get("license") as string) || "null"),
          allow_forking: data.get("allow_forking") === "true" ? true : false,
          is_template: data.get("is_template") === "true" ? true : false,
          web_commit_signoff_required:
            data.get("web_commit_signoff_required") === "true" ? true : false,
          default_branch: data.get("default_branch") as string,
          open_issues_count: Number(data.get("open_issues_count")),
          visibility: data.get("visibility") as string,
          network_count: Number(data.get("network_count")),
          subscribers_count: Number(data.get("subscribers_count")),
          node_id: data.get("node_id") as string,
          git_url: data.get("git_url") as string,
          ssh_url: data.get("ssh_url") as string,
          clone_url: data.get("clone_url") as string,
          svn_url: data.get("svn_url") as string,
          homepage: data.get("homepage") as string,
          language_color: data.get("language_color") as string,
          mirror_url: data.get("mirror_url") as string,
          archived_at: data.get("archived_at")
            ? new Date(data.get("archived_at") as string)
            : null,
          allow_squash_merge:
            data.get("allow_squash_merge") === "true" ? true : false,
          allow_merge_commit:
            data.get("allow_merge_commit") === "true" ? true : false,
          allow_rebase_merge:
            data.get("allow_rebase_merge") === "true" ? true : false,
          allow_auto_merge:
            data.get("allow_auto_merge") === "true" ? true : false,
        },
      }))
      .run(client);
  } else {
    // Insert Repository in a single transaction
    await e
      .params(
        {
          name: e.str,
          description: e.optional(e.str),
          topics: e.optional(e.array(e.str)),
          owner: e.json,
          full_name: e.optional(e.str),
          private: e.optional(e.bool),
          fork: e.optional(e.bool),
          created_at: e.optional(e.str),
          updated_at: e.optional(e.str),
          pushed_at: e.optional(e.str),
          size: e.optional(e.int64),
          stargazers_count: e.optional(e.int64),
          watchers_count: e.optional(e.int64),
          language: e.optional(e.str),
          has_issues: e.optional(e.bool),
          has_projects: e.optional(e.bool),
          has_downloads: e.optional(e.bool),
          has_wiki: e.optional(e.bool),
          has_pages: e.optional(e.bool),
          has_discussions: e.optional(e.bool),
          forks_count: e.optional(e.int64),
          archived: e.optional(e.bool),
          disabled: e.optional(e.bool),
          license: e.optional(e.json),
          allow_forking: e.optional(e.bool),
          is_template: e.optional(e.bool),
          web_commit_signoff_required: e.optional(e.bool),
          default_branch: e.optional(e.str),
          open_issues_count: e.optional(e.int64),
          visibility: e.optional(e.str),
          network_count: e.optional(e.int64),
          subscribers_count: e.optional(e.int64),
          node_id: e.optional(e.str),
          git_url: e.optional(e.str),
          ssh_url: e.optional(e.str),
          clone_url: e.optional(e.str),
          svn_url: e.optional(e.str),
          homepage: e.optional(e.str),
          language_color: e.optional(e.str),
          mirror_url: e.optional(e.str),
          archived_at: e.optional(e.datetime),
          allow_squash_merge: e.optional(e.bool),
          allow_merge_commit: e.optional(e.bool),
          allow_rebase_merge: e.optional(e.bool),
          allow_auto_merge: e.optional(e.bool),
          delete_branch_on_merge: e.optional(e.bool),
          allow_update_branch: e.optional(e.bool),
          use_squash_pr_title_as_default: e.optional(e.bool),
          squash_merge_commit_message: e.optional(e.str),
          squash_merge_commit_title: e.optional(e.str),
          merge_commit_message: e.optional(e.str),
          merge_commit_title: e.optional(e.str),
          security_and_analysis: e.optional(e.json),
          temp_clone_token: e.optional(e.str),
          open_issues: e.optional(e.int64),
          watchers: e.optional(e.int64),
          master_branch: e.optional(e.str),
          anonymous_access_enabled: e.optional(e.bool),
          source: e.optional(e.json),
          parent: e.optional(e.json),
          template_repository: e.optional(e.json),
          organization: e.optional(e.json),
          permissions: e.optional(e.json),
          role_name: e.optional(e.str),
          teams_url: e.optional(e.str),
          hooks_url: e.optional(e.str),
          issue_events_url: e.optional(e.str),
          events_url: e.optional(e.str),
          assignees_url: e.optional(e.str),
          branches_url: e.optional(e.str),
          tags_url: e.optional(e.str),
          blobs_url: e.optional(e.str),
          git_tags_url: e.optional(e.str),
          git_refs_url: e.optional(e.str),
          trees_url: e.optional(e.str),
          statuses_url: e.optional(e.str),
          languages_url: e.optional(e.str),
          stargazers_url: e.optional(e.str),
          contributors_url: e.optional(e.str),
          subscribers_url: e.optional(e.str),
          subscription_url: e.optional(e.str),
          commits_url: e.optional(e.str),
          git_commits_url: e.optional(e.str),
          comments_url: e.optional(e.str),
          issue_comment_url: e.optional(e.str),
          contents_url: e.optional(e.str),
          compare_url: e.optional(e.str),
          merges_url: e.optional(e.str),
          archive_url: e.optional(e.str),
          downloads_url: e.optional(e.str),
          issues_url: e.optional(e.str),
          pulls_url: e.optional(e.str),
          milestones_url: e.optional(e.str),
          notifications_url: e.optional(e.str),
          labels_url: e.optional(e.str),
          releases_url: e.optional(e.str),
          deployments_url: e.optional(e.str),
          forks: e.optional(e.int64),
          html_url: e.optional(e.str),
          keys_url: e.optional(e.str),
          url: e.optional(e.str),
          repository_id: e.int64,
          user_id: e.int64,
          forks_url: e.optional(e.str),
        },
        (params) => {
          // First, ensure the User exists

          const user = e
            .insert(e.User, {
              avatar_url: String(params.owner.avatar_url),
              name: String(params.owner.name),
              email: String(params.owner.email),
              login: String(params.owner.login),
              user_id: user_id,
              role_type: "user",
              site_admin: false,
            })
            .unlessConflict((user) => ({
              on: user.user_id,
              else: e
                .select(e.User, (user) => ({
                  filter: e.op(user.user_id, "=", user_id),
                }))
                .assert_single(),
            }));

          // Insert the Repository

          const repo = e
            .insert(e.Repository, {
              name: params.name,
              repository_id: params.repository_id,
              description: params.description,
              topics: e.array_unpack(params.topics),
              owner: user,
              full_name: params.full_name,
              private: params.private,
              fork: params.fork,
              created_at: params.created_at,
              updated_at: params.updated_at,
              pushed_at: params.pushed_at,
              size: params.size,
              forks_url: params.forks_url,
              stargazers_count: params.stargazers_count,
              watchers_count: params.watchers_count,
              language: params.language,
              has_issues: Boolean(params.has_issues),
              has_projects: Boolean(params.has_projects),
              has_downloads: Boolean(params.has_downloads),
              has_wiki: Boolean(params.has_wiki),
              has_pages: Boolean(params.has_pages),
              has_discussions: Boolean(params.has_discussions),
              forks_count: params.forks_count,
              archived: Boolean(params.archived),
              disabled: Boolean(params.disabled),
              license: params.license
                ? e
                    .insert(e.License, {
                      key: String(params.license.key),
                      name: String(params.license.name),
                      url: String(params.license.url),
                      spdx_id: String(params.license.spdx_id),
                      node_id: String(params.license.node_id),
                      html_url: params.license.html_url
                        ? String(params.license.html_url)
                        : null,
                    })
                    .unlessConflict((license) => ({
                      on: license.name,
                      else: e
                        .select(e.License, (license) => ({
                          filter: e.op(
                            license.key,
                            "=",
                            String(params.license.key),
                          ),
                        }))
                        .assert_single(),
                    }))
                : null,
              allow_forking: Boolean(params.allow_forking),
              is_template: Boolean(params.is_template),
              default_branch: String(params.default_branch),
              open_issues_count: isNaN(Number(params.open_issues_count))
                ? 0
                : Number(params.open_issues_count),
              visibility: params.visibility,
              node_id: String(params.node_id),
              git_url: String(params.git_url),
              ssh_url: String(params.ssh_url),
              clone_url: params.clone_url,
              svn_url: String(params.svn_url),
              homepage: String(params.homepage),
              mirror_url: String(params.mirror_url),
              allow_squash_merge: Boolean(params.allow_squash_merge),
              allow_merge_commit: Boolean(params.allow_merge_commit),
              allow_rebase_merge: Boolean(params.allow_rebase_merge),
              allow_auto_merge: Boolean(params.allow_auto_merge),
              delete_branch_on_merge: Boolean(params.delete_branch_on_merge),
              open_issues: isNaN(Number(params.open_issues))
                ? 0
                : Number(params.open_issues),
              master_branch: String(params.master_branch),
              template_repository: params.template_repository
                ? e
                    .select(e.Repository, (repo) => ({
                      filter: e.op(
                        repo.repository_id,
                        "=",
                        isNaN(Number(params.template_repository.repository_id))
                          ? 0
                          : Number(params.template_repository.repository_id),
                      ),
                    }))
                    .assert_single()
                : null,
              permissions: params.permissions
                ? e.insert(e.Permissions, {
                    admin: Boolean(params.permissions.admin),
                    maintain: Boolean(params.permissions.maintain),
                    push: Boolean(params.permissions.push),
                    triage: Boolean(params.permissions.triage),
                    pull: Boolean(params.permissions.pull),
                  })
                : null,
              teams_url: String(params.teams_url),
              hooks_url: String(params.hooks_url),
              issue_events_url: String(params.issue_events_url),
              events_url: String(params.events_url),
              assignees_url: String(params.assignees_url),
              branches_url: String(params.branches_url),
              tags_url: String(params.tags_url),
              blobs_url: String(params.blobs_url),
              git_tags_url: String(params.git_tags_url),
              git_refs_url: String(params.git_refs_url),
              trees_url: String(params.trees_url),
              statuses_url: String(params.statuses_url),
              languages_url: String(params.languages_url),
              stargazers_url: String(params.stargazers_url),
              contributors_url: params.contributors_url,
              subscribers_url: String(params.subscribers_url),
              subscription_url: String(params.subscription_url),
              commits_url: String(params.commits_url),
              git_commits_url: String(params.git_commits_url),
              comments_url: String(params.comments_url),
              issue_comment_url: String(params.issue_comment_url),
              contents_url: params.contents_url,
              compare_url: String(params.compare_url),
              merges_url: String(params.merges_url),
              archive_url: params.archive_url,
              downloads_url: String(params.downloads_url),
              issues_url: String(params.issues_url),
              pulls_url: String(params.pulls_url),
              milestones_url: String(params.milestones_url),
              notifications_url: String(params.notifications_url),
              labels_url: String(params.labels_url),
              releases_url: String(params.releases_url),
              deployments_url: String(params.deployments_url),
              forks: params.forks,
              html_url: String(params.html_url),
              keys_url: String(params.keys_url),
              url: String(params.url),
            })
            .unlessConflict((repo) => ({
              on: repo.repository_id,
              else: e
                .select(e.Repository, (repo) => ({
                  filter: e.op(
                    repo.repository_id,
                    "=",
                    isNaN(Number(params.repository_id))
                      ? 0
                      : Number(params.repository_id),
                  ),
                }))
                .assert_single(),
            }));

          return e.select({
            repository: repo,
          });
        },
      )
      .run(client, {
        name: name,
        owner: JSON.parse(data.get("owner") as string),
        repository_id: repository_id,
        user_id: user_id,
        description: data.get("description") as string,
        topics: JSON.parse(data.get("topics") as string),
        full_name: data.get("full_name") as string,
        private: data.get("private") === "true" ? true : false,
        fork: data.get("fork") === "true" ? true : false,
        created_at: data.get("created_at") as string,
        updated_at: data.get("updated_at") as string,
        pushed_at: data.get("pushed_at") as string,
        size: Number(data.get("size")),
        stargazers_count: Number(data.get("stargazers_count")),
        watchers_count: Number(data.get("watchers_count")),
        language: data.get("language") as string,
        archive_url: data.get("archive_url") as string,
        contributors_url: data.get("contributors_url") as string,
        contents_url: data.get("contents_url") as string,
        clone_url: data.get("clone_url") as string,
        forks: Number(data.get("forks")),
        forks_count: Number(data.get("forks_count")),
        forks_url: data.get("forks_url") as string,
      });
  }
}
