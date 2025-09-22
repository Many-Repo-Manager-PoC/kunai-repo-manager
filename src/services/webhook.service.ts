import type { Octokit } from "octokit";
import { executeQuery } from "~/actions/client";
import e from "@dbschema/edgeql-js";

export interface WebhookConfig {
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
}

export interface OrganizationWebhookData {
  id: number;
  login: string;
  webhook_id?: number;
  webhook_url?: string;
}

/**
 * Creates a GitHub webhook for an organization
 */
export async function createOrganizationWebhook(
  octokit: Octokit,
  orgLogin: string,
  webhookConfig: WebhookConfig,
): Promise<{ id: number; url?: string }> {
  try {
    const webhook = await octokit.rest.orgs.createWebhook({
      name: "repo-manager-webhook",
      org: orgLogin,
      config: {
        url: webhookConfig.url,
        content_type: "json",
        secret: webhookConfig.secret,
        insecure_ssl: "0",
      },
      events: webhookConfig.events,
      active: webhookConfig.active,
    });

    return {
      id: webhook.data.id,
      url: webhook.data.config.url,
    };
  } catch (error) {
    console.error(
      `Failed to create webhook for organization ${orgLogin}:`,
      error,
    );
    throw error;
  }
}

/**
 * Updates an existing GitHub webhook for an organization
 */
export async function updateOrganizationWebhook(
  octokit: Octokit,
  orgLogin: string,
  webhookId: number,
  webhookConfig: WebhookConfig,
): Promise<{ id: number; url?: string }> {
  try {
    const webhook = await octokit.rest.orgs.updateWebhook({
      org: orgLogin,
      hook_id: webhookId,
      config: {
        url: webhookConfig.url,
        content_type: "json",
        secret: webhookConfig.secret,
        insecure_ssl: "0",
      },
      events: webhookConfig.events,
      active: webhookConfig.active,
    });

    return {
      id: webhook.data.id,
      url: webhook.data.config.url,
    };
  } catch (error) {
    console.error(
      `Failed to update webhook ${webhookId} for organization ${orgLogin}:`,
      error,
    );
    throw error;
  }
}

/**
 * Deletes a GitHub webhook for an organization
 */
export async function deleteOrganizationWebhook(
  octokit: Octokit,
  orgLogin: string,
  webhookId: number,
): Promise<void> {
  try {
    await octokit.rest.orgs.deleteWebhook({
      org: orgLogin,
      hook_id: webhookId,
    });
  } catch (error) {
    console.error(
      `Failed to delete webhook ${webhookId} for organization ${orgLogin}:`,
      error,
    );
    throw error;
  }
}

/**
 * Lists all webhooks for an organization
 */
export async function listOrganizationWebhooks(
  octokit: Octokit,
  orgLogin: string,
): Promise<Array<{ id: number; url?: string; active: boolean }>> {
  try {
    const webhooks = await octokit.rest.orgs.listWebhooks({
      org: orgLogin,
    });

    return webhooks.data.map((webhook) => ({
      id: webhook.id,
      url: webhook.config.url,
      active: webhook.active,
    }));
  } catch (error) {
    console.error(
      `Failed to list webhooks for organization ${orgLogin}:`,
      error,
    );
    throw error;
  }
}

/**
 * Checks if a webhook exists and is active for an organization
 */
export async function checkWebhookHealth(
  octokit: Octokit,
  orgLogin: string,
  expectedWebhookId: number,
  expectedWebhookUrl: string,
): Promise<{ exists: boolean; active: boolean; needsRecreation: boolean }> {
  try {
    const webhooks = await listOrganizationWebhooks(octokit, orgLogin);
    const targetWebhook = webhooks.find(
      (webhook) => webhook.id === expectedWebhookId,
    );

    if (!targetWebhook) {
      return { exists: false, active: false, needsRecreation: true };
    }

    if (!targetWebhook.active || targetWebhook.url !== expectedWebhookUrl) {
      return {
        exists: true,
        active: targetWebhook.active,
        needsRecreation: true,
      };
    }

    return { exists: true, active: true, needsRecreation: false };
  } catch (error) {
    console.error(
      `Failed to check webhook health for organization ${orgLogin}:`,
      error,
    );
    // If we can't check, assume it needs recreation
    return { exists: false, active: false, needsRecreation: true };
  }
}

/**
 * Ensures a webhook exists for an organization, creating or updating as needed
 */
export async function ensureOrganizationWebhook(
  octokit: Octokit,
  orgLogin: string,
  webhookConfig: WebhookConfig,
  existingWebhookId?: number,
): Promise<{
  id: number;
  url?: string;
  action: "created" | "updated" | "verified";
}> {
  try {
    if (existingWebhookId) {
      // Check if the existing webhook is healthy
      const health = await checkWebhookHealth(
        octokit,
        orgLogin,
        existingWebhookId,
        webhookConfig.url,
      );

      if (!health.needsRecreation) {
        return {
          id: existingWebhookId,
          url: webhookConfig.url,
          action: "verified",
        };
      }

      // Try to update the existing webhook
      try {
        const result = await updateOrganizationWebhook(
          octokit,
          orgLogin,
          existingWebhookId,
          webhookConfig,
        );
        return { ...result, action: "updated" };
      } catch (updateError) {
        console.warn(
          `Failed to update webhook ${existingWebhookId}, will create new one:`,
          updateError,
        );
        // Fall through to create a new webhook
      }
    }

    // Create a new webhook
    const result = await createOrganizationWebhook(
      octokit,
      orgLogin,
      webhookConfig,
    );
    return { ...result, action: "created" };
  } catch (error) {
    console.error(
      `Failed to ensure webhook for organization ${orgLogin}:`,
      error,
    );
    throw error;
  }
}

/**
 * Gets organization data from the database
 */
export async function getOrganizationFromDB(
  orgLogin: string,
): Promise<OrganizationWebhookData | null> {
  try {
    const org = await executeQuery((client) =>
      e
        .select(e.Organization, (org) => ({
          filter_single: e.op(org.login, "=", orgLogin),
          id: true,
          login: true,
          webhook_id: true,
          webhook_url: true,
        }))
        .run(client),
    );

    return { id: Number(org?.id ?? 0), login: org?.login ?? "" };
  } catch (error) {
    console.error(
      `Failed to get organization ${orgLogin} from database:`,
      error,
    );
    return null;
  }
}

/**
 * Updates organization webhook data in the database
 */
export async function updateOrganizationWebhookInDB(
  orgLogin: string,
  webhookId: number,
  webhookUrl: string,
): Promise<void> {
  try {
    await executeQuery((client) =>
      e
        .update(e.Organization, (org) => ({
          filter_single: e.op(org.login, "=", orgLogin),
          set: {
            webhook_id: webhookId,
            webhook_url: webhookUrl,
          },
        }))
        .run(client),
    );
  } catch (error) {
    console.error(
      `Failed to update organization ${orgLogin} webhook data in database:`,
      error,
    );
    throw error;
  }
}
