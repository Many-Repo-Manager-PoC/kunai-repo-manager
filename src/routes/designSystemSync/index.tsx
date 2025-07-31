import { formAction$, zodForm$ } from "@modular-forms/qwik";
import { component$ } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";
import { Octokit } from "octokit";
import { z } from "zod";
import { BaseCard } from "~/components/cards/baseCard";
import { DesignSystemSyncForm } from "~/components/forms/designSystemSyncForm";
import { PageTitle } from "~/components/page/pageTitle";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";
export const designSystemSyncSchema = z.object({
  sourceRepoFullName: z.string().min(1, "Source repository is required"),
  targetRepoFullName: z.string().min(1, "Target repository is required"),
});

export type DesignSystemSyncFormType = z.infer<typeof designSystemSyncSchema>;

export const useCreateComponentCopy = formAction$<
  DesignSystemSyncFormType,
  { url: string }
>(async (data, { sharedMap, params }) => {
  try {
    const octokit: Octokit = sharedMap.get(OCTOKIT_CLIENT);
    const { sourceRepoFullName, targetRepoFullName } = data;
    const [targetRepoOwner, targetRepoName] = targetRepoFullName.split("/");

    // First get the SHA of the main branch for the target repo
    const mainBranch = await octokit.rest.repos.getBranch({
      owner: targetRepoOwner,
      repo: targetRepoName,
      branch: "main",
    });

    // get a list of the component files with their content in the format needed for the createTree API
    // const componentTreeList = await getComponentTreeList(
    //   octokit,
    //   sourceRepoOwner,
    //   sourceRepoName,
    //   componentPaths,
    //   basePathOverride,
    // );

    // const newTree = await octokit.rest.git.createTree({
    //   owner: targetRepoOwner,
    //   repo: targetRepoName,
    //   tree: componentTreeList,
    //   base_tree: mainBranch.data.commit.sha,
    // });

    // // create the new PR for the target repo with the new tree and the main branch as the base
    // const pr = await createPullRequest(
    //   octokit,
    //   sourceRepoOwner,
    //   sourceRepoName,
    //   targetRepo,
    //   targetBranchName,
    //   newTree.data.sha,
    //   mainBranch.data.commit.sha,
    // );

    return {
      status: "success",
      message: "Component copy created",
      data: {
        url: "",
      },
    };
  } catch (error) {
    console.error("Error dispatching workflow:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}, zodForm$(designSystemSyncSchema));

export default component$(() => {
  return (
    <div class="container container-center">
      <PageTitle />
      <BaseCard
        divider={false}
        rootClassNames="bg-white/50 dark:bg-kunai-blue-600/50"
      >
        <div q:slot="header">
          <h4>Design System Sync</h4>
        </div>
        <div q:slot="body">
          <DesignSystemSyncForm />
        </div>
      </BaseCard>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Design System Sync",
};
