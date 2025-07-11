import { component$, type QRL } from "@qwik.dev/core";
import { Select } from "@kunai-consulting/kunai-design-system";
import {
  HiChevronUpDownMini,
  HiExclamationTriangleMini,
} from "@qwikest/icons/heroicons";

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
  ref: QRL<(element: HTMLInputElement) => void>;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  options: SelectOption[];
}

export const SelectInput = component$<SelectInputProps>(
  ({ label, placeholder, error, options, ...props }) => {
    const isInvalid = error && error.length > 0;
    return (
      <div>
        <label
          class={`text-sm block mb-2 font-medium ${isInvalid ? "text-red-500" : "dark:text-white text-black"}`}
        >
          {label}
        </label>

        <select class="w-full cursor-pointer text-sm bg-white rounded-md p-2.5">
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

        <Select.Root>
          <Select.Label
            class={isInvalid ? "text-red-500" : "dark:text-white text-black"}
          >
            {label}
          </Select.Label>
          <Select.Trigger class="w-full">
            <Select.DisplayValue placeholder={placeholder} />
            <HiChevronUpDownMini class="h-5 w-5" />
          </Select.Trigger>
          <Select.Popover class="min-w-72 max-h-[400px]">
            <div class="max-h-[400px] overflow-y-auto">
              {options.map((option, index) => (
                <Select.Item key={index} value={option.value}>
                  <Select.ItemLabel>{option.label}</Select.ItemLabel>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </div>
          </Select.Popover>
          <Select.HiddenNativeSelect {...props} />
          {isInvalid && (
            <Select.ErrorMessage class="flex items-center gap-1 text-sm font-[500] leading-5 text-red-500">
              <HiExclamationTriangleMini class="h-4 w-4" />
              <span>{error}</span>
            </Select.ErrorMessage>
          )}
        </Select.Root>
      </div>
    );
  },
);
