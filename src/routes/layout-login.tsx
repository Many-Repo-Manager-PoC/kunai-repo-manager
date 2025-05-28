import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Page from "~/components/page/page";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import Toggle from "~/components/toggle/toggle";

export const onGet: RequestHandler = async ({
  cacheControl,
  redirect,
  sharedMap,
  request,
}) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <Page>
      <main>
        <Header q:slot="header">
          <Toggle />
        </Header>
        <Slot />
        <Footer q:slot="footer" />
      </main>
    </Page>
  );
});
