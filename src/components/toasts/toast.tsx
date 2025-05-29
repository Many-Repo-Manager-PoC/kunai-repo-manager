/* Generated using Cursor as a Proof of Concept. */

import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { CircleAlertIcon } from "../icons";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export const Toast = component$<ToastProps>(
  ({ message, type = "info", duration = 3000 }) => {
    const isVisible = useSignal(true);

    useVisibleTask$(({ cleanup }) => {
      const timer = setTimeout(() => {
        isVisible.value = false;
      }, duration);

      cleanup(() => clearTimeout(timer));
    });

    if (!isVisible.value) return null;

    return (
      <div class="fixed bottom-35 right-4 z-50">
        <div
          class={`
            popover="manual"
            flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl
            min-w-[300px]
            ${
              type === "error"
                ? "bg-red-500"
                : type === "success"
                  ? "bg-green-500"
                  : "bg-kunai-blue-500"
            }
            text-white text-lg
          `}
        >
          <CircleAlertIcon class="h-6 w-6" />
          <span class="font-medium">{message}</span>
        </div>
      </div>
    );
  },
);
