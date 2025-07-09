import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Page from "~/components/page/page";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import Toggle from "~/components/toggle/toggle";
import { ApplicationError } from "~/util/errors";
export {
  useCreateRepository,
  useCreateTemplateRepository,
} from "~/db/createRepository";
export { useGetRepos } from "~/db/getRepositories";
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
