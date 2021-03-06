import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeInterface } from '../../core/interfaces/FileTreeInterface';
import { TreeNode } from '../../core/interfaces/TreeNodeInterface';

const initialState: FileTreeInterface = {
    tree: null,
    activeFile: null,
};


const filesSlice = createSlice({
    name: 'tree',
    initialState,
    reducers: {
        setFiles(state, action: PayloadAction<TreeNode>) {
            state.tree = action.payload;
        },
        setActiveFile(state, action: PayloadAction<TreeNode>) {
            state.activeFile = action.payload;
        },
        setIsExpandedOnDirectoryNode(state, action: PayloadAction<TreeNode>) {
            const findAndModifyFileTreeNode = (originalNodes: TreeNode[], node: TreeNode) => {
                const foundNode = originalNodes.find((x: TreeNode) => x.name === node.name);
                if (foundNode) {
                    foundNode.isExpanded = !foundNode.isExpanded;
                    return;
                }

                originalNodes.forEach((x) => {
                    findAndModifyFileTreeNode(x.children, node);
                });
            }

            if (state.tree) findAndModifyFileTreeNode(state.tree.children, action.payload)
        },
    },
});

export const { setFiles, setActiveFile, setIsExpandedOnDirectoryNode } = filesSlice.actions;

export default filesSlice.reducer;
