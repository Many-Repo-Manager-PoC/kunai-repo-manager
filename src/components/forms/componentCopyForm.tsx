import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import {
  useForm,
  zodForm$,
  reset,
  setValue,
  getValue,
} from "@modular-forms/qwik";
import { TextInput } from "~/components/formInputs/textInput";
import { SelectInput } from "~/components/formInputs/selectInput";
import { Button } from "@kunai-consulting/kunai-design-system";
import { useCreateComponentCopy } from "~/routes/layout";
import {
  type CreateComponentCopyFormType,
  createComponentCopySchema,
} from "~/db/createComponentCopy";
import { Repo, GitHubTreeItem } from "~/db/types";
import { FileTree } from "../tree/fileTree";
import { buildTree } from "~/util/tree";

export interface ComponentCopyFormProps {
  sourceRepo: string;
  sourceRepoOwner: string;
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
          componentPaths: [],
        },
      },
      validate: zodForm$(createComponentCopySchema),
      action: createComponentCopy,
    });

    const handleComponentPathsChange = $((value: string[]) => {
      console.log(value);
      setValue(form, "componentPaths", value);
      console.log(getValue(form, "componentPaths"));
    });

    const handleReset = $(() => {
      reset(form);
    });

    return (
      <div>
        <Form>
          <div class="grid grid-cols-2 gap-4">
            <div class="px-4 py-8">
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
            </div>

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

            <Field name="componentPaths" type="string[]">
              {() => (
                <FileTree
                  treeData={treeData.value}
                  onChange$={handleComponentPathsChange}
                />
              )}
            </Field>
          </div>
          <div class="flex gap-4 justify-end mt-4">
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
            >
              Copy Components
            </Button>
          </div>
          <div class="flex gap-4 justify-end mt-4">
            {form.submitting && (
              <span class="text-sm text-gray-500">Submitting...</span>
            )}
            {form.response?.status === "success" && (
              <span class="text-sm text-green-500">
                {form.response.message}
              </span>
            )}
            {form.response?.status === "error" && (
              <span class="text-sm text-red-500">{form.response.message}</span>
            )}
          </div>
        </Form>
      </div>
    );
  },
);
