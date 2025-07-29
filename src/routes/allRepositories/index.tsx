import { component$, useSignal, $, useTask$ } from "@qwik.dev/core";
import { useNavigate, type DocumentHead } from "@qwik.dev/router";
import { RepositoryCard } from "~/components/cards/repositoryCard";
import { Button, Chip } from "@kunai-consulting/kunai-design-system";
import { BulkTopicsModal } from "~/components/modals/bulkTopicsModal";
import { PageTitle } from "~/components/page/pageTitle";
import { LuRotateCcw } from "@qwikest/icons/lucide";
import { Routes } from "~/config/routes";
export { usePutBulkTopics } from "~/db/putTopics";
import type { GetRepositoryReturns } from "../../../dbschema/queries";
import { useRefreshRepositories } from "~/actions/repository/repository.server";
import {
  useGetRepositories,
  useGetRepositoriesForAllTopics,
} from "~/hooks/repository.hooks";

export default component$(() => {
  const searchQuery = useSignal("");
  const selectedTopic = useSignal("");
  const selectedRepos = useSignal<string[]>([]);
  const isShow = useSignal(false);
  const navigate = useNavigate();

  const refreshResult = useRefreshRepositories();
  // Handle potential errors from the refresh operation
  useTask$(async () => {
    const result = await refreshResult;
    if (!result.success) {
      console.error("Failed to refresh repositories:", result.message);
    }
  });
  const queriedRepositories = useGetRepositories().value;

  const allTopics = useGetRepositoriesForAllTopics().value;
  console.log("allTopics", queriedRepositories);

  const repoTopicsMap = queriedRepositories.reduce(
    (acc: Record<string, string[]>, repo) => {
      if (repo.name) {
        acc[repo.name] = repo.topics || [];
      }
      return acc;
    },
    {},
  );

  const handleSelectAll = $(() => {
    const filteredRepos = queriedRepositories
      .filter((repo): repo is NonNullable<typeof repo> => {
        if (!repo) return false;
        const matchesSearch =
          !searchQuery.value ||
          repo.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesTopic =
          !selectedTopic.value || repo.topics.includes(selectedTopic.value);
        return matchesSearch && matchesTopic;
      })
      .map((repo) => repo.name);
    selectedRepos.value = filteredRepos ?? [];
  });

  const handleDeselectAll = $(() => {
    selectedRepos.value = [];
  });

  const handleTopicClick = $((e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "SPAN") {
      selectedTopic.value = target.textContent || "";
    }
  });

  const handleClearFilters = $(() => {
    selectedTopic.value = "";
    searchQuery.value = "";
  });

  const handleCheckboxChange = $((e: Event, repoName: string) => {
    const checkbox = e.target as HTMLInputElement;
    selectedRepos.value = checkbox.checked
      ? [...selectedRepos.value, repoName]
      : selectedRepos.value.filter((r) => r !== repoName);
  });

  const handleCardClick = $((repo: GetRepositoryReturns) => {
    if (!isShow.value) {
      navigate(Routes.repoDetails(repo?.owner.login, repo?.name));
    }
  });

  const toggleManageTags = $(() => {
    isShow.value = !isShow.value;
    if (!isShow.value) {
      selectedRepos.value = [];
    }
  });

  return (
    <div class="min-h-screen">
      <PageTitle />
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="flex gap-4">
            <Button onClick$={toggleManageTags} variant="primary">
              {isShow.value ? "Done" : "Manage Tags"}
            </Button>
            {isShow.value && (
              <>
                <Button onClick$={handleSelectAll} variant="secondary">
                  Select All
                </Button>
                <Button onClick$={handleDeselectAll} variant="secondary">
                  Deselect All
                </Button>
                {selectedRepos.value.length > 0 && (
                  <BulkTopicsModal
                    selectedRepos={selectedRepos}
                    topicsMap={repoTopicsMap || {}}
                  />
                )}
              </>
            )}
          </div>

          <div class="space-y-2">
            <span class="text-sm font-medium">Tags:</span>
            <div onClick$={handleTopicClick}>
              <div class="flex flex-wrap gap-2">
                {allTopics
                  .filter(
                    (topic: string | null): topic is string => topic !== null,
                  )
                  .map((topic: string) => (
                    <Chip.Root
                      key={topic}
                      class="bg-kunai-blue-100 dark:bg-kunai-blue-300 text-xs"
                      variant="outline"
                    >
                      <span class="truncate">{topic}</span>
                    </Chip.Root>
                  ))}
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <input
              type="text"
              value={searchQuery.value}
              onInput$={(ev) =>
                (searchQuery.value = (ev.target as HTMLInputElement).value)
              }
              placeholder="Search repositories..."
              class="px-4 pr-48"
              id="search-repositories"
              name="search-repositories"
            />
            <Button
              onClick$={handleClearFilters}
              variant="secondary"
              title="Clear filters"
              class="bg-transparent rounded-full hover:bg-kunai-blue-100 dark:hover:bg-kunai-blue-700 transition-colors"
            >
              <LuRotateCcw class="h-8 w-8 text-kunai-blue-700 dark:text-white" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queriedRepositories &&
            queriedRepositories
              .filter((repo) => {
                const matchesSearch = repo.name
                  .toLowerCase()
                  .includes(searchQuery.value.toLowerCase());
                const matchesTopic =
                  !selectedTopic.value ||
                  repo.topics.includes(selectedTopic.value);
                return matchesSearch && matchesTopic;
              })
              .map((repo) => (
                <div key={repo.id} class="relative">
                  <div onClick$={() => handleCardClick(repo)}>
                    <RepositoryCard repo={repo} />
                  </div>
                  {isShow.value && (
                    <input
                      type="checkbox"
                      class="absolute top-2 right-2"
                      checked={selectedRepos.value.includes(repo.name || "")}
                      onChange$={(e) =>
                        handleCheckboxChange(e, repo.name || "")
                      }
                      id={`repo-checkbox-${repo.id}`}
                      name={`repo-checkbox-${repo.id}`}
                    />
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "All Repositories",
};
