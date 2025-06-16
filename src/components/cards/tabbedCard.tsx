import { component$ } from "@builder.io/qwik";
import { Card } from "@kunai-consulting/kunai-design-system";
import { Slot } from "@builder.io/qwik";
import { Tabs } from "@kunai-consulting/qwik";

export interface TabbedCardProps {
  tabList?: string[];
}

export const TabbedCard = component$<TabbedCardProps>(({ tabList }) => {
  return (
    <Card.Root class="shadow-lg dark:bg-kunai-blue-600/50 bg-kunai-blue-100/50 w-full">
      <Tabs.Root class="grid grid-cols-12 w-full">
        <Tabs.List class="flex flex-row lg:flex-col gap-5 lg:border-r lg:border-b-0 border-b pb-4 border-gray-500 dark:border-white lg:col-span-2 col-span-12">
          {tabList?.map((tab, index) => (
            <Tabs.Trigger
              class={`
                cursor-pointer
                text-left
                rounded-l-md
                p-2
                text-kunai-blue-500 
                dark:text-gray-100 
                text-xl 
                hover:text-kunai-blue-500 
                hover:dark:text-white 
                hover:dark:bg-kunai-blue-300/50 
                hover:bg-kunai-blue-100 
                data-selected:bg-kunai-blue-100 
                data-selected:dark:bg-kunai-blue-300/50 
                w-full
              `}
              key={tab}
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabList?.map((tab) => (
          <Tabs.Content
            key={tab}
            class="lg:pl-5 py-5  lg:col-span-10 col-span-12"
          >
            <div class="flex flex-col gap-4 justify-center">
              <Card.Title>
                <span class="text-3xl font-large">{tab}</span>
              </Card.Title>

              <div>
                <Slot name={tab} />
              </div>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Card.Root>
  );
});
