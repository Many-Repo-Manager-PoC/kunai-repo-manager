import { component$, $, useSignal } from "@builder.io/qwik";
import { Modal } from "@kunai-consulting/kunai-design-system";
import { postWorkflowDispatchEvent } from "../../db/postWorkflowDispatchEvent";
export { postWorkflowDispatchEvent };

interface DependencyUpdaterModalProps {
  packageToUpdate: string;
  packageVersion: string;
  repoToUpdate: string;
  oldVersion: string;
}

export const DependencyUpdaterModal = component$<DependencyUpdaterModalProps>(
  ({ packageToUpdate, packageVersion, repoToUpdate, oldVersion }) => {
    const action = postWorkflowDispatchEvent();
    const prTitle = useSignal(
      `Update Package: ${packageToUpdate} from version ${oldVersion} to ${packageVersion}`,
    );
    const prBody = useSignal(
      "This is an automatically generated Pull request from The Kunai Github Repositories Manger. Please review and test before merging into main.",
    );
    const showTitleInput = useSignal(false);
    const showBodyInput = useSignal(false);

    const handleSaveChanges = $(() => {
      action.submit({
        repo_name: repoToUpdate,
        package_name: packageToUpdate,
        package_version: packageVersion,
        pr_title: prTitle.value,
        pr_body: prBody.value,
      });
    });

    const handleTitleDone = $(() => {
      showTitleInput.value = false;
    });

    const handleBodyDone = $(() => {
      showBodyInput.value = false;
    });

    return (
      <Modal.Root>
        <Modal.Trigger class="bg-kunai-blue-300 hover:bg-kunai-blue-400 dark:bg-kunai-blue-400 dark:hover:bg-kunai-blue-500 text-gray-700 dark:text-white py-2 px-4 rounded-md transition-colors duration-200">
          Update to current version
        </Modal.Trigger>
        <Modal.Panel class="bg-white dark:bg-kunai-blue-800 rounded-lg p-6 max-w-2xl mx-auto mt-8">
          <div class="flex flex-col gap-2 p-2">
            <div class="flex-grow text-kunai-blue-700 dark:text-white">
              <Modal.Title class="space-y-2">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-kunai-blue-900 dark:text-white">
                    PR Generation for
                  </span>
                  <span class="text-lg font-bold text-kunai-blue-800 dark:text-white">
                    {repoToUpdate}
                  </span>
                </div>
                <div class="flex flex-col pt-2">
                  <span class="text-sm font-bold text-kunai-blue-700 dark:text-white">
                    Updating
                  </span>
                  <span class="text-base font-medium text-kunai-blue-700 dark:text-white">
                    {packageToUpdate} → {packageVersion}
                  </span>
                </div>
              </Modal.Title>
            </div>
            <div class="border-t border-b border-gray-300 dark:border-gray-400 my-4">
              <Modal.Description class="text-sm text-kunai-blue-700 dark:text-white text-left py-2">
                Please confirm the following information is correct before
                generating the PR.
              </Modal.Description>
            </div>
            <div class="flex flex-col gap-2 text-kunai-blue-700 dark:text-white">
              <span class="font-bold">Files to be updated</span>

              <ul>
                <li>
                  <span class="text-kunai-blue-700 dark:text-kunai-blue-200">
                    package.json
                  </span>
                  <br />
                  <span class="text-kunai-blue-700 dark:text-kunai-blue-200">
                    package-lock.json
                  </span>
                </li>
              </ul>
            </div>
            <div class="flex items-center gap-2 text-kunai-blue-700 dark:text-white font-bold pt-4">
              <span>PR Title</span>
              <button
                class="text-xs text-kunai-blue-700 dark:text-white px-2 py-1 rounded bg-kunai-blue-300 hover:bg-kunai-blue-200 dark:bg-kunai-blue-400 dark:hover:bg-kunai-blue-300 transition-colors"
                onClick$={() => {
                  if (showTitleInput.value) {
                    handleTitleDone();
                  } else {
                    showTitleInput.value = true;
                  }
                }}
              >
                {showTitleInput.value ? "Done" : "Click to update"}
              </button>
            </div>
            <div class="flex flex-col gap-2 text-kunai-blue-700 dark:text-kunai-blue-200">
              {showTitleInput.value ? (
                <input
                  class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-kunai-blue-300 text-kunai-blue-700 dark:text-kunai-blue-800"
                  type="text"
                  placeholder=""
                  value={prTitle.value}
                  onInput$={(ev) =>
                    (prTitle.value = (ev.target as HTMLInputElement).value)
                  }
                />
              ) : (
                prTitle.value
              )}
            </div>

            <div class="flex items-center gap-2 font-bold text-kunai-blue-700 dark:text-white pt-4">
              <span>PR Body</span>
              <button
                class="text-xs px-2 py-1 rounded bg-kunai-blue-300 hover:bg-kunai-blue-200 dark:bg-kunai-blue-400 dark:hover:bg-kunai-blue-300 text-kunai-blue-700 dark:text-white transition-colors"
                onClick$={() => {
                  if (showBodyInput.value) {
                    handleBodyDone();
                  } else {
                    showBodyInput.value = true;
                  }
                }}
              >
                {showBodyInput.value ? "Done" : "Click to Update"}
              </button>
            </div>
            <div class="flex flex-col gap-2 text-kunai-blue-700 dark:text-kunai-blue-200">
              {showBodyInput.value ? (
                <input
                  class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-kunai-blue-300 text-kunai-blue-700 dark:text-kunai-blue-800"
                  type="text"
                  placeholder=""
                  value={prBody.value}
                  onInput$={(ev) =>
                    (prBody.value = (ev.target as HTMLInputElement).value)
                  }
                />
              ) : (
                prBody.value
              )}
            </div>

            <footer class="flex justify-end gap-4 mt-4">
              <Modal.Close
                type="button"
                class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-kunai-blue-700 dark:hover:bg-kunai-blue-600 text-kunai-blue-700 dark:text-white transition-colors"
              >
                Cancel
              </Modal.Close>
              <Modal.Close
                onClick$={handleSaveChanges}
                type="button"
                class="px-4 py-2 rounded-md bg-kunai-blue-500 hover:bg-kunai-blue-600 text-white transition-colors"
              >
                Generate PR
              </Modal.Close>
            </footer>
          </div>
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
