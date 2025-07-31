import { $, component$, useComputed$ } from "@qwik.dev/core";
import { useForm, zodForm$, reset, getValue } from "@modular-forms/qwik";
import { SelectInput } from "~/components/formInputs/selectInput";
import { Button } from "@kunai-consulting/kunai-design-system";
import {
  DesignSystemSyncFormType,
  designSystemSyncSchema,
} from "~/routes/designSystemSync";
import { useGetRepositories } from "~/hooks/repository.hooks";

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
    const [form, { Form, Field }] = useForm<
      DesignSystemSyncFormType,
      { url: string }
    >({
      loader: {
        value: {
          sourceRepoFullName: "",
          targetRepoFullName: "",
        },
      },
      validate: zodForm$(designSystemSyncSchema),
      //   action: designSystemSync,
    });

    const handleReset = $(() => {
      reset(form);
    });

    return (
      <div>
        <Form>
          <div class="flex flex-col gap-6">
            <div class="grid grid-cols-2 gap-8">
              <Field name="sourceRepoFullName">
                {(field, props) => (
                  <SelectInput
                    {...props}
                    label="Source Repository"
                    value={field.value}
                    error={field.error}
                    options={designSystemRepositories.value
                      .filter(
                        (repo) =>
                          repo.full_name !==
                          getValue(form, "targetRepoFullName"),
                      )
                      .map((repo) => ({
                        label: repo.full_name,
                        value: repo.full_name,
                      }))}
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
                      options={designSystemRepositories.value
                        .filter(
                          (repo) =>
                            repo.full_name !==
                            getValue(form, "sourceRepoFullName"),
                        )
                        .map((repo) => ({
                          label: repo.full_name,
                          value: repo.full_name,
                        }))}
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
              >
                Copy Components
              </Button>
            </div>

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
