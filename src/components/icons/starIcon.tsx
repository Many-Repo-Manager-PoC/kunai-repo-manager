import { component$, QwikIntrinsicElements } from "@builder.io/qwik";
import { LuStar } from "@qwikest/icons/lucide";

export const StarIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuStar {...props} />;
});
