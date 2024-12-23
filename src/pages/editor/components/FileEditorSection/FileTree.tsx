import React from 'react';
import './FileTree.scss';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TreeNode } from '../../../../core/interfaces/TreeNodeInterface';
import fileIcon from '../../../../assets/icons/file.svg';
import folderIcon from '../../../../assets/icons/folder.svg';
import folderOpenedIcon from '../../../../assets/icons/folder-opened.svg';
import {
  setActiveFile,
  setModeToggle,
  setIsExpandedOnDirectoryNode
} from '../../../../redux/slices/filesSlice';

function FileTree() {
  const fileTree = useAppSelector((state) => state.files.tree);
  const activeFile = useAppSelector((state) => state.files.activeFile);
  const selectedTranslation = useAppSelector((state) => state.files.selectedTranslation);
  const dispatch = useAppDispatch();

  function onFileItemClick(node: TreeNode) {
    if (node.isDirectory && fileTree?.children) {
      dispatch(setIsExpandedOnDirectoryNode(node));
    } else {
      dispatch(setModeToggle('editor'));
      if (node.name === activeFile?.name) return;

      dispatch(setActiveFile(node));
    }
  }

  function FileRenderer(node: TreeNode) {
    const hasChildren = node?.children && node.isExpanded;

    return (
      <>
        <div
          className={`text-xs flex flex-row ml-3 mb-1 hover:bg-gray-700 cursor-pointer ${
            node.isIgnored && 'text-gray-800'
          }`}
          onClick={(e) => onFileItemClick(node)}
        >
          <img
            className="h-5 my-auto"
            alt=""
            src={node.isDirectory ? (node.isExpanded ? folderOpenedIcon : folderIcon) : fileIcon}
          />
          <span className={`ml-3 ${node.name === activeFile?.name && 'text-yellow-300'}`}>
            {node.name}
          </span>
          {/* @ts-ignore */}
          {node.translations.some((x) => x.name === selectedTranslation.id) ? (
            <i className="pi pi-circle-fill ml-auto mr-4" />
          ) : (
            ''
          )}
        </div>
        <div className="ml-3">
          {hasChildren && node.children.map((x) => <FileRenderer key={x.name} {...x} />)}
        </div>
      </>
    );
  }

  return (
    <section className="flex flex-col pl-3 pt-2">
      <h2 className="mb-3 text-gray-200">Files</h2>
      <div className="file__tree bg-gray-600 dark:text-white">
        {fileTree ? FileRenderer({ ...fileTree }) : <div>Empty</div>}
      </div>
    </section>
  );
}

export default FileTree;
