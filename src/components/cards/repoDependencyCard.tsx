import { component$, $ } from "@builder.io/qwik";
import { BaseCard } from "./baseCard";
import { Chip } from "@kunai-consulting/kunai-design-system";
import { useGetDependenciesForRepo } from "~/hooks";
import { useRefreshPackageJson } from "~/actions/packageJson.server";

interface RepoDependencyCardProps {
  repository_id: number;
  repository_name: string;
}

export const RepoDependencyCard = component$<RepoDependencyCardProps>(
  ({ repository_id, repository_name }) => {
    const allDependencies = useGetDependenciesForRepo(repository_id || 0);

    const refreshPackageJson = useRefreshPackageJson;

    const handleRefreshDependencies = $(async () => {
      if (repository_name) {
        await refreshPackageJson(repository_name);
        window.location.reload();
      }
    });

    return (
      <BaseCard rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50 w-full">
        <div
          q:slot="header"
          class="flex items-center justify-between gap-2 w-full p-2"
        >
          <span class="text-lg font-large">{repository_name}</span>
          <button
            onClick$={handleRefreshDependencies}
            class="px-3 py-1 text-sm bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white rounded-md transition-colors"
          >
            Refresh Dependencies
          </button>
        </div>
        <div q:slot="body" class="flex flex-col gap-2 p-2 h-[calc(100%-4rem)]">
          <div class="flex-grow dark:text-white">
            <h4 class="text-sm text-center">Repository dependencies</h4>
          </div>

          <div class="flex flex-col gap-2 mt-2 text-sm p-2 rounded-md overflow-y-auto">
            <div class="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-600">
              <div class="font-semibold dark:text-white w-1/3">Package</div>
              <div class="font-semibold dark:text-white w-1/3 text-center">
                Version
              </div>
              <div class="font-semibold dark:text-white w-1/3 text-right">
                Type
              </div>
            </div>
            {allDependencies.value?.map((dependency) => {
              const dependency_type =
                "dependency_type" in dependency
                  ? dependency.dependency_type
                  : undefined;
              return (
                <div
                  key={`${dependency.name}-${dependency.dependency_version}`}
                  class="flex justify-between items-center py-2"
                >
                  <span class="dark:text-white w-1/3 truncate">
                    {dependency.name}
                  </span>
                  <span class="dark:text-white w-1/3 text-center">
                    {dependency.dependency_version}
                  </span>
                  <div class="w-1/3 flex justify-end">
                    <Chip.Root
                      class={`text-xs shrink-0  ${
                        dependency_type === "Prod"
                          ? "bg-kunai-blue-400 dark:bg-kunai-blue-400 text-kunai-blue-100"
                          : "bg-kunai-blue-300 dark:bg-kunai-blue-300 text-kunai-blue-900"
                      }`}
                    >
                      {dependency_type || "Unknown"}
                    </Chip.Root>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BaseCard>
    );
  },
);
