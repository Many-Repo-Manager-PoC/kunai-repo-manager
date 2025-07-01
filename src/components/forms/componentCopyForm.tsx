import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import {
  useForm,
  zodForm$,
  reset,
  setValue,
  getValue,
  validate,
} from "@modular-forms/qwik";
import { TextInput } from "~/components/formInputs/textInput";
import { SelectInput } from "~/components/formInputs/selectInput";
import { Button } from "@kunai-consulting/kunai-design-system";
import { useCreateComponentCopy } from "~/routes/layout";
import {
  type CreateComponentCopyFormType,
  createComponentCopySchema,
  getComponentListForDependencyTree,
} from "~/db/createComponentCopy";
import type { Repo, GitHubTreeItem } from "~/db/types";
import { FileTree } from "~/components/tree/fileTree";
import { buildTree } from "~/util/tree";
import { CopyComponentsModal } from "../modals/copyComponentsModal";
import { useLocation } from "@builder.io/qwik-city";

export interface ComponentCopyFormProps {
  repositories: Repo[];
  sourceComponentTree: GitHubTreeItem[];
}

export const ComponentCopyForm = component$<ComponentCopyFormProps>(
  ({ repositories, sourceComponentTree }) => {
    const createComponentCopy = useCreateComponentCopy();
    const treeData = useComputed$(() => {
      return buildTree(
        sourceComponentTree.map((item) => {
          if (item.path) {
            return item.path;
          }
          return "";
        }),
      );
    });

    const [form, { Form, Field }] = useForm<CreateComponentCopyFormType>({
      loader: {
        value: {
          targetRepo: "",
          targetBranch: "",
          targetPath: "src/components",
          componentPaths: [
            // "src/components/Button",
            // "src/components/Button/Button.tsx",
            "src/components/Cards/BasicCard.tsx",
          ],
        },
      },
      validate: zodForm$(createComponentCopySchema),
      action: createComponentCopy,
    });

    const handleChange = $((_: Event, element: HTMLInputElement) => {
      let selectedItems = getValue(form, "componentPaths") ?? [];
      if (element.checked) {
        selectedItems = [...selectedItems, element.value];
      } else {
        selectedItems = selectedItems.filter((item) => item !== element.value);
      }
      setValue(form, "componentPaths", selectedItems);
    });

    const handleReset = $(() => {
      reset(form);
    });

    const isOpen = useSignal(false);

    // const onModalOpen = $(async () => {
    //   const isValid = await validate(form);

    //   if (isValid) {
    //     isOpen.value = true;
    //     // Fetch component info and build dependency tree
    //     const treeItems = await getComponentListForDependencyTree(
    //       form.internal.fields.componentPaths?.value ?? [],
    //     );
    //   }
    // });

    return (
      <div>
        <Form>
          <div class="flex flex-col gap-6">
            <div class="grid grid-cols-2 gap-8">
              {/* Left side: Form fields */}
              <div class="flex flex-col gap-4">
                <Field name="targetRepo">
                  {(field, props) => (
                    <SelectInput
                      {...props}
                      label="Target Repository"
                      value={field.value}
                      error={field.error}
                      options={repositories.map((repo) => ({
                        label: repo.full_name || "",
                        value: repo.full_name || "",
                      }))}
                    />
                  )}
                </Field>

                <Field name="targetBranch">
                  {(field, props) => (
                    <TextInput
                      {...props}
                      type="text"
                      label="Target Branch"
                      value={field.value}
                      error={field.error}
                      required
                    />
                  )}
                </Field>

                <Field name="targetPath">
                  {(field, props) => (
                    <TextInput
                      {...props}
                      type="text"
                      label="Target Base Path"
                      value={field.value}
                      error={field.error}
                      required
                    />
                  )}
                </Field>
              </div>

              {/* Right side: File tree */}
              <div class="flex flex-col gap-4">
                <label class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Select Components to Copy
                </label>
                <Field name="componentPaths" type="string[]">
                  {(field) => (
                    <FileTree
                      error={field.error}
                      value={field.value ?? []}
                      defaultOpenKeys={["src", "components", "Button", "Cards"]}
                      treeData={treeData.value}
                      onChange$={handleChange}
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
                type="submit"
                disabled={form.submitting}
                // onClick$={onModalOpen}
              >
                Copy Components
              </Button>
            </div>
            <div class="flex justify-center items-center w-full">
              <CopyComponentsModal openSignal={isOpen}>
                <div class="flex flex-col gap-4">
                  <label class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select Components to Copy
                  </label>
                  <Field name="componentPaths" type="string[]">
                    {(field) => (
                      <FileTree
                        error={field.error}
                        value={field.value ?? []}
                        defaultOpenKeys={["src", "components", "Button"]}
                        treeData={treeData.value}
                        onChange$={handleChange}
                      />
                    )}
                  </Field>
                </div>
              </CopyComponentsModal>
            </div>
            {/* Status Messages */}
            <div class="flex gap-4 justify-end">
              {form.submitting && (
                <span class="text-sm text-gray-500">Submitting...</span>
              )}
              {form.response.status === "success" && (
                <span class="text-sm text-green-500">
                  {form.response.message}
                </span>
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
