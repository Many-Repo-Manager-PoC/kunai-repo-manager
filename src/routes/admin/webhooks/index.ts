import { type RequestHandler } from "@qwik.dev/router";
import { checkAndRecreateWebhooks } from "~/services/organization.service";
import { OCTOKIT_CLIENT } from "~/routes/plugin@octokit";

export const onPost: RequestHandler = async ({ sharedMap, json }) => {
  try {
    const octokit = sharedMap.get(OCTOKIT_CLIENT);
    if (!octokit) {
      json(401, { error: "No authenticated GitHub client available" });
      return;
    }

    // Get webhook configuration from environment
    const webhookUrl =
      process.env.WEBHOOK_URL || "https://your-app.com/webhooks";
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const webhookEvents = ["push", "repository", "package"];

    console.info("Starting webhook health check and recreation...");

    const results = await checkAndRecreateWebhooks(octokit, {
      webhookUrl,
      webhookSecret,
      webhookEvents,
    });

    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };

    console.info("Webhook health check completed:", summary);

    json(200, {
      message: "Webhook health check completed",
      summary,
    });
  } catch (error) {
    console.error("Failed to check and recreate webhooks:", error);
    json(500, {
      error: "Failed to check and recreate webhooks",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const onGet: RequestHandler = async ({ json }) => {
  // Return information about the webhook health check endpoint
  json(200, {
    message: "Webhook health check endpoint",
    description:
      "POST to this endpoint to check and recreate webhooks for all organizations",
    requiredAuth: "GitHub OAuth with admin:org_hook scope",
    environmentVariables: {
      WEBHOOK_URL: "The URL where webhooks should be sent",
      WEBHOOK_SECRET: "Optional secret for webhook verification",
    },
  });
};
