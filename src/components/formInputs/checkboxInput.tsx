import { component$, type QRL } from "@qwik.dev/core";
import { Checkbox } from "@kunai-consulting/kunai-design-system";

export interface CheckboxInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: boolean;
  error: string;
  required?: boolean;
  onInput$: QRL<(event: Event, element: HTMLInputElement) => void>;
  onChange$: QRL<(event: Event, element: HTMLInputElement) => void>;
  onBlur$: QRL<(event: Event, element: HTMLInputElement) => void>;
}

export const CheckboxInput = component$<CheckboxInputProps>(
  ({
    name,
    label,
    error,
    value,
    onBlur$,
    onChange$,
    onInput$,
    placeholder,
    required,
  }) => {
    const isInvalid = !!error && error.length > 0;
    return (
      <Checkbox.Root>
        <Checkbox.Input
          checked={value}
          name={name}
          hasError={isInvalid}
          onBlur$={onBlur$}
          onChange$={onChange$}
          onInput$={onInput$}
          required={required}
          placeholder={placeholder}
        />
        <Checkbox.Label class="ml-3 dark:text-white text-black">
          {label}
        </Checkbox.Label>
      </Checkbox.Root>
    );
  },
);
