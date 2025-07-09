import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { useGetPackageJson, useGetRepos } from "~/routes/layout";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";
import type { Repo } from "~/db/types";
import { RepoDetails } from "~/components/repoDetails/repoDetails";
import { RepoDependencyCard } from "~/components/cards/repoDependencyCard";
import { Routes } from "~/config/routes";

export default component$(() => {
  const repos = useGetRepos();
  const packageJson = useGetPackageJson();
  const { name: repoName } = useLocation().params;
  const tabList = ["Details", "Dependencies"];

  const repo = repos.value.data?.repositories.find((r) => r.name === repoName);
  const repoTopics = repo?.topics;
  const isTemplate = repo?.is_template;
  const isDesignSystem = repoTopics?.includes("design-system");
  let childRepos: Repo[] = [];

  if (isDesignSystem) {
    tabList.push("Dependents");
  }

  // TODO: This will likely be removed in the future in favor pulling this from the database
  if (isTemplate) {
    childRepos =
      repos.value.data?.repositories.filter(
        (r) => r.template_repository?.id === repo?.id,
      ) ?? [];
    tabList.push("Child Repos");
  }

  if (repo?.template_repository) {
    tabList.push("Parent Template");
  }

  if (repos.value.failed) {
    return <div>Error: {repos.value.message}</div>;
  }

  return (
    <div>
      <PageTitle />
      <TabbedCard tabList={tabList}>
        <div q:slot="Details">
          <RepoDetails repoDetails={repo} isDesignSystem={isDesignSystem} />
        </div>
        <div q:slot="Dependencies">
          <RepoDependencyCard
            repos={repos.value.data.repositories}
            repo={repo as Repo}
            packageJson={packageJson.value}
          />
        </div>

        <div q:slot="Dependents">
          <DependencyUpdaterCard
            repos={repos.value.data.repositories}
            repo={repo as Repo}
            packageJson={packageJson.value}
          />
        </div>
        <div q:slot="Parent Template">
          <RepoDetails repoDetails={repo?.template_repository} />
        </div>
        <div q:slot="Child Repos">
          {childRepos.length > 0 ? (
            <div class="space-y-2">
              {childRepos.map((childRepo) => (
                <a
                  key={childRepo.id}
                  href={Routes.repoDetails(
                    childRepo.owner?.login,
                    childRepo.name,
                  )}
                  class="block text-kunai-blue-600 dark:text-kunai-blue-400 hover:underline"
                >
                  {childRepo.name}
                </a>
              ))}
            </div>
          ) : (
            <p class="text-gray-500">No child repositories found.</p>
          )}
        </div>
      </TabbedCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
