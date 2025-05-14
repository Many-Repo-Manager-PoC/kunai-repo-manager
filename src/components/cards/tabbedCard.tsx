import { component$ } from "@builder.io/qwik";
import { Card, Divider, Tabs } from "@kunai-consulting/kunai-design-system";
import { Slot } from "@builder.io/qwik";

export interface TabbedCardProps {
  tabList?: string[];
}

export const TabbedCard = component$<TabbedCardProps>(({ tabList }) => {
  return (
    <Card.Root class="shadow-lg min-h-[600px]">
      <Tabs.Root vertical class="gap-3 grid grid-flow-col min-h-[600px]">
        <Tabs.List class="flex flex-col gap-5 border-r border-gray-200 dark:border-gray-700">
          {tabList?.map((tab, index) => (
            <Tabs.Tab key={tab} selected={index === 0}>
              <span>{tab}</span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabList?.map((tab) => (
          <Tabs.Panel key={tab} class="col-span-10">
            <div>
              <Card.Title>
                <span class="text-3xl font-large">{tab}</span>
              </Card.Title>
              <div class="text-gray-300">
                <Divider />
              </div>
              <Slot name={tab} />
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </Card.Root>
  );
});
