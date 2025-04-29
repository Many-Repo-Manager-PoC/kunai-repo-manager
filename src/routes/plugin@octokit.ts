/**
 * GitHub API plugin using Octokit
 *
 * This plugin automatically initializes an Octokit client when a user is authenticated
 * and makes it available to all route handlers via the shared map.
 *
 * @example
 * // In your route handler:
 * export const onGet: RequestHandler = async ({ sharedMap }) => {
 *   const octokit = sharedMap.get(OCTOKIT_KEY);
 *
 *     const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();
 *     return { repos };
 * };
 */

import { Octokit } from "octokit";
import type { RequestHandler } from "@builder.io/qwik-city";
import type { Session } from "@auth/qwik";

export const OCTOKIT_KEY = "octokit_client";

export const onRequest: RequestHandler = async ({ sharedMap }) => {
  // Get the session from the shared map (assuming it's already set by the auth plugin)
  const session: Session = sharedMap.get("session");

  if (session?.accessToken) {
    // Create the Octokit client
    try {
      const octokit = new Octokit({
        auth: session.accessToken,
      });

      // Store it in the shared map for the duration of the request
      sharedMap.set(OCTOKIT_KEY, octokit);
    } catch (error) {
      console.error("Failed to initialize Octokit client:", error);
      // Optionally: Add fallback behavior or error reporting
    }
  }
};
