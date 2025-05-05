import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { CreateRepositoryForm } from "~/components/forms/createRepoForm";
export default component$(() => {
  return (
    <div class="container container-center">
      <h1>
        <span class="highlight">Create</span> Repositories
      </h1>
      <CreateRepositoryForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create a Repository",
};
