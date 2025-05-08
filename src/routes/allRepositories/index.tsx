import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Chip, Field, Button } from "@kunai-consulting/kunai-design-system";
import { LuRotateCcw } from "@qwikest/icons/lucide";
import type { Repo } from "~/db/types";
import { RepositoryCard } from "~/components/cards/repositoryCard";
import { TopicsModal } from "~/components/modals/topicsModal";

import { dummyRepos, dummyRepoTopicsMap } from "~/db/metadata.json";

type RepoTopicsMap = {
  [key: string]: string[];
};

export default component$(() => {
  const searchQuery = useSignal("");
  const selectedTopic = useSignal("");
  const allTopics = [
    ...new Set(Object.values(dummyRepoTopicsMap as RepoTopicsMap).flat()),
  ];
  const selectedRepos = useSignal<string[]>([]);
  const isShow = useSignal<boolean>(false);
  // const isTopicsModalOpen = useSignal<boolean>(false);

  const handleSelectAll = $(() => {
    const filteredRepos = dummyRepos
      .filter((repo) => {
        const matchesSearch =
          !searchQuery.value ||
          repo.name?.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesTopic =
          !selectedTopic.value ||
          (dummyRepoTopicsMap as RepoTopicsMap)[repo.name || ""]?.includes(
            selectedTopic.value,
          );
        return matchesSearch && matchesTopic;
      })
      .map((repo) => repo.name);
    selectedRepos.value =
      filteredRepos?.filter((name): name is string => name !== null) ?? [];
  });

  const handleDeselectAll = $(() => {
    selectedRepos.value = [];
  });

  const handleTopicClick = $((topic: string) => {
    selectedTopic.value = selectedTopic.value === topic ? "" : topic;
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
    <div class="container container-center flex">
      <div class="flex-1 p-4">
        <div class="flex flex-col items-center mb-8">
          <h1 class="text-center mb-4">
            <span class="highlight">All</span> Repositories
          </h1>
          <div class="flex flex-col gap-2 self-end">
            <Button
              onClick$={() => (isShow.value = !isShow.value)}
              class="flex-1 bg-kunai-gray-100 text-kunai-gray-700 hover:bg-kunai-gray-200 dark:bg-kunai-gray-800 dark:text-kunai-gray-300 dark:hover:bg-kunai-gray-700 bg-kunai-blue-300 dark:bg-kunai-blue-600 mr-2 pl-2"
            >
              Manage Tags
            </Button>
            {isShow.value && (
              <div class="flex flex-col gap-2">
                <h4 class="text-center">Actions:</h4>
                <div class="flex gap-2">
                  <Button
                    onClick$={handleSelectAll}
                    class="bg-kunai-gray-100 text-kunai-gray-700 hover:bg-kunai-gray-200 dark:bg-kunai-gray-800 dark:text-kunai-gray-300 dark:hover:bg-kunai-gray-700 bg-kunai-blue-300 dark:bg-kunai-blue-600"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick$={handleDeselectAll}
                    class="bg-kunai-gray-100 text-kunai-gray-700 hover:bg-kunai-gray-200 dark:bg-kunai-gray-800 dark:text-kunai-gray-300 dark:hover:bg-kunai-gray-700 bg-kunai-blue-300 dark:bg-kunai-blue-600"
                  >
                    Deselect All
                  </Button>
                </div>
                {selectedRepos.value.length > 0 && (
                  <div class="flex justify-center">
                    <TopicsModal
                      // isOpen={isTopicsModalOpen.value}
                      // onClose$={() => (isTopicsModalOpen.value = false)}
                      selectedRepos={selectedRepos}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-1 flex-wrap">
            <h4>Tags:</h4>
            <div class="flex-1 flex items-center gap-1 flex-wrap">
              {allTopics.map((topic) => (
                <Chip.Root
                  key={topic}
                  onClick$={() => handleTopicClick(topic)}
                  class={
                    selectedTopic.value === topic
                      ? "bg-kunai-blue-500 text-white"
                      : ""
                  }
                >
                  {topic}
                </Chip.Root>
              ))}
            </div>
          </div>

          <div class="flex items-center gap-4 max-w-[75%]">
            <Field.Root class="bg-white dark:bg-kunai-gray-800 rounded-lg flex-1">
              <Field.Input
                value={searchQuery.value}
                onInput$={(ev) =>
                  (searchQuery.value = (ev.target as HTMLInputElement).value)
                }
                placeholder="Search repositories..."
                class="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-kunai-blue-500 rounded-lg"
              />
            </Field.Root>
            <Button onClick$={handleClearFilters}>
              <LuRotateCcw class="h-5 w-5" />
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyRepos
              .filter(
                (repo: Repo) =>
                  repo.name
                    ?.toLowerCase()
                    .includes(searchQuery.value.toLowerCase()) &&
                  (!selectedTopic.value ||
                    (dummyRepoTopicsMap as RepoTopicsMap)[
                      repo.name || ""
                    ]?.includes(selectedTopic.value)),
              )
              .map((repo: Repo) => (
                <div key={repo.id} class="relative">
                  <RepositoryCard repo={repo} />
                  {isShow.value && (
                    <input
                      type="checkbox"
                      class="absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 border-kunai-blue-500 bg-white checked:bg-kunai-blue-500 checked:border-kunai-blue-500 cursor-pointer appearance-none transition-colors duration-200"
                      checked={selectedRepos.value.includes(repo.name || "")}
                      onChange$={(e) =>
                        handleCheckboxChange(e, repo.name || "")
                      }
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "All Repositories",
};
