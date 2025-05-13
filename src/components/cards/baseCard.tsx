import { Card, Divider } from "@kunai-consulting/kunai-design-system";
import { component$, type QRL, Slot } from "@builder.io/qwik";

export interface BaseCardProps {
  rootClassNames?: string;
  divider?: boolean;
  onClick$?: QRL<(event: PointerEvent, element: HTMLDivElement) => any>;
}

export const BaseCard = component$<BaseCardProps>(
  ({ rootClassNames, onClick$, divider = true }) => {
    return (
      <Card.Root onClick$={onClick$} class={`shadow-lg ${rootClassNames}`}>
        <div class="flex-grow gap-3 flex flex-col">
          <Card.Title class="mb-2 flex items-center font-semibold">
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
