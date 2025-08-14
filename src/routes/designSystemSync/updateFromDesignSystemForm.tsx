import { $, component$, useComputed$, useSignal } from "@qwik.dev/core";
import {
  useForm,
  zodForm$,
  reset,
  getValue,
  setValue,
} from "@modular-forms/qwik";
import { SelectInput } from "~/components/formInputs/selectInput";
import { Button } from "@kunai-consulting/kunai-design-system";
import {
  DesignSystemSyncFormType,
  designSystemSyncSchema,
  getDesignSystemFiles,
  useDesignSystemSync,
} from "~/routes/designSystemSync";
import { useGetRepositories } from "~/hooks/repository.hooks";
import { FileTree } from "../../components/tree/fileTree";
import { buildTree } from "~/util/tree";
import { GitHubTreeItem } from "~/db/types";

export interface DesignSystemSyncFormProps {}

export const DesignSystemSyncForm = component$<DesignSystemSyncFormProps>(
  () => {
    const designSystemSync = useDesignSystemSync();
    const repositories = useGetRepositories();
    const designSystemRepositories = useComputed$(() => {
      return repositories.value; // TODO: filter by design system
      //   return repositories.value.filter((repo) =>
      //     repo.topics.some((x) => x.toLowerCase().includes("design system")),
      //   );
    });

    const sourceFiles = useSignal<GitHubTreeItem[]>([]);

    const treeData = useComputed$(() => {
      console.log(sourceFiles.value);
      return buildTree(
        sourceFiles.value.map((item) => {
          if (item.path) {
            return item.path;
          }
          return "";
        }),
      );
    });

    const formStep = useSignal<"1" | "2">("1");

    const [form, { Form, Field }] = useForm<
      DesignSystemSyncFormType,
      { url: string }
    >({
      loader: {
        value: {
          sourceRepoFullName: "",
          targetRepoFullName: "",
          filePaths: [],
        },
      },
      validate: zodForm$(designSystemSyncSchema),
      action: designSystemSync,
    });

    const handleReset = $(() => {
      reset(form);
    });

    const handleChange = $((_: Event, element: HTMLInputElement) => {
      let selectedItems = getValue(form, "filePaths") ?? [];
      if (element.checked) {
        selectedItems = [...selectedItems, element.value];
      } else {
        selectedItems = selectedItems.filter((item) => item !== element.value);
      }
      setValue(form, "filePaths", selectedItems);
    });

    const handleNext = $(async () => {
      const files = await getDesignSystemFiles(
        getValue(form, "sourceRepoFullName") as string,
      );
      console.log(files);
      sourceFiles.value = files;
      formStep.value = "2";
    });

    const handleBack = $(() => {
      formStep.value = "1";
    });

    return (
      <div class="w-full">
        <Form>
          <div class="flex flex-col gap-8">
            {/* Step 2: File Selection */}
            <div class={formStep.value === "1" ? "hidden" : "space-y-6"}>
              <div class="space-y-4">
                <Field name="filePaths" type="string[]">
                  {(field) => (
                    <FileTree
                      error={field.error}
                      value={field.value ?? []}
                      defaultOpenKeys={[]}
                      treeData={treeData.value}
                      onChange$={handleChange}
                    />
                  )}
                </Field>
              </div>

              <div class="flex gap-4 justify-end pt-4">
                <Button
                  class="cursor-pointer"
                  kind="secondary"
                  onClick$={handleBack}
                  type="button"
                  disabled={form.submitting}
                >
                  Back
                </Button>
                <Button
                  class="cursor-pointer"
                  type="submit"
                  disabled={form.submitting}
                >
                  Submit
                </Button>
              </div>
            </div>

            {/* Step 1: Repository Selection */}
            <div class={formStep.value === "2" ? "hidden" : "space-y-6"}>
              <div class="grid grid-cols-2 gap-8">
                <Field name="sourceRepoFullName">
                  {(field, props) => (
                    <SelectInput
                      {...props}
                      label="Source Repository"
                      value={field.value}
                      error={field.error}
                      options={[
                        {
                          label: "Select a source repository",
                          value: "",
                        },
                        ...designSystemRepositories.value.map((repo) => ({
                          label: repo.full_name,
                          value: repo.full_name,
                        })),
                      ]}
                    />
                  )}
                </Field>

                <Field name="targetRepoFullName">
                  {(field, props) => (
                    <SelectInput
                      {...props}
                      label="Target Repository"
                      value={field.value}
                      error={field.error}
                      options={[
                        {
                          label: "Select a target repository",
                          value: "",
                        },
                        ...designSystemRepositories.value.map((repo) => ({
                          label: repo.full_name,
                          value: repo.full_name,
                        })),
                      ]}
                    />
                  )}
                </Field>
              </div>

              {/* Action buttons */}
              <div class="flex gap-4 justify-end pt-4">
                <Button
                  class="cursor-pointer"
                  kind="secondary"
                  onClick$={handleReset}
                  type="button"
                  disabled={form.submitting}
                >
                  Clear
                </Button>
                <Button
                  class="cursor-pointer"
                  type="button"
                  onClick$={handleNext}
                  disabled={
                    form.submitting ||
                    !getValue(form, "sourceRepoFullName") ||
                    !getValue(form, "targetRepoFullName")
                  }
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {(form.submitting || form.response.status) && (
              <div class="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {form.submitting && (
                  <span class="text-sm text-gray-500">Submitting...</span>
                )}
                {form.response.status === "success" && (
                  <div class="flex flex-col gap-2">
                    <div class="text-sm text-green-600 dark:text-green-400">
                      {form.response.message}
                    </div>
                    {form.response.data?.url && (
                      <a
                        href={form.response.data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View on GitHub
                      </a>
                    )}
                  </div>
                )}
                {form.response.status === "error" && (
                  <span class="text-sm text-red-600 dark:text-red-400">
                    {form.response.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </Form>
      </div>
    );
  },
);
