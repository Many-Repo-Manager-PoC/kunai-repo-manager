/* Generated using Cursor as a Proof of Concept. */

import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import { Toast } from "./toast";

export interface ToastMessage {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const ToastContext = createContextId<{
  showToast: (toast: ToastMessage) => void;
}>("toast-context");

export const ToastProvider = component$(() => {
  const toast = useSignal<ToastMessage | null>(null);

  useContextProvider(ToastContext, {
    showToast: $((newToast: ToastMessage) => {
      toast.value = newToast;
    }),
  });

  return (
    <>
      <Slot />
      {toast.value && (
        <Toast
          message={toast.value.message}
          type={toast.value.type}
          duration={toast.value.duration}
        />
      )}
    </>
  );
});
