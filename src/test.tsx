// import { createClient } from "gel";

// import e from "../dbschema/edgeql-js";

// const client = createClient();

// async function main() {
//   console.log(await client.query("select 'Hello from Gel!';"));

//   await e.insert(e.Package, { name: "i-am-one" }).run(client);

//   await e.insert(e.Package, { name: "i-am-two" }).run(client);

//   const packages = await e
//     .select(e.Package, () => ({
//       id: true,
//       name: true,
//     }))
//     .run(client);

//   console.table(packages);

//   await e.delete(e.Package).run(client);
// }

// main().then(
//   () => process.exit(0),
//   (err) => {
//     console.error(err);
//     process.exit(1);
//   },
// );
