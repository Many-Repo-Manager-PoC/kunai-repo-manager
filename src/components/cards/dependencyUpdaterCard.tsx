import { component$ } from "@builder.io/qwik";
import { BaseCard } from "./baseCard";
import { Chip } from "@kunai-consulting/kunai-design-system";
import semver from "semver";
import { DependencyUpdaterModal } from "../modals/dependencyUpdaterModal";
import { postWorkflowDispatchEvent } from "~/routes/layout";
import {
  type GetRepositoryReturns,
  type GetPackageJsonReturns,
} from "../../../dbschema/queries";
import { useGetAllPackageJsons } from "~/hooks";

interface DependencyUpdaterCardProps {
  repos: GetRepositoryReturns[];
  repo: GetRepositoryReturns;
  packageJson: GetPackageJsonReturns;
}

export const DependencyUpdaterCard = component$<DependencyUpdaterCardProps>(
  ({ repo, packageJson }) => {
    const allPackageJsons = useGetAllPackageJsons();
    const currentRepoVersion = packageJson?.package_version ?? "No version";
    const currentRepoName = repo?.name ?? "";
    const action = postWorkflowDispatchEvent();

    // Helper to determine chip color based on version comparison
    const getChipColor = (version: string) => {
      if (version === "No version" || currentRepoVersion === "No version") {
        return "dark:bg-kunai-blue-300";
      }
      const cleanVersion = version.replace(/[\^~>=<]/g, "");
      const cleanCurrentVersion = currentRepoVersion.replace(/[\^~>=<]/g, "");
      if (semver.eq(cleanVersion, cleanCurrentVersion)) {
        return "bg-green-300";
      } else if (semver.lt(cleanVersion, cleanCurrentVersion)) {
        return "bg-yellow-200";
      }
      return "dark:bg-kunai-blue-300";
    };

    // Helper to determine if an update is needed
    const needsUpdate = (version: string) => {
      if (version === "No version" || currentRepoVersion === "No version") {
        return false;
      }
      const cleanVersion = version.replace(/[\^~>=<]/g, "");
      const cleanCurrentVersion = currentRepoVersion.replace(/[\^~>=<]/g, "");
      return semver.lt(cleanVersion, cleanCurrentVersion);
    };

    // Find all repos that depend on the current repo
    // The dependencies and dev_dependencies are arrays of objects with .name and .dependency_version
    const dependentRepos: Array<[string, string]> = [];
    allPackageJsons.value.forEach((pkg) => {
      if (!pkg) return;
      const repoName = pkg.name ?? "";
      // Check dependencies
      (pkg.dependencies ?? []).forEach((dep) => {
        if (dep.name === currentRepoName) {
          dependentRepos.push([repoName, dep.dependency_version]);
        }
      });
      // Check devDependencies
      (pkg.dev_dependencies ?? []).forEach((dep) => {
        if (dep.name === currentRepoName) {
          dependentRepos.push([repoName, dep.dependency_version]);
        }
      });
    });

    return (
      <BaseCard rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50 w-full">
        <div
          q:slot="header"
          class="flex items-center justify-between w-full p-2"
        >
          <span class="text-lg font-large">{repo?.name}</span>
          <span class="text-sm text-kunai-blue-100">
            Current version: {currentRepoVersion}
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
            {dependentRepos.length === 0 ? (
              <div class="text-center text-gray-500 dark:text-gray-300 py-4">
                No repositories found using this dependency.
              </div>
            ) : (
              dependentRepos.map(([repoName, version]) => (
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
                      <div class="flex justify-end">
                        <DependencyUpdaterModal
                          packageToUpdate={currentRepoName}
                          packageVersion={currentRepoVersion}
                          repoToUpdate={repoName}
                          oldVersion={version}
                          dispatchEvent={action}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div q:slot="footer"></div>
      </BaseCard>
    );
  },
);
