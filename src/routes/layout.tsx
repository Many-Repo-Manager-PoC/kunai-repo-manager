import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Page from "~/components/page/page";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import Toggle from "~/components/toggle/toggle";
import { useCreateRepository } from "~/db/createRepository";
export { useCreateRepository };

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

  // Get session from shared map
  const session = sharedMap.get("session");

  // Only redirect if we're not already on the login page
  const url = new URL(request.url);
  if (!session?.accessToken && !url.pathname.startsWith("/home/login")) {
    throw redirect(302, "/home/login");
  }
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
