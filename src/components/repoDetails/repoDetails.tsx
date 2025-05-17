import { component$ } from "@builder.io/qwik";
import { Chip } from "@kunai-consulting/kunai-design-system";
import { Repo } from "~/db/types";
import {
  StarIcon,
  GitForkIcon,
  WatcherIcon,
  CircleAlertIcon,
  GitHubIcon,
} from "~/components/icons";

export interface RepoDetailsProps {
  repoDetails?: Repo;
}

export const RepoDetails = component$<RepoDetailsProps>(({ repoDetails }) => {
  return (
    <div class="flex flex-col gap-6 p-4 w-full lg:w-full md:w-1/2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img
            src={repoDetails?.owner?.avatar_url}
            alt={repoDetails?.owner?.login}
            class="w-10 h-10 rounded-full"
          />
          <h4>
            <span class="dark:text-white">{repoDetails?.name}</span>
          </h4>
        </div>
        <a
          href={repoDetails?.html_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 bg-gray-50/50 dark:bg-kunai-blue-200 text-kunai-blue-800 px-4 py-2 rounded-md"
        >
          <GitHubIcon class="h-5 w-5" />
          <span>View on GitHub</span>
        </a>
      </div>
      <div class="bg-gray-50/50 p-4 rounded-md dark:bg-kunai-blue-200">
        <p>{repoDetails?.description || "No description available"}</p>
      </div>
      <div class="flex flex-wrap gap-10 bg-gray-50/50 p-4 rounded-md dark:bg-kunai-blue-200">
        <div class="flex items-center gap-2">
          <StarIcon class="h-5 w-5 text-yellow-500" />
          <span class="font-medium">{repoDetails?.stargazers_count || 0}</span>
          <span class="text-sm">Stars</span>
        </div>

        <div class="flex items-center gap-2">
          <GitForkIcon class="h-5 w-5 text-blue-500" />
          <span class="font-medium">{repoDetails?.forks_count || 0}</span>
          <span class="text-sm">Forks</span>
        </div>

        <div class="flex items-center gap-2">
          <WatcherIcon class="h-5 w-5 text-purple-500" />
          <span class="font-medium">{repoDetails?.watchers_count || 0}</span>
          <span class="text-sm">Watchers</span>
        </div>

        <div class="flex items-center gap-2">
          <CircleAlertIcon class="h-5 w-5 text-red-500" />
          <span class="font-medium">{repoDetails?.open_issues_count || 0}</span>
          <span class="text-sm">Issues</span>
        </div>
      </div>
      <div>
        <h4 class="mb-3">
          <span class="dark:text-white">Repository Information</span>
        </h4>
        <div class="border-t border-gray-500 dark:border-gray-300 divide-y divide-gray-500 dark:divide-gray-300">
          <div class="py-3 flex dark:text-white">
            <span class="font-medium w-1/3">Language</span>
            <div class="flex items-center gap-2">
              {repoDetails?.language ? (
                <>
                  <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>{repoDetails.language}</span>
                </>
              ) : (
                <span>Not specified</span>
              )}
            </div>
          </div>

          <div class="py-3 flex dark:text-white">
            <span class="font-medium w-1/3">License</span>
            <span>
              {repoDetails?.license?.name || "No license information"}
            </span>
          </div>

          <div class="py-3 flex dark:text-white">
            <span class="font-medium w-1/3">Last Updated</span>
            <span>{repoDetails?.updated_at || "Unknown"}</span>
          </div>

          {repoDetails?.homepage && (
            <div class="py-3 flex">
              <span class="font-medium w-1/3">Homepage</span>
              <a
                href={repoDetails.homepage}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline truncate"
              >
                {repoDetails.homepage}
              </a>
            </div>
          )}
        </div>
      </div>
      <div>
        <h4 class="mb-3">
          <span class="dark:text-white">Topics</span>
        </h4>
        <div class="flex flex-wrap gap-2">
          {repoDetails?.topics && repoDetails.topics.length > 0 ? (
            repoDetails.topics.map((topic) => (
              <Chip.Root
                class="bg-gray-100 dark:bg-kunai-blue-300 text-sm"
                variant="outline"
                key={topic}
              >
                <span class="truncate">{topic}</span>
              </Chip.Root>
            ))
          ) : (
            <span class="text-sm text-gray-500">No topics available</span>
          )}
        </div>
      </div>
    </div>
  );
});
