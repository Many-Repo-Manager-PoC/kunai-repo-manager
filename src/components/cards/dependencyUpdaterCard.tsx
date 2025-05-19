import { component$ } from "@builder.io/qwik";
import { BaseCard } from "./baseCard";
import { Chip, Button } from "@kunai-consulting/kunai-design-system";
import type { Repo, PackageJson } from "~/db/types";
import semver from "semver";

interface DependencyUpdaterCardProps {
  repos: Repo[];
  repo: Repo;
  packageJson: PackageJson[];
}

export const DependencyUpdaterCard = component$<DependencyUpdaterCardProps>(
  ({ repo, packageJson }) => {
    const currentVersion =
      packageJson.find((pkg) => pkg.repo === repo.name)?.packageJson?.version ||
      "No version";
    const currentRepoName = repo.name as string;
    const dependentRepos = new Set<[string, string]>();

    // Find all repos that depend on the current repo
    packageJson.forEach((pkg) => {
      const { dependencies, devDependencies } = pkg.packageJson ?? {};
      const repoName = pkg.packageJson?.name ?? "";

      const checkDependencies = (deps: Record<string, string> | undefined) => {
        if (!deps) return;
        Object.entries(deps).forEach(([dep, version]) => {
          if (dep.includes(currentRepoName)) {
            dependentRepos.add([repoName, version]);
          }
        });
      };

      checkDependencies(dependencies ?? undefined);
      checkDependencies(devDependencies ?? undefined);
    });

    const getChipColor = (version: string) => {
      if (version === "No version" || currentVersion === "No version") {
        return "dark:bg-kunai-blue-300";
      }

      const cleanVersion = version.replace(/[\^~>=<]/g, "");
      const cleanCurrentVersion = currentVersion.replace(/[\^~>=<]/g, "");

      if (semver.eq(cleanVersion, cleanCurrentVersion)) {
        return "bg-green-300";
      } else if (semver.lt(cleanVersion, cleanCurrentVersion)) {
        return "bg-yellow-200";
      }
      return "dark:bg-kunai-blue-300";
    };

    const needsUpdate = (version: string) => {
      if (version === "No version" || currentVersion === "No version") {
        return false;
      }
      const cleanVersion = version.replace(/[\^~>=<]/g, "");
      const cleanCurrentVersion = currentVersion.replace(/[\^~>=<]/g, "");
      return semver.lt(cleanVersion, cleanCurrentVersion);
    };

    return (
      <BaseCard rootClassNames="w-full lg:w-full md:w-2/3 bg-white/50 dark:bg-kunai-blue-600/50 w-full cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <div
          q:slot="header"
          class="flex items-center justify-between w-full p-2"
        >
          <span class="text-lg font-large">{repo.name}</span>
          <span class="text-sm text-kunai-blue-100">
            Current version: {currentVersion}
          </span>
        </div>
        <div q:slot="body" class="flex flex-col gap-2 p-2 h-[calc(100%-4rem)]">
          <div class="flex-grow dark:text-white">
            <h4 class="text-sm text-center">
              Repositories using this dependency:
            </h4>
          </div>

          <div class="flex flex-col gap-2 mt-2 text-sm p-2 rounded-md overflow-y-auto">
            <div class="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-600">
              <div class="font-semibold dark:text-white w-1/2 text-left">
                Repository
              </div>
              <div class="font-semibold dark:text-white w-1/4 text-center">
                Using Version
              </div>
              <div class="font-semibold dark:text-white w-1/4 text-right">
                Action
              </div>
            </div>
            {Array.from(dependentRepos).map(([repoName, version]) => (
              <div
                key={`${repoName}-${version}`}
                class="flex justify-between items-center py-2"
              >
                <div class="dark:text-white w-1/2 flex justify-start break-words">
                  {repoName || "No repo name"}
                </div>
                <div class="w-1/4 flex justify-center">
                  <Chip.Root
                    variant="outline"
                    class={`${getChipColor(version)} text-xs shrink-0`}
                  >
                    {version || "No version"}
                  </Chip.Root>
                </div>
                <div class="w-1/4 flex justify-end">
                  {needsUpdate(version) && (
                    <Button
                      variant="primary"
                      size="sm"
                      class="bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Update to current version
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BaseCard>
    );
  },
);
