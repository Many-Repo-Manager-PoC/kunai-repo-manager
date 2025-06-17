/* TODO: Follow-up work - Refactor into a more generic tree component and likely split into multiple files */

import { component$, type QRL, useSignal } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/kunai-design-system";
import { Tree } from "@kunai-consulting/qwik";
import { HiExclamationTriangleMini } from "@qwikest/icons/heroicons";
import { LuChevronRight } from "@qwikest/icons/lucide";
import type { TreeNode } from "~/util/tree";

export interface TreeProps {
  treeData: TreeNode[];
  value: string[];
  error: string;
  onChange$: QRL<(event: Event, element: HTMLInputElement) => void>;
  defaultOpenKeys: string[];
}

export const FileTree = component$<TreeProps>(
  ({ treeData, onChange$, defaultOpenKeys, value, error }) => {
    return (
      <Tree.Root class="min-w-[200px] max-w-md">
        {treeData.map((item) => (
          <TreeBranch
            key={item.name}
            item={item}
            level={0}
            onChange$={onChange$}
            defaultOpenKeys={defaultOpenKeys}
            value={value}
          />
        ))}
        {error && (
          <p class="text-red-500 text-sm font-medium leading-5 flex items-center gap-1">
            <HiExclamationTriangleMini class="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
      </Tree.Root>
    );
  },
);

interface TreeBranchProps {
  item: TreeNode;
  level: number;
  onChange$: QRL<(event: Event, element: HTMLInputElement) => void>;
  defaultOpenKeys: string[];
  value: string[];
}

const TreeBranch = component$<TreeBranchProps>(
  ({ item, level, onChange$, defaultOpenKeys, value }) => {
    const isOpen = useSignal(defaultOpenKeys.includes(item.name));
    const isChecked = value.includes(item.path);
    const indentStyle = { marginLeft: `${level * 1.5}rem` };

    if (item.children.length > 0) {
      return (
        <Tree.Item key={item.name} bind:open={isOpen}>
          <div style={indentStyle} class="flex items-center gap-2">
            {level > 0 && (
              <TreeNode
                isChecked={isChecked}
                name={item.name}
                path={item.path}
                onChange$={onChange$}
              />
            )}
            <Tree.ItemTrigger
              type="button"
              class="group flex items-center gap-1 p-1 hover:bg-gray-100 dark:hover:bg-kunai-blue-200/50 rounded cursor-pointer"
            >
              <span class="text-gray-700 dark:text-gray-200 text-sm">
                {item.name}
              </span>
              <LuChevronRight class="h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 group-data-[open]:rotate-90" />
            </Tree.ItemTrigger>
          </div>
          <Tree.ItemContent>
            {item.children.map((child) => (
              <TreeBranch
                key={child.name}
                item={child}
                level={level + 1}
                onChange$={onChange$}
                defaultOpenKeys={defaultOpenKeys}
                value={value}
              />
            ))}
          </Tree.ItemContent>
        </Tree.Item>
      );
    }

    return (
      <Tree.Item key={item.name}>
        <div style={indentStyle} class="flex items-center gap-2">
          <TreeNode
            isChecked={isChecked}
            name={item.name}
            path={item.path}
            onChange$={onChange$}
          />

          <span class="text-gray-700 dark:text-gray-200 text-sm">
            {item.name}
          </span>
        </div>
      </Tree.Item>
    );
  },
);

interface TreeNodeProps extends Omit<TreeNode, "children"> {
  onChange$: QRL<(event: Event, element: HTMLInputElement) => void>;
  isChecked: boolean;
}

const TreeNode = component$<TreeNodeProps>(
  ({ name, path, onChange$, isChecked }) => {
    return (
      <Checkbox.Root class="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-kunai-blue-200/50 rounded cursor-pointer">
        <Checkbox.Input
          onChange$={onChange$}
          name={name}
          value={path}
          checked={isChecked}
        />
      </Checkbox.Root>
    );
  },
);
