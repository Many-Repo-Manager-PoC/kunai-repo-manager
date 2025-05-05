import { component$ } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import { z } from "zod";
import { TextInput } from "~/components/formInputs/textInput";
import { SelectInput } from "../formInputs/selectInput";
import { CheckboxInput } from "../formInputs/checkboxInput";
import { GithubLicenses } from "~/db/constants";
import { Button } from "@kunai-consulting/kunai-design-system";

const createRepositorySchema = z.object({
  repoName: z.string().min(1, "Repository name is required"),
  repoDescription: z.string().optional(),
  homepage: z.string().url().optional(),
  visibility: z.enum(["public", "private"]).default("public").optional(),
  hasIssues: z.boolean().default(true).optional(),
  hasProjects: z.boolean().default(true).optional(),
  hasWiki: z.boolean().default(true).optional(),
  hasDownloads: z.boolean().default(true).optional(),
  isTemplate: z.boolean().default(false).optional(),
  teamId: z.number().optional(),
  autoInit: z.boolean().default(false).optional(),
  gitignoreTemplate: z.string().optional(),
  licenseTemplate: z.string().optional(),
  allowSquashMerge: z.boolean().default(true).optional(),
  allowMergeCommit: z.boolean().default(true).optional(),
  allowRebaseMerge: z.boolean().default(true).optional(),
  allowAutoMerge: z.boolean().default(false).optional(),
  deleteBranchOnMerge: z.boolean().default(false).optional(),
  useSquashPrTitleAsDefault: z.boolean().default(false).optional(),
  squashMergeCommitTitle: z.string().optional(),
  squashMergeCommitMessage: z.string().optional(),
  mergeCommitTitle: z.string().optional(),
  mergeCommitMessage: z.string().optional(),
});

export type CreateRepositoryType = z.infer<typeof createRepositorySchema>;

export const CreateRepositoryForm = component$(() => {
  const [, { Form, Field }] = useForm<CreateRepositoryType>({
    loader: {
      value: {
        repoName: "",
        visibility: "public",
        repoDescription: "",
        homepage: "",
        hasIssues: true,
        hasProjects: true,
        hasWiki: true,
        hasDownloads: true,
        isTemplate: false,
        teamId: undefined,
        autoInit: false,
        gitignoreTemplate: "",
        licenseTemplate: "",
        allowSquashMerge: true,
        allowMergeCommit: true,
        allowRebaseMerge: true,
        allowAutoMerge: false,
        deleteBranchOnMerge: false,
        useSquashPrTitleAsDefault: false,
        squashMergeCommitTitle: "",
        squashMergeCommitMessage: "",
        mergeCommitTitle: "",
        mergeCommitMessage: "",
      },
    },
  });

  return (
    <div>
      <Form>
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
        <Field name="autoInit" type="boolean">
          {(field, props) => {
            return (
              <CheckboxInput
                {...props}
                label="Initialize with a README"
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
                  { value: "none", label: "None" },
                  { value: "python", label: "Python" },
                  { value: "node", label: "Node" },
                  { value: "ruby", label: "Ruby" },
                  { value: "go", label: "Go" },
                  { value: "rust", label: "Rust" },
                  { value: "java", label: "Java" },
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
                label="License Template"
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
        <Field name="allowSquashMerge" type="boolean">
          {(field, props) => {
            return (
              <CheckboxInput
                {...props}
                label="Allow Squash Merge"
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
        <Button type="submit">Create Repository</Button>
      </Form>
    </div>
  );
});
