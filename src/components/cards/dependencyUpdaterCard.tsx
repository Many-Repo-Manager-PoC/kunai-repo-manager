import { component$ } from "@builder.io/qwik";
import { BaseCard } from "./baseCard";
import { Chip } from "@kunai-consulting/kunai-design-system";
import type { Repo, PackageJson } from "~/db/types";

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
    packageJson?.forEach((pkg) => {
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

    return (
      <BaseCard rootClassNames="h-full bg-white/50 dark:bg-kunai-blue-600/50 w-full cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <div q:slot="header" class="flex items-center gap-2 w-full p-2">
          <span class="text-lg font-large">{repo.name}</span>
        </div>
        <div q:slot="body" class="flex flex-col gap-2 p-2">
          <div class="flex-grow dark:text-white">
            <h4 class="text-sm text-center">
              Current version: {currentVersion}
            </h4>
          </div>

          <div class="flex flex-col gap-2 mt-2 text-sm p-2 rounded-md">
            {Array.from(dependentRepos).map(([repoName, version]) => (
              <div
                key={`${repoName}-${version}`}
                class="flex justify-between items-center py-2"
              >
                <div class="dark:text-white">{repoName || "No repo name"}</div>
                <Chip.Root
                  variant="outline"
                  class="dark:bg-kunai-blue-300 text-xs"
                >
                  {version || "No version"}
                </Chip.Root>
              </div>
            ))}
          </div>
        </div>
        <div
          q:slot="footer"
          class="flex w-full flex-wrap items-center gap-1"
        ></div>
      </BaseCard>
    );
  },
);
