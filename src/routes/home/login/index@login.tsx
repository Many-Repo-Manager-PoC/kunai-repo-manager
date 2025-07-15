import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { Form } from "@qwik.dev/router";
import { useSignIn } from "~/routes/plugin@auth";
import { Button } from "@kunai-consulting/kunai-design-system";

export default component$(() => {
  const signInSig = useSignIn();
  return (
    <div class="container container-center">
      <div class="flex justify-center">
        <span class="h-12 text-4xl dark:text-white text-kunai-blue-900">
          K &nbsp; U &nbsp; N &nbsp; A &nbsp; I
        </span>
      </div>
      <h1 class="text-center">Repositories Manager</h1>
      <h2 class="text-center">Login with Github</h2>
      <Form action={signInSig}>
        <input type="hidden" name="providerId" value="github" />
        <input type="hidden" name="options.redirectTo" value="/" />
        <div class="flex justify-center mt-8">
          <Button kind="primary" class="text-xl px-8 py-4">
            Sign In
          </Button>
        </div>
      </Form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login with Github",
};
