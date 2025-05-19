import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    //TODO: Fixed gradient background.  Need to apply background color for dark mode.
    <div
      class="min-h-screen flex flex-col relative bg-[image:var(--background-image-gradient-light)] dark:bg-[image:var(--background-image-gradient-dark)]
 dark:text-white  text-gray-900 bg-kunai-blue-200 dark:bg-kunai-blue-900"
    >
      <Slot name="header" />
      <div class="flex flex-grow justify-center items-center relative py-24 px-4 sm:px-6 md:px-8">
        <div class="w-full md:max-w-7xl">
          <Slot />
        </div>
      </div>
      <Slot name="footer" />
    </div>
  );
});
