import { component$, Slot, useContext } from "@builder.io/qwik";
import { darkModeContext } from "~/routes/layout";

export default component$(() => {
  const darkMode = useContext(darkModeContext);

  return (
    <>
      <div
        class={`min-h-screen flex flex-col relative ${
          darkMode.darkMode
            ? "text-white bg-kunai-blue-900"
            : "text-gray-900 bg-kunai-blue-200"
        }`}
      >
        <Slot name="header"></Slot>
        <div
          class={`absolute w-full h-full ${
            darkMode.darkMode ? "bg-gradient-dark" : "bg-gradient-light"
          }`}
        />
        <div class="flex flex-grow justify-center items-center relative pt-16 pb-16">
          <div class="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl">
            <Slot />
          </div>
        </div>
        <Slot name="footer"></Slot>
      </div>
    </>
  );
});
