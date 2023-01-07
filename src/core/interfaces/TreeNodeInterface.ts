export type TreeNode = {
  name: string;
  path: string;
  children: Array<TreeNode>;
  isDirectory: boolean;
  isIgnored: boolean;
  isExpanded: boolean;
  translations: Array<string>;
};
