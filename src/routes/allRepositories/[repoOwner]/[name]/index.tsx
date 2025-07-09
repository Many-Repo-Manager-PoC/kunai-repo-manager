import { component$ } from "@qwik.dev/core";
import { type DocumentHead, useLocation } from "@qwik.dev/router";
import { useGetPackageJson, useGetRepos } from "~/routes/layout";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";
import type { Repo } from "~/db/types";
import { RepoDetails } from "~/components/repoDetails/repoDetails";
import { RepoDependencyCard } from "~/components/cards/repoDependencyCard";

export default component$(() => {
  const repos = useGetRepos();
  const packageJson = useGetPackageJson();
  const { name: repoName } = useLocation().params;
  const tabList = ["Details", "Dependencies", "Dependents"];

  const repo = repos.value.data?.repositories.find((r) => r.name === repoName);
  const repoTopics = repo?.topics;
  const isDesignSystem = repoTopics?.includes("design-system");
  if (!isDesignSystem) {
    tabList.pop();
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
      </TabbedCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
