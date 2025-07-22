import { $, component$ } from "@builder.io/qwik";
import { useForm, zodForm$, reset } from "@modular-forms/qwik";
import { TextInput } from "~/components/formInputs/textInput";
import { SelectInput } from "~/components/formInputs/selectInput";
import { CheckboxInput } from "~/components/formInputs/checkboxInput";
import { GithubLicenses } from "~/db/constants";
import { Button } from "@kunai-consulting/kunai-design-system";
import { useCreateRepository } from "~/routes/layout";
import {
  type CreateRepositoryFormType,
  createRepositorySchema,
} from "~/db/createRepository";

export const CreateRepositoryForm = component$(() => {
  const createRepository = useCreateRepository();
  const [form, { Form, Field }] = useForm<
    CreateRepositoryFormType,
    { url: string }
  >({
    loader: {
      value: {
        repoType: "user",
        repoName: "",
        visibility: "public",
        repoDescription: "",
        homepage: undefined,
        hasIssues: true,
        hasProjects: true,
        hasWiki: true,
        hasDownloads: true,
        isTemplate: false,
        // teamId: undefined,
        autoInit: false,
        gitignoreTemplate: "",
        licenseTemplate: "",
        allowSquashMerge: true,
        allowMergeCommit: true,
        allowRebaseMerge: true,
        allowAutoMerge: false,
        deleteBranchOnMerge: false,
        // useSquashPrTitleAsDefault: false,
        // squashMergeCommitTitle: "",
        // squashMergeCommitMessage: "",
        // mergeCommitTitle: "",
        // mergeCommitMessage: "",
      },
    },
    validate: zodForm$(createRepositorySchema),
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
          <div class="col-span-2">
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
          </div>
          <Field name="homepage">
            {(field, props) => {
              return (
                <TextInput
                  {...props}
                  type="url"
                  label="Homepage URL"
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
          <h5 class="text-lg dark:text-white font-semibold col-span-2">
            Features
          </h5>
          <Field name="hasIssues" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Has Issues"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="hasProjects" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Has Projects"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="hasWiki" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Create Wiki"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="hasDownloads" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Has Downloads"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <h5 class="text-lg dark:text-white font-semibold col-span-2">
            Initialize Repository
          </h5>
          <Field name="autoInit" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Add README file"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="isTemplate" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Is this a template repository?"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="gitignoreTemplate">
            {(field, props) => {
              return (
                <SelectInput
                  {...props}
                  label="Gitignore Template"
                  value={field.value}
                  error={field.error}
                  options={[
                    { value: "Python", label: "Python" },
                    { value: "Node", label: "Node" },
                    { value: "Ruby", label: "Ruby" },
                    { value: "Go", label: "Go" },
                    { value: "Rust", label: "Rust" },
                    { value: "Java", label: "Java" },
                  ]}
                />
              );
            }}
          </Field>
          <Field name="licenseTemplate">
            {(field, props) => {
              return (
                <SelectInput
                  {...props}
                  label="License"
                  value={field.value}
                  error={field.error}
                  options={GithubLicenses.map((license) => ({
                    value: license.keyword,
                    label: license.name,
                  }))}
                />
              );
            }}
          </Field>
          <h5 class="text-lg dark:text-white font-semibold col-span-2">
            Merge Settings
          </h5>
          <Field name="allowSquashMerge" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Allow squash merge"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="deleteBranchOnMerge" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Delete branch on merge"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>

          <Field name="allowRebaseMerge" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Allow rebase merging"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="allowAutoMerge" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Allow auto-merge"
                  value={field.value}
                  error={field.error}
                />
              );
            }}
          </Field>
          <Field name="allowMergeCommit" type="boolean">
            {(field, props) => {
              return (
                <CheckboxInput
                  {...props}
                  label="Allow merge commits"
                  value={field.value}
                  error={field.error}
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
              <div class="text-sm text-green-500">{form.response.message}</div>
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
