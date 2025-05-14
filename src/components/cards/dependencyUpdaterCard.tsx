import { component$ } from "@builder.io/qwik";
import { BaseCard } from "./baseCard";
import type { Repo, PackageJson } from "~/db/types";

interface DependencyUpdaterCardProps {
  repos: Repo[];
  repo: Repo;
  packageJson: PackageJson[];
}

export const DependencyUpdaterCard = component$<DependencyUpdaterCardProps>(
  ({ repos, repo, packageJson }) => {
    const currentRepoPackage = packageJson.find(
      (pkg) => pkg.repo === repo.name,
    )?.packageJson;
    const dependencies = currentRepoPackage?.dependencies || {};
    const devDependencies = currentRepoPackage?.devDependencies || {};

    return (
      <BaseCard>
        <div q:slot="header">
          <h4>{repo.name}</h4>
        </div>
        <div q:slot="body">
          <div class="space-y-4">
            {Object.entries(dependencies).map(([name, version]) => {
              const matchingRepo = repos.find((r) => r.name === name);
              return (
                <div key={name} class="border-b pb-4 last:border-b-0">
                  <div class="flex justify-between items-center">
                    <span class="font-medium">{name}</span>
                    <span class="font-medium">{version}</span>
                    {matchingRepo && (
                      <span class="text-sm text-gray-500">
                        ({matchingRepo.name})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {Object.entries(devDependencies).map(([name, version]) => {
              const matchingRepo = repos.find((r) => r.name === name);
              return (
                <div key={name} class="border-b pb-4 last:border-b-0">
                  <div class="flex justify-between items-center">
                    <span class="font-medium">{name}</span>
                    <span class="font-medium">{version}</span>
                    {matchingRepo && (
                      <span class="text-sm text-gray-500">
                        ({matchingRepo.name})
                      </span>
                    )}
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
