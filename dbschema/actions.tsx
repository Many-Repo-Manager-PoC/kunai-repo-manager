import { createClient } from "gel";
import e from "./edgeql-js";

export async function insertPackageJson(formData: FormData) {
  const client = createClient();

  const name = formData.get("name") as string;
  const packageVersion = formData.get("version") as string;
  const dependencies = formData.get("dependencies")
    ? JSON.parse(formData.get("dependencies") as string)
    : [];
  const devDependencies = formData.get("devDependencies")
    ? JSON.parse(formData.get("devDependencies") as string)
    : [];

  // Insert PackageJson and its dependencies in a single transaction
  await e
    .params(
      {
        name: e.str,
        package_version: e.str,
        dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
        dev_dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
      },
      (params) => {
        // Insert the PackageJson
        const packageJson = e.insert(e.PackageJson, {
          name: params.name,
          package_version: params.package_version,
          repository: e
            .select(e.Repository, (repo) => ({
              filter: e.op(repo.name, "=", params.name),
            }))
            .assert_single(),
        });

        // Insert production dependencies
        const prodDeps = e.for(e.array_unpack(params.dependencies), (dep) =>
          e.insert(e.ProdDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: packageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        // Insert development dependencies
        const devDeps = e.for(e.array_unpack(params.dev_dependencies), (dep) =>
          e.insert(e.DevDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: packageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        return e.select({
          package_json: packageJson,
          prod_dependencies: prodDeps,
          dev_dependencies: devDeps,
        });
      },
    )
    .run(client, {
      name,
      package_version: packageVersion,
      dependencies,
      dev_dependencies: devDependencies,
    });
}

export async function updatePackageJson(formData: FormData) {
  const client = createClient();

  const name = formData.get("name") as string;
  const packageVersion = formData.get("version") as string;
  const dependencies = formData.get("dependencies")
    ? JSON.parse(formData.get("dependencies") as string)
    : [];
  const devDependencies = formData.get("devDependencies")
    ? JSON.parse(formData.get("devDependencies") as string)
    : [];

  console.log("name", name);
  console.log("packageVersion", packageVersion);
  console.log("dependencies", dependencies);
  console.log("devDependencies", devDependencies);

  await e
    .params(
      {
        name: e.str,
        package_version: e.str,
        dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
        dev_dependencies: e.array(
          e.tuple({ name: e.str, dependency_version: e.str }),
        ),
      },
      (params) => {
        // Get the existing PackageJson for this repository
        const existingPackageJson = e
          .select(e.PackageJson, (pkg) => ({
            filter: e.op(pkg.repository.name, "=", params.name),
          }))
          .assert_single();

        // Delete all existing dependencies associated with this PackageJson
        const deleteProdDependencies = e.delete(
          e.ProdDependency,
          (dependency) => ({
            filter: e.op(
              dependency.package_json.id,
              "=",
              existingPackageJson.id,
            ),
          }),
        );

        const deleteDevDependencies = e.delete(
          e.DevDependency,
          (dependency) => ({
            filter: e.op(
              dependency.package_json.id,
              "=",
              existingPackageJson.id,
            ),
          }),
        );

        // Update the PackageJson with new values
        const updatedPackageJson = e
          .update(e.PackageJson, (pkg) => ({
            filter: e.op(pkg.repository.name, "=", params.name),
            set: {
              name: params.name,
              package_version: params.package_version,
            },
          }))
          .assert_single();

        // Insert new production dependencies
        const prodDeps = e.for(e.array_unpack(params.dependencies), (dep) =>
          e.insert(e.ProdDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: updatedPackageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        // Insert new development dependencies
        const devDeps = e.for(e.array_unpack(params.dev_dependencies), (dep) =>
          e.insert(e.DevDependency, {
            name: dep.name,
            dependency_version: dep.dependency_version,
            package_json: updatedPackageJson,
            repository: e
              .select(e.Repository, (repo) => ({
                filter: e.op(repo.name, "=", params.name),
              }))
              .assert_single(),
          }),
        );

        return e.select({
          deleted_prod_dependencies: deleteProdDependencies,
          deleted_dev_dependencies: deleteDevDependencies,
          updated_package_json: updatedPackageJson,
          new_prod_dependencies: prodDeps,
          new_dev_dependencies: devDeps,
        });
      },
    )
    .run(client, {
      name,
      package_version: packageVersion,
      dependencies,
      dev_dependencies: devDependencies,
    });
}

export async function deletePackageJson(formData: FormData) {
  const client = createClient();

  const repositoryName = formData.get("repository_name") as string;

  await e
    .params(
      {
        name: e.str,
      },
      (params) => {
        // First, delete existing dependencies for this repository
        const deleteDependencies = e.delete(e.Dependency, (dependency) => ({
          filter: e.op(dependency.repository.name, "=", params.name),
        }));

        // Then, delete the PackageJson
        const deletePackageJson = e.delete(e.PackageJson, (pkg) => ({
          filter: e.op(pkg.repository.name, "=", params.name),
        }));

        return e.select({
          deleted_dependencies: deleteDependencies,
          deleted_package_json: deletePackageJson,
        });
      },
    )
    .run(client, { name: repositoryName });
}
