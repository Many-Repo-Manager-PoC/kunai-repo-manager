"use server";

import { client } from "~/gel";
import e from "../../dbschema/edgeql-js";
import type { PackageJson } from "~/models";

export async function importPackageJson(packageJson: PackageJson) {
  // Insert the package.json data
  await e
    .insert(e.PackageJson, {
      repo: packageJson.repo,
      packageJson: e.insert(e.PackageJsonData, {
        name: packageJson.packageJson.name,
        version: packageJson.packageJson.version,
        dependencies: packageJson.packageJson.dependencies,
        devDependencies: packageJson.packageJson.devDependencies,
      }),
      error: packageJson.error,
    })
    .run(client);
}

export async function updatePackageJson(packageJson: PackageJson) {
  await e
    .update(e.PackageJson, (pkg) => ({
      filter: e.op(pkg.repo, "=", packageJson.repo),
      set: {
        error: packageJson.error,
        packageJson: e.assert_single.arguments(
          e.PackageJsonData,
          (data: any) => ({
            filter: e.op(data.name, "=", packageJson.packageJson.name),
            set: {
              version: packageJson.packageJson.version,
              dependencies: packageJson.packageJson.dependencies,
              devDependencies: packageJson.packageJson.devDependencies,
            },
          }),
        ),
      },
    }))
    .run(client);
}

export async function getPackageJson(repo: string) {
  // Query the package.json data for a specific repo
  const result = await e
    .select(e.PackageJson, (packageJson) => ({
      repo: true,
      error: true,
      packageJson: {
        name: true,
        version: true,
        dependencies: true,
        devDependencies: true,
      },
      filter: e.op(packageJson.repo, "=", repo),
    }))
    .run(client);

  return result[0];
}

export async function getAllPackageJson() {
  // Query all package.json data
  const result = await e
    .select(e.PackageJson, () => ({
      repo: true,
      error: true,
      packageJson: {
        name: true,
        version: true,
        dependencies: true,
        devDependencies: true,
      },
    }))
    .run(client);

  return result;
}

export async function deletePackageJson(repo: string) {
  // Delete the package.json data for a specific repo
  await e
    .delete(e.PackageJson, (packageJson) => ({
      filter: e.op(packageJson.repo, "=", repo),
    }))
    .run(client);
}
