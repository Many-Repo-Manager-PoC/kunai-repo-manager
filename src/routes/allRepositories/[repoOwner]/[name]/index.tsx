import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { Slot } from "@builder.io/qwik";
import { useGetRepos } from "~/routes/layout";
import { useGetPackageJson } from "~/db/getPackageJson";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";
import type { Repo } from "~/db/types";

export { useGetPackageJson } from "~/db/getPackageJson";

export default component$(() => {
  const repos = useGetRepos();
  const packageJson = useGetPackageJson();
  const { name: repoName } = useLocation().params;
  const tabList = ["details", "dependencies", "dependents"];

  const repo = repos.value.find((r) => r.name === repoName);

  return (
    <div class="container container-center">
      <PageTitle />
      <TabbedCard tabList={tabList}>
        <Slot name="details" />
        <Slot name="dependencies" />
        <div q:slot="dependents">
          <DependencyUpdaterCard
            repos={repos.value}
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
