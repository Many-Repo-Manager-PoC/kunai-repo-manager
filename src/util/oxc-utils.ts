import { parseSync } from "oxc-parser";
import path, { dirname } from "node:path";

export const getDependencyPaths = (fileContent: string, filePath: string) => {
  const filename = path.basename(filePath);
  const resolvedPaths: string[] = [];

  // Step 1: Parse the file to get the AST
  const ast = parseSync(filename, fileContent, {
    sourceType: "module",
    astType: "ts",
    lang: "tsx",
  });

  // Step 2: Get all import paths (e.g. "./Button")
  const importPaths = ast.module.staticImports.map((imports) => {
    return imports.moduleRequest.value;
  });

  // Step 3: Resolve each import path to absolute path
  importPaths.forEach((importPath) => {
    if (isLocalImport(importPath)) {
      const resolvedPath = path.join(dirname(filePath), importPath + ".tsx");
      if (resolvedPath) {
        resolvedPaths.push(resolvedPath);
      }
    }
  });

  return resolvedPaths;
};

// Check if the import path is a local import
const isLocalImport = (importPath: string) => importPath.startsWith(".");
