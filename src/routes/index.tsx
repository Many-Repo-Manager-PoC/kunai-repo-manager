import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, useLocation } from "@builder.io/qwik-city";
import { useSignIn } from "~/routes/plugin@auth";
import { Button } from "@kunai-consulting/kunai-design-system";
import { RepositoryCard } from "~/components/cards/repositoryCard";

export default component$(() => {
  const signInSig = useSignIn();
  const location = useLocation();
  const owner = location.params.owner;
  const repoName = location.params.repoName;
  return (
    <>
      <Form action={signInSig}>
        <input type="hidden" name="providerId" value="github" />
        <input type="hidden" name="options.redirectTo" value="/" />
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
      <p>
        <a href={`/allRepositories/${owner}/${repoName}`}>Repository Details</a>
      </p>
      <p>
        <a href="/allRepositories">All Repositories</a>
      </p>
      <RepositoryCard
        repo={{
          id: 1,
          full_name: "kunai-consulting/kunai-design-system",
          name: "kunai-design-system",
          repo: "kunai-design-system",
          html_url: "https://github.com/kunai-consulting/kunai-design-system",
          url: "https://github.com/kunai-consulting/kunai-design-system",
          language: "TypeScript",
          description: "Kunai Design System",
          updated_at: "2021-01-01",
          stargazers_count: 100,
          forks_count: 100,
          watchers_count: 100,
          homepage: "https://kunai-design-system.com",
          topics: ["design-system", "typescript", "react"],
          open_issues_count: 100,
          license: {
            name: "MIT",
          },
          owner: {
            login: "kunai-consulting",
            avatar_url: "https://github.com/kunai-consulting.png",
            html_url: "https://github.com/kunai-consulting",
            type: "Organization",
          },
        }}
      />
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
