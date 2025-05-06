import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    //TODO: CANT FIGURE OUT WHY THE GRADIENT IS NOT WORKING
    <div
      class="min-h-screen flex flex-col relative bg-gradient-light dark:bg-gradient-dark
 dark:text-white  text-gray-900 "
    >
      <Slot name="header"></Slot>
      <div class="flex flex-grow justify-center items-center relative pt-16 pb-16">
        <div class="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl">
          <Slot />
        </div>
      </div>
      <Slot name="footer"></Slot>
    </div>
  );
});
