import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { useGetPackageJson } from "~/routes/layout";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";

import { RepoDetails } from "~/components/repoDetails/repoDetails";
import { RepoDependencyCard } from "~/components/cards/repoDependencyCard";
import { useGetRepositories, useGetRepoByName } from "~/hooks";

export default component$(() => {
  const repos = useGetRepositories();
  const packageJson = useGetPackageJson();
  const { name: repoName } = useLocation().params;
  const tabList = ["Details", "Dependencies", "Dependents"];

  const repo = useGetRepoByName(repoName);
  const repoTopics = repo.value?.topics?.flatMap((topic: string) =>
    topic.split(",").map((t) => t.trim()),
  );
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
          <RepoDetails repoDetails={repo.value} repoTopics={repoTopics} />
        </div>
        <div q:slot="Dependencies">
          <RepoDependencyCard
            repos={repos.value}
            repo={repo.value}
            packageJson={packageJson.value}
          />
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
