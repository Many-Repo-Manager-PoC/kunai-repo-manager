// "use server";

// import { useContext } from "@builder.io/qwik";
// import { DB_CONTEXT } from "~/root";
// import * as queries from "../../dbschema/queries";
// import type { GetPackageJsonReturns } from "../../dbschema/queries";

// export async function importPackageJson(
//   packageJson: GetPackageJsonReturns[number],
// ) {
//   // Insert the package.json data
//   await queries.getPackageJson(client, {
//     repository_id: packageJson.repository_id,
//     name: packageJson.name,
//   });
// }

// export async function updatePackageJson(
//   packageJson: GetPackageJsonReturns[number],
// ) {
//   await queries.getPackageJson(client, {
//     repository_id: packageJson.repository_id,
//     name: packageJson.name,
//   });
// }

// export async function getPackageJson(repo: string) {
//   // Query the package.json data for a specific repo
//   const result = await queries.getPackageJson(client, {
//     repository_id: parseInt(repo),
//   });

//   return result[0];
// }

// export async function getAllPackageJson() {
//   // Query all package.json data
//   const result = await queries.getPackageJson(client, {});

//   return result;
// }

// export async function deletePackageJson(repo: string) {
//   // Delete the package.json data for a specific repo
//   await queries.getPackageJson(client, {
//     repository_id: parseInt(repo),
//   });
// }
