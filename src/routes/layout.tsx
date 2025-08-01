import { component$, Slot } from "@qwik.dev/core";
import { routeLoader$ } from "@qwik.dev/router";
import type { RequestHandler } from "@qwik.dev/router";
import Page from "~/components/page/page";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import Toggle from "~/components/toggle/toggle";
import { ApplicationError } from "~/util/errors";
export { useGetPackageJson } from "~/db/getPackageJson";
export { postWorkflowDispatchEvent } from "~/db/postWorkflowDispatchEvent";
export { useCreateComponentCopy } from "~/db/createComponentCopy";
export { usePutTopics } from "~/db/putTopics";

export const onGet: RequestHandler = async ({ cacheControl, sharedMap }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
  // Get session from shared map
  const session = sharedMap.get("session");
  if (!session || !session?.accessToken) {
    throw new ApplicationError({
      name: "UNAUTHORIZED",
      message: "Unauthorized",
    });
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
