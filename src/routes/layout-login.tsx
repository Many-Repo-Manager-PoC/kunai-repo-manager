import { component$, Slot } from "@qwik.dev/core";
import { routeLoader$ } from "@qwik.dev/router";
import Page from "~/components/page/page";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import Toggle from "~/components/toggle/toggle";

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
