import { component$, useContext } from "@builder.io/qwik";
import { KunaiLogo } from "../icons/kunaiLogo";
import { darkModeContext } from "~/routes/layout";

export default component$(() => {
  const darkMode = useContext(darkModeContext);

  return (
    <header>
      <div class="container flex items-center justify-between">
        <div class="inline-block pt-4">
          <a href="/" title="kunai" class="block flex items-center gap-2">
            <KunaiLogo
              height={50}
              width={143}
              logoColor={darkMode.darkMode ? "white" : "#1E2B4D"}
            />
            <span
              class={`h-12 text-3xl ${darkMode.darkMode ? "text-white" : "text-kunai-blue-900"}`}
            >
              K &nbsp; U &nbsp; N &nbsp; A &nbsp; I
            </span>
          </a>
        </div>
      </div>
    </header>
  );
});
