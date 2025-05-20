import { component$ } from "@builder.io/qwik";
import { LuSun, LuMoon } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div class="fixed top-4 right-4 z-50">
      <label class="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-00 bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-kunai-blue-500 focus:ring-offset-2">
        <input
          type="checkbox"
          id="items"
          class="sr-only"
          onClick$={() => {
            const isDark = document.documentElement.classList.contains("dark");
            document.documentElement.classList.toggle("dark", !isDark);
            localStorage.setItem("theme", !isDark ? "dark" : "light");
          }}
        />
        <span class="dark:translate-x-7 translate-x-1 inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out" />
        <LuSun class="absolute left-1.5 h-5 w-5 text-yellow-500 cursor-pointer" />
        <LuMoon class="absolute right-1.5 h-5 w-5 text-gray-400 cursor-pointer" />
      </label>
    </div>
  );
});
