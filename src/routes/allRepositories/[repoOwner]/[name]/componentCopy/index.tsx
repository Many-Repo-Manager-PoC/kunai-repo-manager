import { component$ } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";
import { BaseCard } from "~/components/cards/baseCard";
import { ComponentCopyForm } from "~/components/forms/componentCopyForm";
import { PageTitle } from "~/components/page/pageTitle";
import { useGetRepos } from "~/db/getRepositories";
import { useGetRepositoryComponentTree } from "~/db/createComponentCopy";
export { useGetRepositoryComponentTree };

export default component$(() => {
  const sourceComponentTree = useGetRepositoryComponentTree();
  const repos = useGetRepos();
  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        rootClassNames="shadow-lg dark:bg-kunai-blue-600/50 bg-kunai-blue-100/50 w-full"
        divider={false}
      >
        <div q:slot="body">
          <ComponentCopyForm
            repositories={repos.value.data?.repositories ?? []}
            sourceComponentTree={sourceComponentTree.value}
          />
        </div>
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Copy Components",
};
