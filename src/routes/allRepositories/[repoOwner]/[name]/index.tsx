import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useGetRepos } from "~/routes/layout";
import { useLocation } from "@builder.io/qwik-city";
import { TabbedCard } from "~/components/cards/tabbedCard";
import { PageTitle } from "~/components/page/pageTitle";
import { useGetPackageJson } from "~/db/getPackageJson";
export { useGetPackageJson } from "~/db/getPackageJson";

export default component$(() => {
  const repos = useGetRepos();
  const packageJson = useGetPackageJson();
  const params = useLocation().params;
  const repoName = params.name;

  const repo = repos.value.find((r) => r.name === repoName);

  return (
    <div class="container container-center">
      <PageTitle />
      <TabbedCard
        repoDetails={repo}
        repos={repos.value}
        packageJson={packageJson.value}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
