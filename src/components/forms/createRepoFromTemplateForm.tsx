import { $, component$, useComputed$ } from "@builder.io/qwik";
import { useForm, zodForm$, reset } from "@modular-forms/qwik";
import { TextInput } from "~/components/formInputs/textInput";
import { SelectInput } from "~/components/formInputs/selectInput";
import { Button } from "@kunai-consulting/kunai-design-system";
import { useCreateTemplateRepository } from "~/routes/layout";
import {
  type CreateRepositoryFromTemplateFormType,
  createRepositoryFromTemplateSchema,
} from "~/db/createRepository";
import { Repo } from "~/db/types";

export interface CreateRepositoryFromTemplateFormProps {
  repos: Repo[];
}

export const CreateRepositoryFromTemplateForm =
  component$<CreateRepositoryFromTemplateFormProps>(({ repos }) => {
    const createRepository = useCreateTemplateRepository();
    const templateRepos = useComputed$(() => {
      return repos.filter((r) => r.is_template);
    });
    const [form, { Form, Field }] = useForm<
      CreateRepositoryFromTemplateFormType,
      { url: string }
    >({
      loader: {
        value: {
          repoType: "user",
          repoName: "",
          visibility: "public",
          repoDescription: "",
          templateRepo: undefined,
        },
      },
      validate: zodForm$(createRepositoryFromTemplateSchema),
      action: createRepository,
    });

    const handleReset = $(() => {
      reset(form);
    });

    return (
      <div>
        <Form>
          <div class="grid grid-cols-2 gap-4">
            <h5 class="text-lg dark:text-white font-semibold col-span-2">
              General Information
            </h5>
            <Field name="repoType">
              {(field, props) => {
                return (
                  <SelectInput
                    {...props}
                    label="Repository Type"
                    value={field.value}
                    error={field.error}
                    options={[
                      { value: "user", label: "User" },
                      { value: "org", label: "Organization" },
                    ]}
                  />
                );
              }}
            </Field>
            <Field name="repoName">
              {(field, props) => {
                return (
                  <TextInput
                    {...props}
                    type="text"
                    label="Repository Name"
                    value={field.value}
                    error={field.error}
                    required
                  />
                );
              }}
            </Field>
            <Field name="templateRepo">
              {(field, props) => {
                return (
                  <SelectInput
                    {...props}
                    label="Create from Template"
                    value={field.value}
                    error={field.error}
                    options={templateRepos.value.map((repo) => ({
                      value: repo.name ?? "",
                      label: repo.name ?? "",
                    }))}
                  />
                );
              }}
            </Field>
            <Field name="repoDescription">
              {(field, props) => {
                return (
                  <TextInput
                    {...props}
                    type="text"
                    label="Repository Description"
                    value={field.value}
                    error={field.error}
                  />
                );
              }}
            </Field>
            <Field name="visibility">
              {(field, props) => {
                return (
                  <SelectInput
                    {...props}
                    label="Visibility"
                    value={field.value}
                    error={field.error}
                    options={[
                      { value: "public", label: "Public" },
                      { value: "private", label: "Private" },
                    ]}
                  />
                );
              }}
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
              Create Repository
            </Button>
          </div>
          <div class="flex gap-4 justify-end mt-4">
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
              <span class="text-sm text-red-500">{form.response.message}</span>
            )}
          </div>
        </Form>
      </div>
    );
  });
