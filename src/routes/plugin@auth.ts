import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";

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
            scope: 'read:user user:email repo workflow',
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
        return session;
      },
    },
  })
);
