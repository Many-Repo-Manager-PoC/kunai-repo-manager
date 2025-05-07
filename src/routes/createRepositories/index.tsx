import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { BaseCard } from "~/components/cards/baseCard";
import { CreateRepositoryForm } from "~/components/forms/createRepoForm";

export default component$(() => {
  return (
    <div class="container container-center">
      <h1 class="text-5xl font-semibold">Create a Repository</h1>
      <BaseCard divider={false}>
        <CreateRepositoryForm />
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create a Repository",
};
