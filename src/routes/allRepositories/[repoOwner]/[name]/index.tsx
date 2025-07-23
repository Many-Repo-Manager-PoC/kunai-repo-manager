import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";

import { RepoDetails } from "~/components/repoDetails/repoDetails";
import { RepoDependencyCard } from "~/components/cards/repoDependencyCard";
import {
  useGetRepositories,
  useGetRepoByName,
  useGetPackageJson,
} from "~/hooks";

export default component$(() => {
  const repos = useGetRepositories();
  const { name: repoName } = useLocation().params;
  const tabList = ["Details", "Dependencies", "Dependents"];

  const repo = useGetRepoByName(repoName);
  const packageJson = useGetPackageJson(repoName);
  const repoTopics = repo.value?.topics?.map((topic: string) => topic.trim());
  const isDesignSystem = repoTopics?.includes("design-system");
  if (!isDesignSystem) {
    tabList.pop();
  }
  if (!repos.value) {
    return <div>Error: Failed to load repository data</div>;
  }

  return (
    <div>
      <PageTitle />
      <TabbedCard tabList={tabList}>
        <div q:slot="Details">
          <RepoDetails
            repoDetails={repo.value}
            isDesignSystem={isDesignSystem}
          />
        </div>
        <div q:slot="Dependencies">
          <RepoDependencyCard repo={repo.value} />
        </div>

        <div q:slot="Dependents">
          <DependencyUpdaterCard
            repos={repos.value}
            repo={repo.value}
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
