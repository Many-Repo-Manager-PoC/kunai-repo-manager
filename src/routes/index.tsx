import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import { useSignIn } from "~/routes/plugin@auth";
import { Button } from "@kunai-consulting/kunai-design-system";

export default component$(() => {
  const signInSig = useSignIn();

  return (
    <>
      <Form action={signInSig}>
        <input type="hidden" name="providerId" value="github" />
        <input
          type="hidden"
          name="options.redirectTo"
          value="/"
        />
        <Button kind="primary">Sign In</Button>
      </Form>
      <p>
        <a href="/dashboard">Dashboard</a>
      </p>
      <p>
        <a href="/createRepositories">Create Repositories</a>
      </p>
      <p>
        <a href="/error404">Error 404</a>
      </p>
      <p>
        <a href="/home/login">Login</a>
      </p>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};