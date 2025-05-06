import { component$, useContext } from "@builder.io/qwik";
import { darkModeContext } from "~/routes/layout";

export default component$(() => {
  const darkMode = useContext(darkModeContext);
  return (
    <footer class="fixed bottom-0 left-0 right-0 w-full">
      <div
        class={`w-full flex justify-center items-center ${
          darkMode.darkMode ? "bg-kunai-blue-900" : "bg-kunai-blue-200"
        }`}
      >
        <a
          href="https://open-source.kunaico.com/"
          class={`block text-sm text-center no-underline py-3 leading-relaxed md:[&>span]:inline [&>span]:block ${
            darkMode.darkMode ? "text-white" : "text-kunai-blue-900"
          }`}
        >
          a K U N A I Open Source Project
        </a>
      </div>
    </footer>
  );
});
