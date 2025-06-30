import { ParseResult, parseSync } from "oxc-parser";
import { walk, parseAndWalk } from "oxc-walker";
import { ResolverFactory } from "oxc-resolver";
import type {} from "@oxc-project/types";
import path, { dirname, relative, resolve } from "node:path";

// const resolver = new ResolverFactory({
//   extensions: [".tsx", ".ts", ".js", ".jsx"],
//   preferRelative: true,
//   resolveToContext: true,
//   roots: ["src/components"],
// });

export const parseFileContents = (fileContent: string, filePath: string) => {
  const filename = path.basename(filePath);
  const resolvedPaths: string[] = [];
  console.log("filePath", filePath);
  const dir = process.cwd();

  // Step 1: Parse the file to get the AST
  const ast = parseSync(filename, fileContent, {
    sourceType: "module",
    astType: "ts",
    lang: "tsx",
  });

  // Step 2: Get all import paths (e.g. "~/components/Button")
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
const isLocalImport = (importPath: string): boolean => {
  return importPath.startsWith(".") || importPath.startsWith("~");
};
