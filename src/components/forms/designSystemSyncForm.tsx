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
} from "~/routes/designSystemSync";
import { useGetRepositories } from "~/hooks/repository.hooks";
import { FileTree } from "../tree/fileTree";
import { buildTree } from "~/util/tree";
import { GitHubTreeItem } from "~/db/types";

export interface DesignSystemSyncFormProps {}

export const DesignSystemSyncForm = component$<DesignSystemSyncFormProps>(
  () => {
    const repositories = useGetRepositories();
    const designSystemRepositories = useComputed$(() => {
      return repositories.value; // TODO: filter by design system
      //   return repositories.value.filter((repo) =>
      //     repo.topics.some((x) => x.toLowerCase().includes("design system")),
      //   );
    });

    const sourceFiles = useSignal<GitHubTreeItem[]>([]);

    const treeData = useComputed$(() => {
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
      //   action: designSystemSync,
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
      sourceFiles.value = files;
      formStep.value = "2";
    });

    const handleBack = $(() => {
      formStep.value = "1";
    });

    return (
      <div>
        <Form>
          <div class="flex flex-col gap-6">
            {formStep.value === "2" && (
              <div>
                <div class="grid grid-cols-2 gap-8">
                  <Field name="filePaths" type="string[]">
                    {(field) => (
                      <FileTree
                        error={field.error}
                        value={field.value ?? []}
                        defaultOpenKeys={["src", "components"]}
                        treeData={treeData.value}
                        onChange$={handleChange}
                      />
                    )}
                  </Field>
                </div>
                <div class="flex gap-4 justify-end">
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
            )}
            {formStep.value === "1" && (
              <div>
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
                          ...designSystemRepositories.value
                            .filter(
                              (repo) =>
                                repo.full_name !==
                                getValue(form, "targetRepoFullName"),
                            )
                            .map((repo) => ({
                              label: repo.full_name,
                              value: repo.full_name,
                            })),
                        ]}
                      />
                    )}
                  </Field>
                  {/* Left side: Form fields */}
                  <div class="flex flex-col gap-4">
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
                            ...designSystemRepositories.value
                              .filter(
                                (repo) =>
                                  repo.full_name !==
                                  getValue(form, "sourceRepoFullName"),
                              )
                              .map((repo) => ({
                                label: repo.full_name,
                                value: repo.full_name,
                              })),
                          ]}
                        />
                      )}
                    </Field>
                  </div>
                </div>

                {/* Action buttons */}
                <div class="flex gap-4 justify-end">
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
                    disabled={form.submitting}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Status Messages */}
            <div class="flex gap-4 justify-end">
              {form.submitting && (
                <span class="text-sm text-gray-500">Submitting...</span>
              )}
              {form.response.status === "success" && (
                <>
                  <div class="text-sm text-green-500">
                    {form.response.message}
                  </div>
                  <a
                    href={form.response.data?.url}
                    target="_blank"
                    class="dark:text-white"
                  >
                    View on GitHub
                  </a>
                </>
              )}
              {form.response.status === "error" && (
                <span class="text-sm text-red-500">
                  {form.response.message}
                </span>
              )}
            </div>
          </div>
        </Form>
      </div>
    );
  },
);
