import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { PageTitle } from "~/components/page/pageTitle";
import { TabbedCard } from "~/components/cards/tabbedCard";
import type { Repo } from "~/db/types";

export default component$(() => {
  // TODO: This is a temporary solution to get the repo details for dev purposes
  const testRepo: Repo = {
    name: "Test",
    owner: {
      login: "Test",
      avatar_url: "Test",
      html_url: "Test",
      type: "Test",
    },
  };

  return (
    <div class="container container-center min-h-screen">
      <PageTitle />
      <TabbedCard repoDetails={testRepo} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Repository Details",
};
