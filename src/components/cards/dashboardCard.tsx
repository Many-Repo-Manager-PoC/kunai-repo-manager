import { component$ } from "@qwik.dev/core";
import { BaseCard } from "./baseCard";
import { Slot } from "@qwik.dev/core";

export interface DashboardCardProps {
  title: string;
  description?: string;
  rootClassNames?: string;
  divider?: boolean;
}

export const DashboardCard = component$<DashboardCardProps>(
  ({ title, description, rootClassNames, divider = false }) => {
    return (
      <BaseCard
        rootClassNames={`cursor-pointer hover:shadow-xl transition-shadow duration-300 dark:bg-kunai-blue-600 min-h-[200px] ${rootClassNames}`}
        divider={divider}
      >
        <div q:slot="header" class="flex justify-center">
          <h3 class="text-xl font-semibold dark:text-white">{title}</h3>
        </div>
        <div q:slot="body">
          {description && (
            <p class="text-gray-600 dark:text-gray-300 text-xl">
              {description}
            </p>
          )}
          <div>
            <Slot />
          </div>
        </div>
      </BaseCard>
    );
  },
);
