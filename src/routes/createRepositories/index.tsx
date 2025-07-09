import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Button } from "@kunai-consulting/kunai-design-system";
import { BaseCard } from "~/components/cards/baseCard";
import { CreateRepositoryForm } from "~/components/forms/createRepoForm";
import { CreateRepositoryFromTemplateForm } from "~/components/forms/createRepoFromTemplateForm";
import { PageTitle } from "~/components/page/pageTitle";
import { useGetRepos } from "~/db/getRepositories";

export default component$(() => {
  const repos = useGetRepos();
  const showTemplateForm = useSignal(false);
  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        divider={false}
        rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50"
      >
        <div q:slot="header" class="w-full">
          <div class="flex justify-between items-center">
            <h4>New Repository</h4>
            <Button
              class="cursor-pointer text-sm"
              type="button"
              onClick$={() =>
                (showTemplateForm.value = !showTemplateForm.value)
              }
            >
              {showTemplateForm.value
                ? "Create from Scratch"
                : "Create from Template"}
            </Button>
          </div>
        </div>
        <div q:slot="body">
          {showTemplateForm.value ? (
            <CreateRepositoryFromTemplateForm
              repos={repos.value.data?.repositories ?? []}
            />
          ) : (
            <CreateRepositoryForm />
          )}
        </div>
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create a Repository",
};
