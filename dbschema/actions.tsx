// import { client } from "~/gel";
// import e from "../dbschema/edgeql-js";

// export async function updateRepository(formData: FormData) {
//   const id = formData.get("id");
//   const name = formData.get("name");
//   const description = formData.get("description");

//   if (
//     typeof id !== "string" ||
//     (typeof name !== "string" && typeof description !== "string")
//   ) {
//     return;
//   }

//   const nameSet = typeof name === "string" ? { name } : {};
//   const descriptionSet =
//     typeof description === "string" ? { description: description || null } : {};

//   await e
//     .update(e.Repository, (r) => ({
//       filter_single: e.op(r.repository_id, "=", e.int64(id)),
//       set: {
//         ...nameSet,
//         ...descriptionSet,
//       },
//     }))
//     .run(client);
// }

// export async function addPackageJson(formData: FormData) {
//   const repositoryId = formData.get("repositoryId");
//   const name = formData.get("name");
//   const version = formData.get("version");

//   if (
//     typeof repositoryId !== "string" ||
//     typeof name !== "string" ||
//     typeof version !== "string"
//   ) {
//     return;
//   }

//   await e
//     .params(
//       {
//         name: e.str,
//         version: e.str,
//         repositoryId: e.int64,
//       },
//       (params) => {
//         const repository = e.assert_exists(
//           e.select(e.Repository, (r) => ({
//             filter_single: e.op(r.repository_id, "=", params.repositoryId),
//           })),
//         );

//         const packageJson = e.insert(e.PackageJson, {
//           name: params.name,
//           package_version: params.version,
//         });
//         return e.update(repository, (r) => ({
//           set: {
//             package_json: packageJson,
//           },
//         }));
//       },
//     )
//     .run(client, {
//       name,
//       version,
//       repositoryId,
//     });
// }

// export async function deletePackageJson(formData: FormData) {
//   const packageJsonId = formData.get("packageJsonId");

//   if (typeof packageJsonId !== "string") {
//     return;
//   }

//   await e
//     .params({ id: e.uuid }, (params) =>
//       e.delete(e.PackageJson, (p) => ({
//         filter_single: e.op(p.id, "=", params.id),
//       })),
//     )
//     .run(client, { id: packageJsonId });
// }
