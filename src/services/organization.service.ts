import type { Octokit } from "octokit";
import { executeQuery } from "~/actions/client";
import e from "@dbschema/edgeql-js";
import {
  ensureOrganizationWebhook,
  updateOrganizationWebhookInDB,
} from "./webhook.service";

export interface GitHubOrganization {
  id: number;
  login: string;
  avatar_url: string;
  name?: string;
  email?: string;
  node_id: string;
  gravatar_id?: string;
  url: string;
  html_url?: string;
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  starred_url?: string;
  subscriptions_url?: string;
  organizations_url?: string;
  repos_url: string;
  events_url: string;
  received_events_url?: string;
  type: string;
  site_admin?: boolean;
  starred_at?: string;
  description?: string | null;
  hooks_url?: string;
  issues_url?: string;
  members_url?: string;
  public_members_url?: string;
}

export interface OrganizationOnboardingConfig {
  webhookUrl: string;
  webhookSecret?: string;
  webhookEvents: string[];
}

/**
 * Inserts or updates an organization in the database
 */
export async function upsertOrganization(
  orgData: GitHubOrganization,
  webhookId?: number,
  webhookUrl?: string,
): Promise<any> {
  try {
    const org = await executeQuery((client) =>
      e
        .insert(e.Organization, {
          organization_id: orgData.id,
          login: orgData.login,
          avatar_url: orgData.avatar_url,
          name: orgData.name,
          email: orgData.email,
          node_id: orgData.node_id,
          gravatar_id: orgData.gravatar_id || "",
          url: orgData.url,
          html_url: orgData.html_url || "",
          followers_url: orgData.followers_url || "",
          following_url: orgData.following_url || "",
          gists_url: orgData.gists_url || "",
          starred_url: orgData.starred_url || "",
          subscriptions_url: orgData.subscriptions_url || "",
          organizations_url: orgData.organizations_url || "",
          repos_url: orgData.repos_url,
          events_url: orgData.events_url,
          received_events_url: orgData.received_events_url || "",
          role_type: orgData.type,
          site_admin: orgData.site_admin || false,
          starred_at: orgData.starred_at,
          webhook_id: webhookId,
          webhook_url: webhookUrl,
        })
        .unlessConflict((org) => ({
          on: org.login,
          else: e.update(e.Organization, () => ({
            filter_single: { login: orgData.login },
            set: {
              organization_id: orgData.id,
              avatar_url: orgData.avatar_url,
              name: orgData.name,
              email: orgData.email,
              node_id: orgData.node_id,
              gravatar_id: orgData.gravatar_id || "",
              url: orgData.url,
              html_url: orgData.html_url || "",
              followers_url: orgData.followers_url || "",
              following_url: orgData.following_url || "",
              gists_url: orgData.gists_url || "",
              starred_url: orgData.starred_url || "",
              subscriptions_url: orgData.subscriptions_url || "",
              organizations_url: orgData.organizations_url || "",
              repos_url: orgData.repos_url,
              events_url: orgData.events_url,
              received_events_url: orgData.received_events_url || "",
              role_type: orgData.type,
              site_admin: orgData.site_admin || false,
              starred_at: orgData.starred_at,
              webhook_id: webhookId,
              webhook_url: webhookUrl,
            },
          })),
        }))
        .run(client),
    );

    return org;
  } catch (error) {
    console.error(`Failed to upsert organization ${orgData.login}:`, error);
    throw error;
  }
}

/**
 * Onboards an organization by creating/updating it in the database and setting up webhooks
 */
export async function onboardOrganization(
  octokit: Octokit,
  orgData: GitHubOrganization,
  config: OrganizationOnboardingConfig,
): Promise<{
  organization: any;
  webhook: { id: number; url: string; action: string };
}> {
  try {
    // First, get existing organization data to check for existing webhook
    const existingOrg = await executeQuery((client) =>
      e
        .select(e.Organization, (org) => ({
          filter_single: e.op(org.login, "=", orgData.login),
          webhook_id: true,
          webhook_url: true,
        }))
        .run(client),
    );

    // Ensure webhook exists
    const webhookResult = await ensureOrganizationWebhook(
      octokit,
      orgData.login,
      {
        url: config.webhookUrl,
        events: config.webhookEvents,
        active: true,
        secret: config.webhookSecret,
      },
      existingOrg?.webhook_id,
    );

    // Update organization in database with webhook info
    const organization = await upsertOrganization(
      orgData,
      webhookResult.id,
      webhookResult.url,
    );

    return {
      organization,
      webhook: webhookResult,
    };
  } catch (error) {
    console.error(`Failed to onboard organization ${orgData.login}:`, error);
    throw error;
  }
}

/**
 * Gets all organizations from the database
 */
export async function getAllOrganizations(): Promise<any[]> {
  try {
    const orgs = await executeQuery((client) =>
      e
        .select(e.Organization, () => ({
          id: true,
          login: true,
          name: true,
          avatar_url: true,
          webhook_id: true,
          webhook_url: true,
          last_updated: true,
        }))
        .run(client),
    );

    return orgs;
  } catch (error) {
    console.error("Failed to get all organizations:", error);
    throw error;
  }
}

/**
 * Gets a specific organization by login
 */
export async function getOrganizationByLogin(
  login: string,
): Promise<any | null> {
  try {
    const org = await executeQuery((client) =>
      e
        .select(e.Organization, (org) => ({
          filter_single: e.op(org.login, "=", login),
          id: true,
          login: true,
          name: true,
          avatar_url: true,
          webhook_id: true,
          webhook_url: true,
          last_updated: true,
        }))
        .run(client),
    );

    return org;
  } catch (error) {
    console.error(`Failed to get organization ${login}:`, error);
    return null;
  }
}

/**
 * Checks and recreates webhooks for all organizations
 */
export async function checkAndRecreateWebhooks(
  octokit: Octokit,
  config: OrganizationOnboardingConfig,
): Promise<
  Array<{ login: string; action: string; success: boolean; error?: string }>
> {
  try {
    const organizations = await getAllOrganizations();
    const results = [];

    for (const org of organizations) {
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

        // Update webhook info in database
        await updateOrganizationWebhookInDB(
          org.login,
          webhookResult.id,
          webhookResult.url,
        );

        results.push({
          login: org.login,
          action: webhookResult.action,
          success: true,
        });
      } catch (error) {
        console.error(
          `Failed to check/recreate webhook for organization ${org.login}:`,
          error,
        );
        results.push({
          login: org.login,
          action: "failed",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to check and recreate webhooks:", error);
    throw error;
  }
}
