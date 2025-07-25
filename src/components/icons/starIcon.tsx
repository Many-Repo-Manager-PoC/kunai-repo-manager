import { component$, type QwikIntrinsicElements } from "@qwik.dev/core";
import { LuStar } from "@qwikest/icons/lucide";

export const StarIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuStar {...props} />;
});
