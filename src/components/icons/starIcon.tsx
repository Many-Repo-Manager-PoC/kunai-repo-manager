import { component$, QwikIntrinsicElements } from "@builder.io/qwik";
import { LuGithub, LuStar } from "@qwikest/icons/lucide";

export const StarIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuStar {...props} />;
});
