import React, { Fragment, useEffect, useState } from 'react';
import './FileTree.scss';
import { useAppSelector } from '../../../../redux/hooks';
import { Project } from '../../../../core/interfaces/ProjectInterface';
import { TreeNode } from '../../../../core/interfaces/TreeNodeInterface';
import fileIcon from '../../../../assets/icons/file.svg';
import folderIcon from '../../../../assets/icons/folder.svg';
import folderOpenedIcon from '../../../../assets/icons/folder-opened.svg';

function FileTree() {
	const currentProject: Project = useAppSelector(
		(state) => state.settings.projects[state.settings.currentProject]
	);

	const [fileTree, setFileTree] = useState<TreeNode | null>(null);
	const [activeFile, setActiveFile] = useState<TreeNode | null>(null);

	useEffect(() => {
		window.electron.on('read-directory-tree-return', (event: any, fileTree: TreeNode) => {
			console.log('ASDF', fileTree);
			fileTree.isExpanded = true;
			setFileTree(fileTree);
		});

		loadFileTree();

		return () => {
			window.electron.removeAllListeners('read-directory-tree-return');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function loadFileTree() {
		if (window.electron) {
			window.electron.send('read-directory-tree', {
				path: currentProject.src,
				ignoredDirectory: currentProject.excludedFolders
					? currentProject.excludedFolders
					: ['node_modules'],
			});
		}
	}

	function findAndModifyFileTreeNode(originalNodes: TreeNode[], node: TreeNode) {
		const foundNode = originalNodes.find((x: TreeNode) => x.name === node.name);
		if (foundNode) {
			foundNode.isExpanded = !foundNode.isExpanded;
			return;
		}

		originalNodes.forEach((x) => {
			findAndModifyFileTreeNode(x.children, node);
		});
	}

	function onFileItemClick(node: TreeNode) {
		if (node.isDirectory) {
			// let fileTreeChildren = fileTree?.children;
			if (fileTree?.children) {
				findAndModifyFileTreeNode(fileTree.children, node);
				const updatedFile = { ...fileTree } as unknown as TreeNode;
				setFileTree(updatedFile);
			}
		} else {
			if (node.name === activeFile?.name) return;

			setActiveFile(node);
		}
	}

	const RecursiveComponent = (node: TreeNode) => {
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
					{hasChildren && node.children.map((x) => <RecursiveComponent key={x.name} {...x} />)}
				</div>
			</>
		);
	};

	return (
		<div className="file__tree bg-gray-600 dark:text-white">
			{fileTree ? RecursiveComponent({ ...fileTree }) : <div>Empty</div>}
		</div>
	);
}

export default FileTree;
