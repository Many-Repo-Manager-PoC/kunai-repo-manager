import {
  Button,
  Card,
  Chip,
  Divider,
} from "@kunai-consulting/kunai-design-system";
import {
  LuStar,
  LuGitFork,
  LuCode,
  LuExternalLink,
} from "@qwikest/icons/lucide";
import { component$ } from "@builder.io/qwik";
import { Repo } from "~/db/types";

export interface RepositoryCardProps {
  repo: Repo;
}

export const RepositoryCard = component$<RepositoryCardProps>(({ repo }) => {
  return (
    <Card.Root
      class="max-h-[32.5rem] max-w-[30rem] shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
      tabIndex={0}
    >
      <div class="flex-grow gap-3 flex flex-col">
        <div class="mb-2 flex items-center justify-between">
          <Card.Title class="flex items-center gap-2">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              width={40}
              height={40}
              class="h-10 w-10 rounded-full"
            />
            <span class="text-2xl font-semibold">{repo.name}</span>
          </Card.Title>

          <a
            href={repo.html_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 hover:text-blue-500 transition-colors"
            aria-label="View on GitHub"
          >
            <LuExternalLink class="h-5 w-5" />
          </a>
        </div>

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

        <div class="flex gap-6 mt-4 text-sm bg-gray-50 p-3 rounded-md">
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

      <div class="my-3 text-gray-300">
        <Divider />
      </div>

      <Card.Footer>
        <div class="flex w-full flex-wrap items-center gap-2">
          {repo.topics && repo.topics.length > 0 ? (
            repo.topics.map((topic) => (
              <Chip.Root variant="gold" key={topic}>
                <span>{topic}</span>
              </Chip.Root>
            ))
          ) : (
            <span class="text-sm text-gray-500">No topics available</span>
          )}
        </div>
      </Card.Footer>
    </Card.Root>
  );
});
