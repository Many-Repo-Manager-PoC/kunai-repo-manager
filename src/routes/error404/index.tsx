import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container container-center">
      <div class="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 class="text-4xl font-bold text-kunai-blue-900 dark:text-white">
          Error 404
        </h1>
        <p class="mt-4 text-2xl text-gray-600 dark:text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Error!",
};
