import { component$, type QwikIntrinsicElements } from "@qwik.dev/core";
import { LuAlertCircle } from "@qwikest/icons/lucide";

export const CircleAlertIcon = component$<QwikIntrinsicElements["svg"]>(
  (props) => {
    return <LuAlertCircle {...props} />;
  },
);
