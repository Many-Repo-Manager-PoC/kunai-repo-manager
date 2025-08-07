import { server$ } from "@qwik.dev/router";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";
import metadata from "../db/metadata.json";

import * as queries from "../../dbschema/queries";
import { getClient } from "~/actions/client";

export const useInsertOrUpdatePackageJson = server$(async function (
  repositoryName: string,
) {
  try {
    const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);

    // Find the dependency path for the specified repository
    const dependencyPath = metadata.dependencyPaths.find(
      (path) => path[0] === repositoryName,
    );

    if (!dependencyPath) {
      throw new Error(
        `Repository ${repositoryName} not found in metadata.dependencyPaths`,
      );
    }

    // Get package.json content from GitHub
    const { data } = await octokit.rest.repos.getContent({
      owner: metadata.owner,
      repo: dependencyPath[0],
      path: dependencyPath[1],
      mediaType: {
        format: "object",
      },
    });

    const content = atob((data as { content: string }).content || "");
    const packageJson = JSON.parse(content);

    // Prepare dependencies data
    const dependencies = packageJson.dependencies
      ? Object.entries(packageJson.dependencies).map(([name, version]) => ({
          name,
          dependency_version: version as string,
        }))
      : [];

    const devDependencies = packageJson.devDependencies
      ? Object.entries(packageJson.devDependencies).map(([name, version]) => ({
          name,
          dependency_version: version as string,
        }))
      : [];

    // Use the existing insertPackageJson function
    const insertArgs: queries.InsertOrUpdatePackageJsonArgs = {
      name: packageJson.name || repositoryName,
      package_version: packageJson.version || "1.0.0",
      dependencies: dependencies,
      dev_dependencies: devDependencies,
      repository: repositoryName,
    };
    await queries.insertOrUpdatePackageJson(getClient(), insertArgs);

    return {
      success: true,
      message: `Package.json for ${repositoryName} successfully inserted`,
      data: {
        name: packageJson.name,
        version: packageJson.version,
        dependenciesCount: dependencies.length,
        devDependenciesCount: devDependencies.length,
        repository: repositoryName,
      },
    };
  } catch (error) {
    console.error("Error getting and inserting package.json:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
});

export const useDeletePackageJson = server$(async (formData: FormData) => {
  try {
    const repository_id = Number(formData.get("repository_id"));
    if (!repository_id) {
      throw new Error("Repository ID is required");
    }
    await queries.deletePackageJson(getClient(), {
      repository_id: repository_id,
    });
    return {
      success: true,
      message: "Package.json successfully deleted",
    };
  } catch (error) {
    console.error("Error deleting package.json:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});
