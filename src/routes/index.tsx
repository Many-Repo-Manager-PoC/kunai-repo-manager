import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import { useSignIn } from "./plugin@auth";

import Counter from "../components/starter/counter/counter";
import Hero from "../components/starter/hero/hero";
import Infobox from "../components/starter/infobox/infobox";
import Starter from "../components/starter/next-steps/next-steps";
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
        <Button>Sign In</Button>
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
