import { component$ } from "@builder.io/qwik";
import { KunaiLogo } from "../icons/kunaiLogo";
import { Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <header class="fixed top-0 left-0 w-full z-50">
      <div class="container flex items-center justify-between">
        <div class="inline-block py-4">
          <a href="/" title="kunai" class="block flex items-center gap-2">
            <KunaiLogo
              height={50}
              width={143}
              logoColor="currentColor"
              class="text-kunai-blue-900 dark:text-white"
            />
            <span class="h-12 text-3xl dark:text-white text-kunai-blue-900">
              K &nbsp; U &nbsp; N &nbsp; A &nbsp; I
            </span>
          </a>
        </div>
        <Slot />
      </div>
    </header>
  );
});
