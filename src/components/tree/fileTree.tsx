import { $, component$, useSignal } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/kunai-design-system";
import { Tree } from "@kunai-consulting/qwik";
import { LuChevronRight } from "@qwikest/icons/lucide";
import { TreeNode } from "~/util/tree";

export interface TreeProps {
  treeData: TreeNode[];
  onChange$: (value: string[]) => void;
}

export const FileTree = component$<TreeProps>(({ treeData, onChange$ }) => {
  const selectedItems = useSignal<string[]>([]);

  const handleChange = $((_: Event, element: HTMLInputElement) => {
    if (element.checked) {
      selectedItems.value = [...selectedItems.value, element.value];
    } else {
      selectedItems.value = selectedItems.value.filter(
        (item) => item !== element.value,
      );
    }
    onChange$(selectedItems.value);
  });

  const renderTreeItem = (item: TreeNode, level: number) => {
    const indentStyle = { marginLeft: `${level * 1.5}rem` };

    if (item.children && item.children.length > 0) {
      return (
        <Tree.Item key={item.name}>
          <div style={indentStyle} class="flex items-center gap-2">
            <TreeItem
              name={item.name}
              path={item.path}
              onChange$={handleChange}
            />
            <Tree.ItemTrigger
              type="button"
              class="flex items-center gap-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
            >
              <span class="text-gray-700 dark:text-gray-200 text-sm">
                {item.name}
              </span>
              <LuChevronRight class="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Tree.ItemTrigger>
          </div>
          <Tree.ItemContent>
            {item.children.map((child) => renderTreeItem(child, level + 1))}
          </Tree.ItemContent>
        </Tree.Item>
      );
    }

    return (
      <Tree.Item key={item.name}>
        <div style={indentStyle} class="flex items-center gap-2">
          <TreeItem
            name={item.name}
            path={item.path}
            onChange$={handleChange}
          />
          <span class="text-gray-700 dark:text-gray-200 text-sm">
            {item.name}
          </span>
        </div>
      </Tree.Item>
    );
  };

  return (
    <Tree.Root class="min-w-[200px] max-w-md">
      {treeData.map((item) => renderTreeItem(item, 0))}
    </Tree.Root>
  );
});

interface TreeItemProps extends Omit<TreeNode, "children"> {
  onChange$: (event: Event, element: HTMLInputElement) => void;
}

const TreeItem = component$<TreeItemProps>(({ name, path, onChange$ }) => {
  return (
    <Checkbox.Root class="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded cursor-pointer">
      <Checkbox.Input onChange$={onChange$} name={name} value={path} />
    </Checkbox.Root>
  );
});
