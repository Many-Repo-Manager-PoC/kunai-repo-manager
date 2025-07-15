import { component$ } from "@qwik.dev/core";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  error: string;
  required?: boolean;
  onInput$: (event: Event, element: HTMLSelectElement) => void;
  onChange$: (event: Event, element: HTMLSelectElement) => void;
  onBlur$: (event: Event, element: HTMLSelectElement) => void;
  options: SelectOption[];
}

export const SelectInput = component$<SelectInputProps>(
  ({ label, error, options, ...props }) => {
    const isInvalid = error && error.length > 0;
    return (
      <div>
        <label
          class={`text-sm block mb-2 font-medium ${isInvalid ? "text-red-500" : "dark:text-white text-black"}`}
        >
          {label}
        </label>

        <select
          {...props}
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
