import { component$ } from "@builder.io/qwik";
import { Card, Tabs } from "@kunai-consulting/kunai-design-system";
import { Slot } from "@builder.io/qwik";

export interface TabbedCardProps {
  tabList?: string[];
}

export const TabbedCard = component$<TabbedCardProps>(({ tabList }) => {
  return (
    <Card.Root class="shadow-lg min-h-[800px] dark:bg-kunai-blue-600/50 bg-kunai-blue-100/50 overflow-auto">
      <Tabs.Root vertical class="gap-3 grid grid-flow-col min-h-[800px]">
        <Tabs.List class="flex flex-col gap-5 border-r border-gray-500 dark:border-white">
          {tabList?.map((tab, index) => (
            <Tabs.Tab
              class={`
                text-kunai-blue-500 
                dark:text-gray-100 
                text-xl 
                hover:text-kunai-blue-500 
                hover:dark:text-white 
                hover:dark:bg-kunai-blue-300/50 
                hover:bg-kunai-blue-100 
                data-[state=selected]:bg-kunai-blue-100 
                data-[state=selected]:dark:bg-kunai-blue-300/50 
                w-[200px]
              `}
              key={tab}
              selected={index === 0}
              look="filled"
            >
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabList?.map((tab) => (
          <Tabs.Panel key={tab} class="w-[800px] p-4 h-[800px]">
            <div class="flex flex-col gap-4 h-full">
              <Card.Title>
                <span class="text-3xl font-large">{tab}</span>
              </Card.Title>
              <div class="flex-1">
                <Slot name={tab} />
              </div>
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </Card.Root>
  );
});
