import { Card, Chip } from "@kunai-consulting/kunai-design-system";
import {
  LuStar,
  LuGitFork,
  LuCode,
  LuExternalLink,
} from "@qwikest/icons/lucide";
import { component$ } from "@builder.io/qwik";
import type { Repo } from "~/db/types";
import { BaseCard } from "./baseCard";

export interface RepositoryCardProps {
  repo: Repo;
}

export const RepositoryCard = component$<RepositoryCardProps>(({ repo }) => {
  return (
    <BaseCard rootClassNames="max-h-[32.5rem] dark:bg-red-400 max-w-[30rem] cursor-pointer hover:shadow-xl transition-shadow duration-300">
      <div q:slot="header" class="flex items-center gap-2 w-full">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          width={40}
          height={40}
          class="h-10 w-10 rounded-full"
        />
        <span>{repo.name}</span>

        <a
          href={repo.html_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-blue-500 transition-colors ml-auto"
          aria-label="View on GitHub"
        >
          <LuExternalLink class="h-5 w-5" />
        </a>
      </div>
      <div q:slot="body" class="flex flex-col gap-2">
        <div class="flex-grow">
          <Card.Description>
            {repo.description || "No description available"}
          </Card.Description>
        </div>

        <div class="flex items-center gap-2">
          <span class="font-bold text-gray-700">License:</span>
          <span>{repo.license?.name || "No license information"}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="font-bold text-gray-700">Last Updated:</span>
          <span>{repo.updated_at}</span>
        </div>

        <div class="flex gap-6 mt-4 text-sm bg-gray-50 p-3 rounded-md dark:bg-red-200">
          <div class="flex items-center gap-1.5">
            <LuStar class="h-5 w-5 text-yellow-500" />
            <span>{repo.stargazers_count || 0}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <LuGitFork class="h-5 w-5 text-blue-500" />
            <span>{repo.forks_count || 0}</span>
          </div>
          {repo.language && (
            <div class="flex items-center gap-1.5">
              <LuCode class="h-5 w-5 text-green-500" />
              <span>{repo.language}</span>
            </div>
          )}
        </div>
      </div>
      <div q:slot="footer" class="flex w-full flex-wrap items-center gap-2">
        {repo.topics && repo.topics.length > 0 ? (
          repo.topics.map((topic) => (
            <Chip.Root class="dark:bg-red-300" variant="outline" key={topic}>
              <span>{topic}</span>
            </Chip.Root>
          ))
        ) : (
          <span class="text-sm text-gray-500">No topics available</span>
        )}
      </div>
    </BaseCard>
  );
});
