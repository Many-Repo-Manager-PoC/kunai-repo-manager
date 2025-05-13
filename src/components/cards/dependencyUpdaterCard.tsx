import { component$ } from "@builder.io/qwik";
import { BaseCard } from "./baseCard";
import type { Repo } from "~/db/types";

interface DependencyUpdaterCardProps {
  repos: Repo[];
  repo: Repo;
}

export const DependencyUpdaterCard = component$<DependencyUpdaterCardProps>(
  ({ repos, repo }) => {
    return (
      <BaseCard>
        <div q:slot="header">
          <h4>{repo.name}</h4>
        </div>
        <div q:slot="body">
          <div class="space-y-4">
            {repos.map((dependency) => (
              <div key={dependency.name} class="border-b pb-4 last:border-b-0">
                <div class="flex justify-between items-center">
                  <span class="font-medium">{dependency.name}</span>
                  <span class="text-gray-600 dark:text-gray-400">
                    {/* {dependency.version || "N/A"} */}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BaseCard>
    );
  },
);
