import { component$, $, useSignal } from "@qwik.dev/core";
import { Modal } from "@kunai-consulting/kunai-design-system";
import { usePutBulkTopics } from "~/routes/allRepositories";

interface BulkTopicsModalProps {
  selectedRepos: { value: string[] };
  topicsMap: Record<string, string[]>;
}

export const BulkTopicsModal = component$<BulkTopicsModalProps>(
  ({ selectedRepos, topicsMap }) => {
    const action = usePutBulkTopics();
    const newTags = useSignal("");
    const tagsToRemove = useSignal<string[]>([]);

    const handleTagToggle = $((topic: string, checked: boolean) => {
      if (checked) {
        tagsToRemove.value = [...tagsToRemove.value, topic];
      } else {
        tagsToRemove.value = tagsToRemove.value.filter((t) => t !== topic);
      }
    });

    const handleSaveChanges = $(() => {
      const tagsToAdd = newTags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updatedRepoTopics: Record<string, string[]> = {};
      for (const repoName of selectedRepos.value) {
        const currentTags = topicsMap[repoName] || [];
        const updatedTags = [
          ...new Set([
            ...currentTags.filter((t) => !tagsToRemove.value.includes(t)),
            ...tagsToAdd,
          ]),
        ];
        updatedRepoTopics[repoName] = updatedTags;
      }

      action.submit({
        repos: selectedRepos.value,
        reposTopics: updatedRepoTopics,
      });
    });

    return (
      <Modal.Root>
        <Modal.Trigger class="bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
          Edit Tags
        </Modal.Trigger>
        <Modal.Panel class="bg-white dark:bg-kunai-blue-600 rounded-lg p-6 max-w-2xl mx-auto mt-8">
          <div class="flex flex-col gap-2 p-2">
            <div class="flex-grow dark:text-white">
              <Modal.Title class=" font-semibold mb-4">
                <h4 class="text-sm font-semibold mb-4">Add/Remove Tags</h4>
              </Modal.Title>
              <Modal.Description class="mb-4">
                Repositories to be edited:
                <ul class="list-disc list-inside mt-2">
                  {selectedRepos.value.map((repo) => (
                    <li key={repo}>{repo}</li>
                  ))}
                </ul>
              </Modal.Description>
            </div>

            <div class="flex flex-col gap-2 mt-2 text-sm p-2 rounded-md overflow-y-auto">
              <div class="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-600">
                <div class="font-semibold dark:text-white">Current Tags</div>
                <div class="font-semibold dark:text-white">Remove?</div>
              </div>
              {selectedRepos.value
                .reduce((allTopics, repoName) => {
                  const repoTopics = topicsMap[repoName] || [];
                  return [...new Set([...allTopics, ...repoTopics])];
                }, [] as string[])
                .map((topic) => (
                  <div
                    key={topic}
                    class="flex justify-between items-center py-2"
                  >
                    <div class="dark:text-white truncate">{topic}</div>
                    <input
                      type="checkbox"
                      checked={tagsToRemove.value.includes(topic)}
                      onChange$={(ev) =>
                        handleTagToggle(
                          topic,
                          (ev.target as HTMLInputElement).checked,
                        )
                      }
                      id={`remove-tag-${topic}`}
                      name={`remove-tag-${topic}`}
                      class="h-4 w-4"
                    />
                  </div>
                ))}
            </div>

            <div class="flex flex-col gap-2 mt-4">
              <Modal.Description class="text-sm font-medium dark:text-white">
                Enter tags to add:
              </Modal.Description>
              <input
                type="text"
                value={newTags.value}
                onInput$={(ev) =>
                  (newTags.value = (ev.target as HTMLInputElement).value)
                }
                placeholder="Enter tags separated by commas"
                class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-kunai-blue-700 dark:text-white"
                id="new-tags-input"
                name="new-tags-input"
              />
            </div>

            <footer class="flex justify-end gap-4 mt-4">
              <Modal.Close
                type="button"
                class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-kunai-blue-700 dark:hover:bg-kunai-blue-800 dark:text-white transition-colors"
              >
                Cancel
              </Modal.Close>
              <Modal.Close
                onClick$={handleSaveChanges}
                type="button"
                class="px-4 py-2 rounded-md bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white transition-colors"
              >
                Save Changes
              </Modal.Close>
            </footer>
          </div>
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
