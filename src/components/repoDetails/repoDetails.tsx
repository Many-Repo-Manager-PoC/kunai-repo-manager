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
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
              Owner:
            </span>
            <span class="flex items-center gap-2">
              <img
                src={repoDetails?.owner?.avatar_url}
                alt={repoDetails?.owner?.login}
                class="w-6 h-6 rounded-full"
              />
              <a
                href={repoDetails?.owner?.html_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline"
              >
                {repoDetails?.owner?.login || "Unknown"}
              </a>
            </span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
              Description:
            </span>
            <span>
              {repoDetails?.description || "No description available"}
            </span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
              Language:
            </span>
            <span>{repoDetails?.language || "Not specified"}</span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
              License:
            </span>
            <span>
              {repoDetails?.license?.name || "No license information"}
            </span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
              Last Updated:
            </span>
            <span>{repoDetails?.updated_at || "Unknown"}</span>
          </div>

          {repoDetails?.homepage && (
            <div class="flex items-center gap-2 text-sm">
              <span class="font-bold text-gray-700 dark:text-white whitespace-nowrap">
                Homepage:
              </span>
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

        <div class="flex flex-col gap-4">
          <div class="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div class="flex items-center gap-1.5">
              <StarIcon class="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <span class="text-lg">{repoDetails?.stargazers_count || 0}</span>
              <span class="text-sm text-gray-500 ml-1">Stars</span>
            </div>
            <div class="flex items-center gap-1.5">
              <GitForkIcon class="h-5 w-5 text-blue-500 flex-shrink-0" />
              <span class="text-lg">{repoDetails?.forks_count || 0}</span>
              <span class="text-sm text-gray-500 ml-1">Forks</span>
            </div>
            <div class="flex items-center gap-1.5">
              <WatcherIcon class="h-5 w-5 text-purple-500 flex-shrink-0" />
              <span class="text-lg">{repoDetails?.watchers_count || 0}</span>
              <span class="text-sm text-gray-500 ml-1">Watchers</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CircleAlertIcon class="h-5 w-5 text-red-500 flex-shrink-0" />
              <span class="text-lg">{repoDetails?.open_issues_count || 0}</span>
              <span class="text-sm text-gray-500 ml-1">Issues</span>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="font-semibold mb-2">Topics</h4>
            <div class="flex flex-wrap gap-2">
              {repoDetails?.topics && repoDetails.topics.length > 0 ? (
                repoDetails.topics.map((topic) => (
                  <Chip.Root
                    class="dark:bg-kunai-blue-300 text-xs"
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
      </div>
    </div>
  );
});
