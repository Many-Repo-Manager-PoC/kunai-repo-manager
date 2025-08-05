import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import { Octokit } from "octokit";
import { onboardOrganization } from "~/services/organization.service";

// Extend the session type
declare module "@auth/qwik" {
  interface Session {
    accessToken?: string;
  }
}

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [
      GitHub({
        authorization: {
          params: {
            scope: "read:user user:email repo workflow read:org admin:org_hook",
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
        }

        return token;
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken as string;

        // Onboard organizations and set up webhooks
        try {
          const kit = new Octokit({
            auth: token.accessToken as string,
          });

          const orgs = await kit.rest.orgs.listForAuthenticatedUser();
          console.info(
            "Processing organizations:",
            orgs.data.map((x) => `${x.login}`),
          );

          // Get webhook configuration from environment
          const webhookUrl =
            process.env.WEBHOOK_URL || `https://${process.env.HOST}/webhooks`;
          const webhookSecret = process.env.WEBHOOK_SECRET;
          const webhookEvents = ["push", "repository", "package"];

          // Onboard each organization
          for (const org of orgs.data) {
            try {
              // Cast the org data to match our interface
              const orgData = {
                ...org,
                gravatar_id: "",
                html_url: "",
                followers_url: "",
                following_url: "",
                gists_url: "",
                starred_url: "",
                subscriptions_url: "",
                organizations_url: "",
                received_events_url: "",
                site_admin: false,
                type: "Organization",
              } as any;

              await onboardOrganization(kit, orgData, {
                webhookUrl,
                webhookSecret,
                webhookEvents,
              });
              console.info(`Successfully onboarded organization: ${org.login}`);
            } catch (error) {
              console.error(
                `Failed to onboard organization ${org.login}:`,
                error,
              );
              // Continue with other organizations even if one fails
            }
          }
        } catch (error) {
          console.error("Failed to process organizations during auth:", error);
          // Don't fail the entire auth process if org onboarding fails
        }

        return session;
      },
    },
  }),
);
