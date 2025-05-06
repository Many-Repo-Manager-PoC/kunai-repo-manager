import {
  component$,
  Slot,
  createContextId,
  useContextProvider,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Page from "~/components/page/page";

export interface DarkModeContext {
  darkMode: boolean;
}

export const darkModeContext = createContextId<DarkModeContext>("darkMode");

export const useDarkModeLoader = routeLoader$(() => {
  return {
    darkMode: false,
  };
});

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const darkMode = useDarkModeLoader();
  useContextProvider(darkModeContext, darkMode.value);

  return (
    <Page>
      <main>
        <Slot />
      </main>
    </Page>
  );
});
