import { server$ } from "@builder.io/qwik-city";
import e from "../../dbschema/edgeql-js";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";
import metadata from "../db/metadata.json";
// Import the functions from the existing actions file
import {
  insertPackageJson,
  updatePackageJson,
  deletePackageJson,
} from "../../dbschema/actions";
import { getClient } from "~/actions/client";

export const useRefreshPackageJson = server$(async function (
  repositoryName: string,
) {
  try {
    const octokit: Octokit = this.sharedMap.get(OCTOKIT_CLIENT);
    const client = getClient();

    // Find the dependency path for the specified repository
    const dependencyPath = metadata.dependencyPaths.find(
      (path) => path[0] === repositoryName,
    );
    // console.log("dependencyPath", dependencyPath);

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

    // console.log("data", data);

    const content = atob((data as { content: string }).content || "");
    const packageJson = JSON.parse(content);

    // console.log("packageJson", packageJson);

    // Get repository ID from the database
    const repository = await e
      .select(e.Repository, (repo) => ({
        name: repo.name,
        filter: e.op(repo.name, "=", repositoryName),
      }))
      .run(client);

    console.log("repository found is", repository);

    // Prepare dependencies data
    const dependencies = packageJson.dependencies
      ? Object.entries(packageJson.dependencies).map(([name, version]) => ({
          name,
          dependency_version: version as string,
        }))
      : [];

    // console.log("dependencies are", dependencies);

    const devDependencies = packageJson.devDependencies
      ? Object.entries(packageJson.devDependencies).map(([name, version]) => ({
          name,
          dependency_version: version as string,
        }))
      : [];

    // console.log("devDependencies are", devDependencies);

    // Use the existing insertPackageJson function
    const formData = new FormData();
    formData.append("name", packageJson.name || repositoryName);
    formData.append("version", packageJson.version || "1.0.0");
    formData.append("dependencies", JSON.stringify(dependencies));
    formData.append("devDependencies", JSON.stringify(devDependencies));

    await updatePackageJson(formData);

    return {
      success: true,
      message: `Package.json for ${repositoryName} successfully inserted`,
      data: {
        name: packageJson.name,
        version: packageJson.version,
        dependenciesCount: dependencies.length,
        devDependenciesCount: devDependencies.length,
        repository: repository,
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

export const useInsertPackageJson = server$(async (formData: FormData) => {
  try {
    await insertPackageJson(formData);
    return {
      success: true,
      message: "Package.json successfully inserted",
    };
  } catch (error) {
    console.error("Error inserting package.json:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});

export const useUpdatePackageJson = server$(async (formData: FormData) => {
  try {
    await updatePackageJson(formData);
    return {
      success: true,
      message: "Package.json successfully updated",
    };
  } catch (error) {
    console.error("Error updating package.json:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});

export const useDeletePackageJson = server$(async (formData: FormData) => {
  try {
    await deletePackageJson(formData);
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
