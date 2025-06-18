import { Card, Chip } from "@kunai-consulting/kunai-design-system";
import {
  LuStar,
  LuGitFork,
  LuCode,
  LuExternalLink,
  LuGithub,
} from "@qwikest/icons/lucide";
import { component$ } from "@builder.io/qwik";
import type { GetRepositoryReturns } from "../../../dbschema/queries";
import { BaseCard } from "./baseCard";

export interface RepositoryCardProps {
  repo: GetRepositoryReturns;
}

export const RepositoryCard = component$<RepositoryCardProps>(({ repo }) => {
  return (
    <BaseCard rootClassNames="h-full dark:bg-kunai-blue-600 w-full cursor-pointer hover:shadow-xl transition-shadow duration-300">
      <div q:slot="header" class="flex items-center gap-2 w-full p-2">
        <LuGithub class="h-15 w-15" />

        <span class="text-lg font-large">{repo?.name}</span>

        <a
          href={repo?.html_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-blue-500 transition-colors ml-auto flex-shrink-0"
          aria-label="View on GitHub"
        >
          <LuExternalLink class="h-5 w-5 dark:text-white" />
        </a>
      </div>
      <div q:slot="body" class="flex flex-col gap-2 p-2">
        <div class="flex-grow dark:text-white">
          <Card.Description class="line-clamp-3">
            {repo?.description || "-"}
          </Card.Description>
        </div>

        <div class="flex items-center gap-2 dark:text-white text-sm">
          <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
            License:
          </span>
          <span class="truncate">
            {repo?.license?.name || "No license information"}
          </span>
        </div>

        <div class="flex items-center gap-2 dark:text-white text-sm">
          <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
            Last Updated:
          </span>
          <span class="truncate">{repo?.updated_at}</span>
        </div>

        <div class="flex gap-4 mt-2 text-sm bg-gray-50 p-2 rounded-md dark:bg-kunai-blue-200">
          <div class="flex items-center gap-1.5">
            <LuStar class="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span>{repo?.stargazers_count || 0}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <LuGitFork class="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span>{repo?.forks_count || 0}</span>
          </div>
          {repo?.language && (
            <div class="flex items-center gap-1.5">
              <LuCode class="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{repo?.language}</span>
            </div>
          )}
        </div>
      </div>
      <div q:slot="footer" class="flex w-full flex-wrap items-center gap-1">
        {repo?.topics && repo?.topics.length > 0 ? (
          repo?.topics
            .join(",")
            .split(",")
            .map((topic: string) => (
              <Chip.Root
                class="dark:bg-kunai-blue-300 text-xs"
                variant="outline"
                key={topic}
              >
                <span class="truncate">{topic.trim()}</span>
              </Chip.Root>
            ))
        ) : (
          <span class="text-sm text-gray-500">No topics available</span>
        )}
      </div>
    </BaseCard>
  );
});
