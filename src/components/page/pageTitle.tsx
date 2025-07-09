import { component$ } from "@qwik.dev/core";
import { useDocumentHead } from "@qwik.dev/router";

export interface PageTitleProps {
  title?: string;
}

export const PageTitle = component$<PageTitleProps>(({ title }) => {
  const documentHead = useDocumentHead();
  const pageTitle = title ?? documentHead.title;
  const words = pageTitle.split(" ");
  const firstWord = words.at(0);
  const restOfTitle = words.slice(1).join(" ");
  return (
    <>
      <div
        role="presentation"
        class="h-1 bg-gradient-to-r from-kunai-blue-500 to-kunai-purple-500 rounded-full mb-8"
      ></div>
      <h1 class="text-3xl font-bold mb-8">
        <span class="text-kunai-blue-500">{`${firstWord} `}</span>
        {restOfTitle}
      </h1>
    </>
  );
});
