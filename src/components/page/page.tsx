import { component$, Slot, useContext } from "@builder.io/qwik";
import { darkModeContext } from "~/routes/layout";

export default component$(() => {
  const darkMode = useContext(darkModeContext);

  return (
    <div
      class={`min-h-screen relative ${
        darkMode.darkMode
          ? "text-white bg-kunai-blue-900"
          : "text-gray-900 bg-kunai-blue-200"
      }`}
    >
      <div
        class={`absolute top-[150px] left-[200px] w-full h-full -rotate-[5deg] ${
          darkMode.darkMode ? "bg-gradient-dark" : "bg-gradient-light"
        }`}
      ></div>
      <Slot />
    </div>
  );
});
