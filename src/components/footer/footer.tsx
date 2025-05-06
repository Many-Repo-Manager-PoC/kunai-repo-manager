import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="fixed bottom-0 left-0 right-0 w-full">
      <div
        class="w-full flex justify-center items-center 
          dark:bg-kunai-blue-900 bg-kunai-blue-200"
      >
        <a
          href="https://open-source.kunaico.com/"
          class="block text-sm text-center no-underline py-3 leading-relaxed md:[&>span]:inline [&>span]:block dark:text-white text-kunai-blue-900"
        >
          a K U N A I Open Source Project
        </a>
      </div>
    </footer>
  );
});
