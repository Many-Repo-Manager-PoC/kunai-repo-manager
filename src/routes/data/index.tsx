import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { Button, Card } from "@kunai-consulting/kunai-design-system";
import { LuPackage } from "@qwikest/icons/lucide";
import { getAllPackageJson, importPackageJson } from "~/db/packageActions";
import { PageTitle } from "~/components/page/pageTitle";

export const head: DocumentHead = {
  title: "Package Data",
  meta: [
    {
      name: "description",
      content: "View and manage package.json data",
    },
  ],
};

export default component$(() => {
  const packages = useSignal<Awaited<ReturnType<typeof getAllPackageJson>>>([]);
  const fileInputRef = useSignal<HTMLInputElement>();

  $(() => {
    getAllPackageJson().then((data) => {
      packages.value = data;
    });
  })();

  const handleFileUpload = $(async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      try {
        const text = await file.text();
        const packageJson = JSON.parse(text);
        const repo = packageJson.name || file.name.replace(".json", "");

        await importPackageJson({
          repo,
          packageJson,
          error: "",
        });

        // Refresh the package list
        const data = await getAllPackageJson();
        packages.value = data;
      } catch (error) {
        console.error("Error importing package.json:", error);
      }
    }
  });

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between">
        <PageTitle title="Package Data" />
        <div class="relative">
          <input
            type="file"
            accept=".json"
            class="hidden"
            ref={fileInputRef}
            onChange$={handleFileUpload}
          />
          <Button
            kind="secondary"
            class="flex items-center gap-2"
            onClick$={() => fileInputRef.value?.click()}
          >
            <LuPackage class="w-4 h-4" />
            Import Package.json
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {packages.value.length === 0 && (
          <div class="col-span-full">
            <p class="text-center text-kunai-gray-600 dark:text-kunai-gray-400">
              No package data found. Try importing package.json files.
            </p>
          </div>
        )}

        {packages.value.map((pkg) => (
          <Card.Root key={pkg.repo} class="p-4">
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-semibold">
                <Link
                  href={`/data/${pkg.repo}`}
                  class="text-kunai-blue-600 hover:text-kunai-blue-700 dark:text-kunai-blue-400 dark:hover:text-kunai-blue-300"
                >
                  {pkg.packageJson?.name || pkg.repo}
                </Link>
                {pkg.packageJson?.version && (
                  <p class="text-sm text-kunai-gray-600 dark:text-kunai-gray-400">
                    Version: {pkg.packageJson.version}
                  </p>
                )}
              </h3>
            </div>
          </Card.Root>
        ))}
      </div>
    </div>
  );
});
