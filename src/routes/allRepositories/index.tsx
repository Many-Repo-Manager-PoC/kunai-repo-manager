import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { RepositoryCard } from "../../components/cards/repositoryCard";
import type { Repo } from "~/db/types";
import { Button, Chip } from "@kunai-consulting/kunai-design-system";
import { useGetRepos } from "../../db/getRepositories";
export { useGetRepos } from "../../db/getRepositories";
import { TopicsModal } from "../../components/modals/topicsModal";
import { PageTitle } from "~/components/page/pageTitle";
import { LuRotateCcw } from "@qwikest/icons/lucide";

export default component$(() => {
  const serverData = useGetRepos();
  const searchQuery = useSignal("");
  const selectedTopic = useSignal("");
  const allTopics = [
    ...new Set(
      serverData.value?.flatMap((repo: Repo) => repo.topics || []) ?? [],
    ),
  ];
  const repoTopicsMap = serverData.value?.reduce(
    (acc: { [key: string]: string[] }, repo: Repo) => {
      acc[repo.name || ""] = repo.topics || [];
      return acc;
    },
    {},
  );
  const selectedRepos = useSignal<string[]>([]);
  const isShow = useSignal<boolean>(false);

  const handleSelectAll = $(() => {
    const filteredRepos = serverData?.value
      ?.filter((repo) => {
        const matchesSearch =
          !searchQuery.value ||
          repo.name?.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesTopic =
          !selectedTopic.value || repo.topics?.includes(selectedTopic.value);
        return matchesSearch && matchesTopic;
      })
      .map((repo) => repo.name);
    selectedRepos.value =
      filteredRepos?.filter((name): name is string => name !== null) ?? [];
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
    if (checkbox.checked) {
      selectedRepos.value = [...selectedRepos.value, repoName];
    } else {
      selectedRepos.value = selectedRepos.value.filter((r) => r !== repoName);
    }
  });

  return (
    <div class="container min-h-screen">
      <PageTitle />
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="flex gap-4">
            <Button onClick$={() => (isShow.value = true)} variant="primary">
              Manage Tags
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
                  <TopicsModal
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
                  .flat()
                  .filter((topic): topic is string => topic !== null)
                  .map((topic) => (
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
              class="pr-48"
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
          {serverData?.value &&
            serverData.value
              .filter(
                (repo: Repo) =>
                  repo.name
                    ?.toLowerCase()
                    .includes(searchQuery.value.toLowerCase()) &&
                  (!selectedTopic.value ||
                    (repo.topics && repo.topics.includes(selectedTopic.value))),
              )
              .map((repo: Repo) => (
                <div key={repo.id} class="relative">
                  <RepositoryCard repo={repo} />
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
