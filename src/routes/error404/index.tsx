import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container container-center">
      <h0>
        <span class="highlight">Error</span> 404
      </h0>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Error!",
};
