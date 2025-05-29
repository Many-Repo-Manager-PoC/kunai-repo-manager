/* Generated using Cursor as a Proof of Concept. */

import { useContext } from "@builder.io/qwik";
import { ToastContext } from "./toast-context";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
