import { component$, $, useSignal } from "@qwik.dev/core";
import { Modal } from "@kunai-consulting/kunai-design-system";
import { type postWorkflowDispatchEvent } from "../../db/postWorkflowDispatchEvent";

interface DependencyUpdaterModalProps {
  packageToUpdate: string;
  packageVersion: string;
  repoToUpdate: string;
  oldVersion: string;
  dispatchEvent: ReturnType<typeof postWorkflowDispatchEvent>;
}

export const DependencyUpdaterModal = component$<DependencyUpdaterModalProps>(
  ({
    packageToUpdate,
    packageVersion,
    repoToUpdate,
    oldVersion,
    dispatchEvent,
  }) => {
    const prTitle = useSignal(
      `Update ${packageToUpdate} from ${oldVersion} to ${packageVersion}`,
    );
    const prBody = useSignal(
      "Automated PR from Kunai Github Repositories Manager. Please review before merging.",
    );
    const showTitleInput = useSignal(false);
    const showBodyInput = useSignal(false);

    const handleSaveChanges = $(async () => {
      await dispatchEvent.submit({
        repo_name: repoToUpdate,
        package_name: packageToUpdate,
        package_version: packageVersion,
        pr_title: prTitle.value,
        pr_body: prBody.value,
      });
    });

    const toggleInput = $(
      (showInput: boolean, setShowInput: (value: boolean) => void) => {
        setShowInput(!showInput);
      },
    );

    return (
      <Modal.Root>
        <Modal.Trigger class="bg-kunai-blue-300 hover:bg-kunai-blue-400 dark:bg-kunai-blue-400 dark:hover:bg-kunai-blue-500 text-gray-700 dark:text-white py-2 px-4 rounded-md transition-colors duration-200">
          Update to current version
        </Modal.Trigger>
        <Modal.Panel class="bg-white dark:bg-kunai-blue-800 rounded-lg p-6 max-w-2xl mx-auto mt-8">
          <div class="flex flex-col gap-2 p-2">
            <Modal.Title class="space-y-2">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-kunai-blue-900 dark:text-white">
                  PR Generation for {repoToUpdate}
                </span>
                <span class="text-base font-medium text-kunai-blue-700 dark:text-white pt-2">
                  Updating {packageToUpdate} → {packageVersion}
                </span>
              </div>
            </Modal.Title>

            <div class="border-t border-b border-gray-300 dark:border-gray-400 my-4">
              <Modal.Description class="text-sm text-kunai-blue-700 dark:text-white text-left py-2">
                Please confirm the following information is correct before
                generating the PR.
              </Modal.Description>
            </div>

            <div class="text-kunai-blue-700 dark:text-white">
              <span class="font-bold">Files to be updated:</span>
              <ul class="mt-2">
                <li class="text-kunai-blue-700 dark:text-kunai-blue-200">
                  package.json
                </li>
                <li class="text-kunai-blue-700 dark:text-kunai-blue-200">
                  package-lock.json
                </li>
              </ul>
            </div>

            <div class="space-y-4 pt-4">
              <div>
                <div class="flex items-center gap-2 font-bold text-kunai-blue-700 dark:text-white">
                  <span>PR Title</span>
                  <button
                    class="text-xs px-2 py-1 rounded bg-kunai-blue-300 hover:bg-kunai-blue-200 dark:bg-kunai-blue-400 dark:hover:bg-kunai-blue-300 text-kunai-blue-700 dark:text-white transition-colors"
                    onClick$={() =>
                      toggleInput(
                        showTitleInput.value,
                        (v) => (showTitleInput.value = v),
                      )
                    }
                  >
                    {showTitleInput.value ? "Done" : "Click to update"}
                  </button>
                </div>
                {showTitleInput.value ? (
                  <input
                    class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-kunai-blue-300 text-kunai-blue-700 dark:text-kunai-blue-800"
                    type="text"
                    value={prTitle.value}
                    onInput$={(ev) =>
                      (prTitle.value = (ev.target as HTMLInputElement).value)
                    }
                  />
                ) : (
                  <div class="text-kunai-blue-700 dark:text-kunai-blue-200">
                    {prTitle.value}
                  </div>
                )}
              </div>

              <div>
                <div class="flex items-center gap-2 font-bold text-kunai-blue-700 dark:text-white">
                  <span>PR Body</span>
                  <button
                    class="text-xs px-2 py-1 rounded bg-kunai-blue-300 hover:bg-kunai-blue-200 dark:bg-kunai-blue-400 dark:hover:bg-kunai-blue-300 text-kunai-blue-700 dark:text-white transition-colors"
                    onClick$={() =>
                      toggleInput(
                        showBodyInput.value,
                        (v) => (showBodyInput.value = v),
                      )
                    }
                  >
                    {showBodyInput.value ? "Done" : "Click to Update"}
                  </button>
                </div>
                {showBodyInput.value ? (
                  <input
                    class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-kunai-blue-300 text-kunai-blue-700 dark:text-kunai-blue-800"
                    type="text"
                    value={prBody.value}
                    onInput$={(ev) =>
                      (prBody.value = (ev.target as HTMLInputElement).value)
                    }
                  />
                ) : (
                  <div class="text-kunai-blue-700 dark:text-kunai-blue-200">
                    {prBody.value}
                  </div>
                )}
              </div>
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
