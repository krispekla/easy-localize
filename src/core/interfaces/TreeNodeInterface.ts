
export interface TreeNode {
    name: string;
    path: string;
    children: Array<TreeNode>;
    isDirectory: boolean;
    isIgnored: boolean;
    isExpanded: boolean;
}