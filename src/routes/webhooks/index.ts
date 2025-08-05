import { type RequestHandler } from "@qwik.dev/router";
import { updateRepository } from "~/actions/repository/repository.service";

export const onPost: RequestHandler = async ({ request, json }) => {
  const data = (await request.json()) as any;
  console.log(data);
  const repoName = data.repository?.name;
  const org = data.repository?.owner?.login;
  // events: create, delete, label, public, repository,
  if (data.action === "edited") {
    console.log(`Processing edited event for ${org}/${repoName}`);
    await updateRepository(repoName, org);
  }
  // push event update package.json in db
  // if meta recreate hook on org
  json(200, { message: "works" });
};
