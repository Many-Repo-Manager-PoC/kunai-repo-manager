import { type RequestHandler } from "@qwik.dev/router";
import type { WebhookEvent } from "@octokit/webhooks-types";
import e from "@dbschema/edgeql-js";
import { executeQuery } from "~/actions/client";

export const onPost: RequestHandler = async ({ request, json }) => {
  const data = (await request.json()) as WebhookEvent;
  if (
    "repository" in data &&
    data.repository &&
    "changes" in data &&
    data.changes
  ) {
    console.log(`Processing repository event for ${data.repository.name}`);
    console.log(data);
    if (data.repository.name) {
      const repoName = data.repository.name;
      const q1 = e.select(e.Repository, (r) => ({
        filter_single: e.op(r.name, "=", repoName),
      }));
      const repo = await executeQuery((client) => q1.run(client));
      console.log(data.changes);
      if (!repo) {
        console.log(`Repository ${repoName} not found`);
        json(200, { message: "Repository not found" });
        return;
      }
      console.log(`Repository ${repoName} found`);
      if ("topics" in data.changes) {
        const q2 = e.update(e.Repository, (r) => ({
          filter_single: e.op(r.name, "=", repoName),
          set: {
            topics: data.repository?.topics.join(","),
          },
        }));
        await executeQuery((client) => q2.run(client));
        console.log(`Repository ${repoName} updated`);
      }
      json(200, { message: "Repository updated" });
    } else {
      console.log(`Unknown event`, data);
      json(200, { message: "Unknown event" });
    }

    // push event update package.json in db
    // if meta recreate hook on org
  }
};
