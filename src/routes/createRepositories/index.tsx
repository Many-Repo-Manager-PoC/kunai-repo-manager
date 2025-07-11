import { component$ } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";
import { BaseCard } from "~/components/cards/baseCard";
import { CreateRepositoryForm } from "~/components/forms/createRepoForm";
import { PageTitle } from "~/components/page/pageTitle";

export default component$(() => {
  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        divider={false}
        rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50"
      >
        <div q:slot="header">
          <h4>New Repository</h4>
        </div>
        <div q:slot="body">
          <CreateRepositoryForm />
        </div>
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create a Repository",
};
