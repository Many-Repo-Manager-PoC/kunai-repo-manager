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
      <BaseCard>
        <div q:slot="header" class="flex justify-between items-center">
          <h4 class="text-lg font-bold">{repo.name}</h4>
        </div>
        <div q:slot="body">
          <h4 class="text-sm text-gray-600 text-center">
            Current version: {currentVersion}
          </h4>
          {Array.from(dependentRepos).map(([repoName, version]) => (
            <div
              key={`${repoName}-${version}`}
              class="flex justify-between items-center py-2"
            >
              <div class="body">{repoName || "No repo name"}</div>
              <Chip.Root variant="outline" class="text-sm">
                {version || "No version"}
              </Chip.Root>
            </div>
          ))}
        </div>
        <div q:slot="footer"></div>
      </BaseCard>
    );
  },
);
