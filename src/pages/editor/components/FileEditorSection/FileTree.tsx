import React from 'react';
import './FileTree.scss';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TreeNode } from '../../../../core/interfaces/TreeNodeInterface';
import fileIcon from '../../../../assets/icons/file.svg';
import folderIcon from '../../../../assets/icons/folder.svg';
import folderOpenedIcon from '../../../../assets/icons/folder-opened.svg';
import { setActiveFile, setIsExpandedOnDirectoryNode } from '../../../../redux/slices/filesSlice';

function FileTree() {
	const fileTree = useAppSelector((state) => state.files.tree);
	const activeFile = useAppSelector((state) => state.files.activeFile);
	const dispatch = useAppDispatch();

	function onFileItemClick(node: TreeNode) {
		if (node.isDirectory && fileTree?.children) {
			dispatch(setIsExpandedOnDirectoryNode(node));
		} else {
			if (node.name === activeFile?.name) return;

			dispatch(setActiveFile(node));
		}
	}

	const FileRenderer = (node: TreeNode) => {
		const hasChildren = node?.children && node.isExpanded;

		return (
			<>
				<div
					className={`flex flex-row ml-3 mb-1 hover:bg-gray-700 cursor-pointer ${
						node.isIgnored && 'text-gray-800'
					}`}
					onClick={(e) => onFileItemClick(node)}>
					<img
						className="h-6 my-auto"
						alt=""
						src={node.isDirectory ? (node.isExpanded ? folderOpenedIcon : folderIcon) : fileIcon}
					/>
					<span className={`ml-3 ${node.name === activeFile?.name && 'text-yellow-300'}`}>
						{node.name}
					</span>
				</div>
				<div className="ml-3">
					{hasChildren && node.children.map((x) => <FileRenderer key={x.name} {...x} />)}
				</div>
			</>
		);
	};

	return (
		<div className="file__tree bg-gray-600 dark:text-white">
			{fileTree ? FileRenderer({ ...fileTree }) : <div>Empty</div>}
		</div>
	);
}

export default FileTree;
