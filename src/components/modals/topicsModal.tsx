import { component$, $, useSignal } from "@builder.io/qwik";
import { Modal } from "@kunai-consulting/kunai-design-system";
import { usePutTopics } from "~/routes/layout";

interface TopicsModalProps {
  selectedRepo: string;
  topicsMap: string[];
}

export const TopicsModal = component$<TopicsModalProps>(
  ({ selectedRepo, topicsMap }) => {
    const action = usePutTopics();
    const newTags = useSignal("");
    const checkedTopics = useSignal<string[]>([]);

    const handleSaveChanges = $(async () => {
      const tagsToAdd = newTags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const currentTags = topicsMap || [];
      const updatedTags = [
        ...new Set([
          ...currentTags.filter((t) => !checkedTopics.value.includes(t)),
          ...tagsToAdd,
        ]),
      ];

      await action.submit({
        repo: selectedRepo,
        topics: updatedTags,
      });

      // Refresh the page after successful submission
      window.location.reload();
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
            </div>

            <div class="flex flex-col gap-2 mt-2 text-sm p-2 rounded-md overflow-y-auto">
              <div class="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-600">
                <div class="font-semibold dark:text-white">Current Tags</div>
                <div class="font-semibold dark:text-white">Remove?</div>
              </div>
              {topicsMap.map((topic) => (
                <div key={topic} class="flex justify-between items-center py-2">
                  <div class="dark:text-white truncate">{topic}</div>
                  <input
                    type="checkbox"
                    onChange$={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      const isChecked = (ev.target as HTMLInputElement).checked;
                      if (isChecked) {
                        checkedTopics.value = [...checkedTopics.value, topic];
                      } else {
                        checkedTopics.value = checkedTopics.value.filter(
                          (t) => t !== topic,
                        );
                      }
                    }}
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
