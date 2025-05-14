import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useGetRepos } from "~/routes/layout";
import { useLocation } from "@builder.io/qwik-city";
import type { Repo } from "~/db/types";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";

export default component$(() => {
  const repos = useGetRepos();
  const params = useLocation().params;
  const repoName = params.name;

  const repo = repos.value.find((r) => r.name === repoName);

  return (
    <div class="container container-center">
      <PageTitle />
      <TabbedCard repoDetails={repo} />
      <DependencyUpdaterCard
        repos={repos.value}
        repo={repo ? repo : ({} as Repo)}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
