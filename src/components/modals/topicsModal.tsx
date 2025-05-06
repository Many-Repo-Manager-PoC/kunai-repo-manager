import { component$, useSignal, $ } from "@builder.io/qwik";
import { Modal } from "@kunai-consulting/kunai-design-system";

interface TopicsModalProps {
  selectedRepos: { value: string[] };
  repoTopicsMap?: Record<string, string[]>;
}

export const TopicsModal = component$<TopicsModalProps>(
  ({ selectedRepos, repoTopicsMap }) => {
    const selectedTopics = useSignal<string[]>([]);
    const newTopics = useSignal("");

    const handleTopicToggle = $((topic: string) => {
      if (selectedTopics.value.includes(topic)) {
        selectedTopics.value = selectedTopics.value.filter((t) => t !== topic);
      } else {
        selectedTopics.value = [...selectedTopics.value, topic];
      }
    });

    const handleNewTopicsChange = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      newTopics.value = target.value;
    });

    return (
      <Modal.Root>
        <Modal.Trigger class="bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
          Edit Tags
        </Modal.Trigger>
        <Modal.Panel class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-[32rem]">
          <Modal.Title class="text-xl font-bold text-gray-500 dark:text-gray-200 mb-3 text-center">
            Add/Remove Tags
          </Modal.Title>
          <div class="text-gray-600 dark:text-gray-300 mb-3">
            <span>Repositories to be edited:</span>
            <ul class="flex flex-col gap-1 mt-2">
              {selectedRepos.value.map((repo) => (
                <li
                  key={repo}
                  class="flex items-center text-kunai-gray-700 dark:text-kunai-gray-200 text-sm bg-kunai-gray-50 dark:bg-kunai-gray-800 px-3 py-1.5 rounded-md"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-kunai-blue-500 mr-2"></span>
                  {repo}
                </li>
              ))}
            </ul>
          </div>
          <div class="text-gray-600 dark:text-gray-300 mb-3">
            Select tag(s) to remove from selected repositories:
          </div>
          <div class="grid grid-cols-2 gap-2 mb-4 max-h-[12rem] overflow-y-auto">
            {selectedRepos.value
              .reduce((allTopics, repoName) => {
                const repoTopics = repoTopicsMap?.[repoName] || [];
                return [...new Set([...allTopics, ...repoTopics])];
              }, [] as string[])
              .map((topic) => (
                <div
                  key={topic}
                  class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
                >
                  <span class="text-gray-700 dark:text-gray-200 text-sm">
                    {topic}
                  </span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTopics.value.includes(topic)}
                      onChange$={() => handleTopicToggle(topic)}
                      class="sr-only peer"
                    />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-kunai-blue-600 dark:peer-checked:bg-kunai-blue-600"></div>
                  </label>
                </div>
              ))}
          </div>

          <div class="text-gray-600 dark:text-gray-300 mb-3">
            Enter tags to add to selected repositories:
          </div>
          <input
            type="text"
            value={newTopics.value}
            onInput$={handleNewTopicsChange}
            placeholder="Enter tags separated by commas"
            class="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />

          <footer class="flex justify-end gap-3 mt-4">
            <Modal.Close
              type="button"
              class="px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-sm"
            >
              Cancel
            </Modal.Close>
            <Modal.Close
              type="button"
              class="px-3 py-1.5 bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white rounded-md transition-colors duration-200 text-sm"
            >
              Save Changes
            </Modal.Close>
          </footer>
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
