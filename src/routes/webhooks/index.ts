import { type RequestHandler } from "@qwik.dev/router";
import type { WebhookEvent } from "@octokit/webhooks-types";
import e from "@dbschema/edgeql-js";
import { executeQuery } from "~/actions/client";
import { updateRepository } from "~/actions/repository/repository.service";

export const onPost: RequestHandler = async ({ request, json }) => {
  const data = (await request.json()) as WebhookEvent;
  if ("commits" in data) {
    console.info("Processing push webhook");
    if (data.commits.find((x) => x.added.includes("package.json"))) {
      console.info("Package.json added");
      console.info(data.commits.find((x) => x.added.includes("package.json")));
    }
    if (data.commits.find((x) => x.removed.includes("package.json"))) {
      console.info("Package.json removed");
      console.info(
        data.commits.find((x) => x.removed.includes("package.json")),
      );
    }
  }
  if (
    "repository" in data &&
    data.repository &&
    "changes" in data &&
    data.changes
  ) {
    console.log(`Processing repository event for ${data.repository.name}`);
    console.log(data);
    if (data.repository.name) {
      const changedRepo = data.repository;
      const q1 = e.select(e.Repository, (r) => ({
        filter_single: e.op(r.name, "=", changedRepo.name),
      }));
      const repo = await executeQuery((client) => q1.run(client));
      console.log(data.changes);
      if (!repo) {
        console.log(`Repository ${changedRepo.name} not found`);
        json(200, { message: "Repository not found" });
        return;
      }
      console.log(`Repository ${changedRepo.name} found`);
      // Topics, description, name, private, archived,
      if ("topics" in data.changes) {
        const result = await updateRepository(changedRepo.name, {
          topics: changedRepo.topics,
          description: changedRepo.description,
        });
        console.debug(result);
        console.log(`Repository ${changedRepo.name} updated`);
      }
      json(200, { message: "Repository updated" });
    } else {
      console.log(`Unknown event`, data);
      json(200, { message: "Unknown event" });
    }

    // push event update package.json in db
    // if meta recreate hook on org
  }

  // Handle webhook deletion events
  if ("hook" in data && "action" in data && data.action === "deleted") {
    console.info("Webhook deleted, attempting to recreate...");

    try {
      // Get the organization from the webhook data
      const orgLogin =
        "organization" in data &&
        data.organization &&
        typeof data.organization === "object" &&
        "login" in data.organization
          ? (data.organization as any).login
          : null;
      if (!orgLogin) {
        console.error("No organization found in webhook deletion event");
        json(200, { message: "No organization found" });
        return;
      }

      // Note: We can't recreate the webhook here because we don't have access to the user's token
      // This would need to be handled by a background job or admin endpoint
      console.warn(
        `Webhook deleted for organization ${orgLogin}. Manual recreation required.`,
      );

      json(200, {
        message: "Webhook deletion detected, manual recreation required",
      });
    } catch (error) {
      console.error("Error handling webhook deletion:", error);
      json(500, { message: "Error handling webhook deletion" });
    }
  }
};
