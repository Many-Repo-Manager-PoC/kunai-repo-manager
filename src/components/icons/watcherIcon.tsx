import { component$, type QwikIntrinsicElements } from "@qwik.dev/core";
import { LuEye } from "@qwikest/icons/lucide";

export const WatcherIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuEye {...props} />;
});
