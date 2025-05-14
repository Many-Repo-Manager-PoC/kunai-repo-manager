import { component$, QwikIntrinsicElements } from "@builder.io/qwik";
import { LuEye } from "@qwikest/icons/lucide";

export const WatcherIcon = component$<QwikIntrinsicElements["svg"]>((props) => {
  return <LuEye {...props} />;
});
