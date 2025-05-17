import { component$, type QwikIntrinsicElements } from "@builder.io/qwik";
import { LuGitFork } from "@qwikest/icons/lucide";

export const GitForkIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuGitFork {...props} />;
});
