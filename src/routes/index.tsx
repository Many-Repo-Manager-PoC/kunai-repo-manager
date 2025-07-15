import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, Link, useLocation } from "@builder.io/qwik-city";
import { useSignOut } from "~/routes/plugin@auth";
import { Button } from "@kunai-consulting/kunai-design-system";
import { DashboardCard } from "~/components/cards/dashboardCard";
import { Routes } from "~/config/routes";

export default component$(() => {
  const signOutSig = useSignOut();
  const location = useLocation();
  const owner = location.params.owner;
  const repoName = location.params.repoName;

  return (
    <>
      <div class="absolute top-20 right-4">
        <Form action={signOutSig}>
          <Button
            kind="secondary"
            class="mt-10 bg-kunai-gray-100 text-kunai-gray-700 hover:bg-kunai-gray-200 dark:bg-kunai-gray-800 dark:text-kunai-gray-300 dark:hover:bg-kunai-gray-700 outline outline-1 outline-kunai-gray-700 dark:outline-kunai-gray-300"
          >
            Sign Out
          </Button>
        </Form>
      </div>
      <div class="container mx-auto px-4 flex flex-col gap-4 mt-4 text-center items-center justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-max-3 gap-6 max-w-7xl mx-auto justify-center">
          <Link href={Routes.createRepos()} class="block" prefetch={false}>
            <DashboardCard
              title="Create Repositories"
              description="Set up new repositories with ease"
            />
          </Link>

          <Link href={Routes.allRepos()} class="block" prefetch={false}>
            <DashboardCard
              title="All Repositories"
              description="Browse and manage your repositories"
            />
          </Link>

          {owner && repoName && (
            <Link href={Routes.repoDetails(owner, repoName)} class="block">
              <DashboardCard
                title="Repository Details"
                description={`View details for ${repoName}`}
              />
            </Link>
          )}
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
