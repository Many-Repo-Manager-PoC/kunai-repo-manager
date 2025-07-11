import { component$, type QwikIntrinsicElements } from "@qwik.dev/core";
import { LuGithub } from "@qwikest/icons/lucide";

export const GitHubIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuGithub {...props} />;
});
