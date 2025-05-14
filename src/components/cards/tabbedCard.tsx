import { component$ } from "@builder.io/qwik";
import { Card, Divider, Tabs } from "@kunai-consulting/kunai-design-system";

import type { Repo, PackageJson } from "~/db/types";
import { DependencyUpdaterCard } from "./dependencyUpdaterCard";

export interface TabbedCardProps {
  repoDetails?: Repo;
  repos?: Repo[];
  packageJson?: PackageJson[];
}

export const TabbedCard = component$<TabbedCardProps>(
  ({ repoDetails, repos, packageJson }) => {
    return (
      <Card.Root class="shadow-lg min-h-[600px]">
        <Tabs.Root vertical class="gap-3 grid grid-flow-col min-h-[600px]">
          <Tabs.List class="flex flex-col gap-5 border-r border-gray-200 dark:border-gray-700">
            <Tabs.Tab selected>
              <div class="flex items-center gap-2">
                <span>Details</span>
              </div>
            </Tabs.Tab>
            <Tabs.Tab>
              <div class="flex items-center gap-2">
                <span>Dependencies</span>
              </div>
            </Tabs.Tab>
            <Tabs.Tab>
              <div class="flex items-center gap-2">
                <span>Dependents</span>
              </div>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel class="col-span-10">
            <Card.Title>
              <div class="flex items-center gap-3">
                <span class="text-3xl font-large">{repoDetails?.name}</span>
              </div>
            </Card.Title>
            <div class="text-gray-300">
              <Divider />
            </div>
          </Tabs.Panel>
          <Tabs.Panel class="col-span-10">
            <Card.Title>
              <span class="text-3xl font-large">Dependencies</span>
            </Card.Title>
            <div class="text-gray-300">
              <Divider />
            </div>
          </Tabs.Panel>
          <Tabs.Panel class="col-span-10">
            <Card.Title>
              <span class="text-3xl font-large">Dependents</span>
            </Card.Title>
            <DependencyUpdaterCard
              repos={repos || []}
              repo={repoDetails ? repoDetails : ({} as Repo)}
              packageJson={packageJson || []}
            />

            <div class="text-gray-300">
              <Divider />
            </div>
          </Tabs.Panel>
        </Tabs.Root>
      </Card.Root>
    );
  },
);
