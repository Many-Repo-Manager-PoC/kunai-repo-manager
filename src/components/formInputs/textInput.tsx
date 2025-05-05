import { component$, type QRL } from "@builder.io/qwik";
import { Field } from "@kunai-consulting/kunai-design-system";
import { HiExclamationTriangleMini } from "@qwikest/icons/heroicons";

export interface TextInputProps {
  name: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date";
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error: string;
  required?: boolean;
  ref: QRL<(element: HTMLInputElement) => void>;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
}

export const TextInput = component$<TextInputProps>(
  ({ name, type, label, error, ...props }) => {
    const isInvalid = error && error.length > 0;
    return (
      <Field.Root>
        <Field.Label for={name}>{label}</Field.Label>
        <Field.Box>
          <Field.Input type={type} {...props} />
        </Field.Box>
        {isInvalid && (
          <Field.Error>
            <HiExclamationTriangleMini class="h-4 w-4" />
            <span>{error}</span>
          </Field.Error>
        )}
      </Field.Root>
    );
  },
);
