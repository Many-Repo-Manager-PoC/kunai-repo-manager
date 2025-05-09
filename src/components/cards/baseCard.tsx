import { Card, Divider } from "@kunai-consulting/kunai-design-system";
import { component$, Slot } from "@builder.io/qwik";

export interface BaseCardProps {
  rootClassNames?: string;
  divider?: boolean;
}

export const BaseCard = component$<BaseCardProps>(
  ({ rootClassNames, divider = true }) => {
    return (
      <Card.Root class={`shadow-lg   ${rootClassNames}`}>
        <div class="flex-grow gap-3 flex flex-col">
          <Card.Title class="mb-2 flex items-center text-2xl font-semibold">
            <Slot name="header" />
          </Card.Title>

          <Slot name="body" />
        </div>
        {divider && (
          <div class="my-5 text-gray-300">
            <Divider />
          </div>
        )}
        <Card.Footer>
          <Slot name="footer" />
        </Card.Footer>
      </Card.Root>
    );
  },
);
