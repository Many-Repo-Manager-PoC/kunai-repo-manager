import { component$, QwikIntrinsicElements } from "@builder.io/qwik";
import { LuAlertCircle } from "@qwikest/icons/lucide";

export const CircleAlertIcon = component$<QwikIntrinsicElements["svg"]>(
  (props) => {
    return <LuAlertCircle {...props} />;
  },
);
