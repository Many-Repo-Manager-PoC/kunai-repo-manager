import { component$, $, useSignal } from "@builder.io/qwik";
import { Modal } from "@kunai-consulting/kunai-design-system";

import { usePutBulkTopics } from "../../routes/allRepositories";

interface TopicsModalProps {
  selectedRepos: { value: string[] };
  topicsMap: Record<string, string[]>;
}

export const TopicsModal = component$<TopicsModalProps>(
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
        <Modal.Panel class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
          <Modal.Title class="text-xl font-semibold mb-4">
            Add/Remove Tags
          </Modal.Title>
          <Modal.Description class="mb-4">
            Repositories to be edited:
            <ul class="list-disc list-inside mt-2">
              {selectedRepos.value.map((repo) => (
                <li key={repo}>{repo}</li>
              ))}
            </ul>
          </Modal.Description>
          <Modal.Description class="mb-4">
            Select tag(s) to remove from selected repositories:
          </Modal.Description>
          <div class="grid grid-cols-2 gap-2 mb-4">
            {selectedRepos.value
              .reduce((allTopics, repoName) => {
                const repoTopics = topicsMap?.[repoName] || [];
                return [...new Set([...allTopics, ...repoTopics])];
              }, [] as string[])
              .map((topic) => (
                <div key={topic} class="flex items-center gap-2">
                  <span>{topic}</span>
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
                  />
                </div>
              ))}
          </div>

          <Modal.Description class="mb-4">
            Enter tags to add to selected repositories:
          </Modal.Description>
          <input
            type="text"
            value={newTags.value}
            onInput$={(ev) =>
              (newTags.value = (ev.target as HTMLInputElement).value)
            }
            placeholder="Enter tags separated by commas"
            class="w-full mb-4"
            id="new-tags-input"
            name="new-tags-input"
          />

          <footer>
            <Modal.Close type="button" class="modalClose">
              Cancel
            </Modal.Close>
            <Modal.Close
              onClick$={handleSaveChanges}
              type="button"
              class="modalClose"
            >
              Save Changes
            </Modal.Close>
          </footer>
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
