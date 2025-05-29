/* Proof of concept for using a loader with a toast */

import { useVisibleTask$, type ReadonlySignal } from "@builder.io/qwik";
import { useToast } from "~/components/toasts/use-toast";
import type { Result } from "~/db/types";

export const useWithToast = <T>(
  loader: () => ReadonlySignal<Result<T>>,
): ReadonlySignal<Result<T>> => {
  const { showToast } = useToast();
  const response = loader();

  useVisibleTask$(() => {
    if (response.value.failed) {
      showToast({
        message: response.value.message || "An error occurred",
        type: "error",
      });
    } else {
      showToast({
        message: "Completed with 0 errors",
        type: "success",
      });
    }
  });

  return response;
};
