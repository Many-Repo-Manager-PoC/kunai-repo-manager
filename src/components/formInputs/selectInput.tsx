import { component$, type QRL } from "@qwik.dev/core";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectInputProps {
  name: string;
  label?: string;
  value?: string;
  error: string;
  required?: boolean;
  onInput$: QRL<(event: Event, element: HTMLSelectElement) => void>;
  onChange$: QRL<(event: Event, element: HTMLSelectElement) => void>;
  onBlur$: QRL<(event: Event, element: HTMLSelectElement) => void>;
  options: SelectOption[];
}

export const SelectInput = component$<SelectInputProps>(
  ({
    label,
    error,
    options,
    value,
    required,
    name,
    onBlur$,
    onChange$,
    onInput$,
  }) => {
    const isInvalid = error && error.length > 0;
    return (
      <div>
        <label
          class={`text-sm block mb-2 font-medium ${isInvalid ? "text-red-500" : "dark:text-white text-black"}`}
        >
          {label}
        </label>

        <select
          value={value}
          name={name}
          onBlur$={onBlur$}
          onChange$={onChange$}
          onInput$={onInput$}
          required={required}
          class="w-full cursor-pointer text-sm bg-white rounded-md p-2.5"
        >
          {options.map((option, index) => (
            <option
              class="flex p-2 hover:bg-gray-200 transition-colors duration-200 bg-white cursor-pointer "
              key={index}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);
