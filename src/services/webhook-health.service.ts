import type { Octokit } from "octokit";
import { getAllOrganizations } from "./organization.service";
import {
  checkWebhookHealth,
  ensureOrganizationWebhook,
} from "./webhook.service";

export interface WebhookHealthCheckResult {
  organization: string;
  webhookExists: boolean;
  webhookActive: boolean;
  needsRecreation: boolean;
  action: "verified" | "recreated" | "failed";
  error?: string;
}

export interface WebhookHealthCheckConfig {
  webhookUrl: string;
  webhookSecret?: string;
  webhookEvents: string[];
}

/**
 * Performs a comprehensive health check on all organization webhooks
 */
export async function performWebhookHealthCheck(
  octokit: Octokit,
  config: WebhookHealthCheckConfig,
): Promise<WebhookHealthCheckResult[]> {
  try {
    const organizations = await getAllOrganizations();
    const results: WebhookHealthCheckResult[] = [];

    for (const org of organizations) {
      try {
        if (!org.webhook_id || !org.webhook_url) {
          // Organization doesn't have a webhook configured
          results.push({
            organization: org.login,
            webhookExists: false,
            webhookActive: false,
            needsRecreation: true,
            action: "failed",
            error: "No webhook configured",
          });
          continue;
        }

        // Check webhook health
        const health = await checkWebhookHealth(
          octokit,
          org.login,
          org.webhook_id,
          org.webhook_url,
        );

        if (!health.needsRecreation) {
          results.push({
            organization: org.login,
            webhookExists: health.exists,
            webhookActive: health.active,
            needsRecreation: false,
            action: "verified",
          });
        } else {
          // Try to recreate the webhook
          try {
            const webhookResult = await ensureOrganizationWebhook(
              octokit,
              org.login,
              {
                url: config.webhookUrl,
                events: config.webhookEvents,
                active: true,
                secret: config.webhookSecret,
              },
              org.webhook_id,
            );

            results.push({
              organization: org.login,
              webhookExists: true,
              webhookActive: true,
              needsRecreation: false,
              action: "recreated",
            });
          } catch (recreateError) {
            results.push({
              organization: org.login,
              webhookExists: health.exists,
              webhookActive: health.active,
              needsRecreation: true,
              action: "failed",
              error:
                recreateError instanceof Error
                  ? recreateError.message
                  : "Unknown error",
            });
          }
        }
      } catch (error) {
        results.push({
          organization: org.login,
          webhookExists: false,
          webhookActive: false,
          needsRecreation: true,
          action: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to perform webhook health check:", error);
    throw error;
  }
}

/**
 * Generates a health check summary
 */
export function generateHealthCheckSummary(
  results: WebhookHealthCheckResult[],
) {
  const total = results.length;
  const verified = results.filter((r) => r.action === "verified").length;
  const recreated = results.filter((r) => r.action === "recreated").length;
  const failed = results.filter((r) => r.action === "failed").length;

  return {
    total,
    verified,
    recreated,
    failed,
    successRate: total > 0 ? ((verified + recreated) / total) * 100 : 0,
    needsAttention: results.filter((r) => r.needsRecreation).length,
  };
}

/**
 * Logs webhook health check results
 */
export function logHealthCheckResults(results: WebhookHealthCheckResult[]) {
  const summary = generateHealthCheckSummary(results);

  console.info("=== Webhook Health Check Summary ===");
  console.info(`Total organizations: ${summary.total}`);
  console.info(`Verified: ${summary.verified}`);
  console.info(`Recreated: ${summary.recreated}`);
  console.info(`Failed: ${summary.failed}`);
  console.info(`Success rate: ${summary.successRate.toFixed(1)}%`);
  console.info(`Need attention: ${summary.needsAttention}`);

  if (summary.failed > 0) {
    console.warn("=== Organizations with Failed Webhooks ===");
    results
      .filter((r) => r.action === "failed")
      .forEach((r) => {
        console.warn(`- ${r.organization}: ${r.error || "Unknown error"}`);
      });
  }

  if (summary.recreated > 0) {
    console.info("=== Organizations with Recreated Webhooks ===");
    results
      .filter((r) => r.action === "recreated")
      .forEach((r) => {
        console.info(`- ${r.organization}: Webhook recreated successfully`);
      });
  }
}
