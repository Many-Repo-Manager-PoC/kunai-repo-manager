export interface TreeNode {
  name: string;
  path: string;
  children: TreeNode[];
}

export const buildTree = (paths: string[]): TreeNode[] => {
  const root: TreeNode[] = [];
  const pathMap = new Map<string, TreeNode>();

  // Sort paths to ensure parent nodes are created before children
  const sortedPaths = [...paths].sort();

  for (const path of sortedPaths) {
    const parts = path.split("/");
    let currentPath = "";
    let parentNode: TreeNode | undefined;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap.has(currentPath)) {
        const node: TreeNode = {
          name: part,
          path: currentPath,
          children: [],
        };

        if (i === 0) {
          // Root level node
          root.push(node);
        } else if (parentNode) {
          // Child node
          parentNode.children.push(node);
        }

        pathMap.set(currentPath, node);
      }

      parentNode = pathMap.get(currentPath);
    }
  }

  return root;
};
