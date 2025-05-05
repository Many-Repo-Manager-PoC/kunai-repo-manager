import { component$, type QRL } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/kunai-design-system";

export interface CheckboxInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: boolean;
  error: string;
  required?: boolean;
  ref: QRL<(element: HTMLInputElement) => void>;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
}

export const CheckboxInput = component$<CheckboxInputProps>(
  ({ name, label, error, value, ...props }) => {
    const isInvalid = !!error && error.length > 0;
    return (
      <Checkbox.Root>
        <Checkbox.Input
          checked={value}
          name={name}
          hasError={isInvalid}
          {...props}
        />
        <Checkbox.Label>{label}</Checkbox.Label>
      </Checkbox.Root>
    );
  }
);
