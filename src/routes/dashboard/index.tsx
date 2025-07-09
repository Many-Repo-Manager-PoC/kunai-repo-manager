import { component$ } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";

export default component$(() => {
  return (
    <div class="container container-center">
      <h1>
        <span class="highlight">Dashboard</span>
      </h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
};
