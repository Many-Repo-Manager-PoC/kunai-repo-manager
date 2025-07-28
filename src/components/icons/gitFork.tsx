import { component$, type QwikIntrinsicElements } from "@qwik.dev/core";
import { LuGitFork } from "@qwikest/icons/lucide";

export const GitForkIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuGitFork {...props} />;
});
