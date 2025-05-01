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
