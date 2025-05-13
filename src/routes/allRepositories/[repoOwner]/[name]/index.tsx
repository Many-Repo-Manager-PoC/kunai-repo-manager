import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useGetRepos } from "~/db/getRepositories";
import { useLocation } from "@builder.io/qwik-city";
export { useGetRepos };
import type { Repo } from "~/db/types";
import { DependencyUpdaterCard } from "~/components/cards/dependencyUpdaterCard";

export default component$(() => {
  const repos = useGetRepos();
  const params = useLocation().params;
  const repoName = params.name;

  const repo = repos.value.find((r) => r.name === repoName);

  return (
    <div class="container container-center">
      <h1>
        <span class="highlight">The repository details for</span>
      </h1>
      <h3>{repo?.name}</h3>
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
