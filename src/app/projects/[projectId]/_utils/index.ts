import type { FilesProps } from "../_types";

export type TreeItem = string | [string, ...TreeItem[]];
export interface TreeNode {
  [key: string]: TreeNode | null;
}

export function getFilesKeys(files: FilesProps | null) {
  if (!files) return [];
  return Object.keys(files);
}

export function getFirstFileKey(files: FilesProps | null): string | null {
  if (!files) return null;

  const fileKeys = Object.keys(files);
  return fileKeys.length > 0 ? fileKeys[0]! : null;
}

export function convertNode(
  node: TreeNode,
  name?: string,
): TreeItem | TreeItem[] {
  const entries = Object.entries(node).sort(([a], [b]) => a.localeCompare(b)); // Ensure stable child ordering
  if (entries.length === 0) return name ? name : [];

  const children: TreeItem[] = [];
  for (const [key, value] of entries) {
    if (value === null) {
      // file case
      children.push(key);
    } else {
      // Folder case
      const subTree = convertNode(value, key);
      if (Array.isArray(subTree)) children.push([key, ...subTree]);
      else children.push([key, subTree]);
    }
  }

  return children;
}

/**
 * Convert a record of files to a tree structure
 * @param files - Record of file paths
 * @returns Tree structure based on file paths record
 *
 * @example
 * Input { "src/App.tsx": "...", "package.json": "..."}
 * Output [["src", "App.tsx"], ["package.json"]]
 */
export function convertFilesToTree(files: Record<string, string>): TreeItem[] {
  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]!;

      if (!current[part]) current[part] = {};
      current = current[part];
    }

    const fileName = parts[parts.length - 1]!;
    current[fileName] = null;
  }

  const result = convertNode(tree);

  return Array.isArray(result) ? result : [result];
}
