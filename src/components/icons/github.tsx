import { component$, type QwikIntrinsicElements } from "@builder.io/qwik";
import { LuGithub } from "@qwikest/icons/lucide";

export const GitHubIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuGithub {...props} />;
});
