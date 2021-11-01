import React, { useEffect } from 'react';
import FileToolbar from './components/FileEditorSection/FileToolbar';
import FileEditor from './components/FileEditorSection/FileEditor';
import FileTree from './components/FileEditorSection/FileTree';
import ProjectCommands from './components/ProjectCommands';
import ProjectInfo from './components/ProjectInfo';
import TranslationToolbar from './components/TranslationSection/TranslationToolbar';
import TranslationEditor from './components/TranslationSection/TranslationEditor';
import './Editor.scss';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Project } from '../../core/interfaces/ProjectInterface';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TreeNode } from '../../core/interfaces/TreeNodeInterface';
import { setFiles } from '../../redux/slices/filesSlice';

function Editor() {
	const currentProject: Project = useAppSelector(
		(state) => state.settings.projects[state.settings.currentProject]
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		window.electron.on('read-directory-tree-return', (event: any, fileTree: TreeNode) => {
			fileTree.isExpanded = true;
			dispatch(setFiles(fileTree));
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

	return (
		<div className="editor flex flex-col dark px-5 pt-2">
			<header className="flex justify-between">
				<ProjectInfo />
				<ProjectCommands />
			</header>
			<main className="flex flex-row mt-10 min-w-full">
				<Splitter className="mt-10 min-w-full" gutterSize={8}>
					<SplitterPanel size={20} className="p-d-flex p-ai-center p-jc-center">
						<div className="translation flex flex-col mr-5">
							<h2 className="dark:text-white">Translations</h2>
							<TranslationToolbar />
							<TranslationEditor />
						</div>
					</SplitterPanel>
					<SplitterPanel className="p-d-flex p-ai-center p-jc-center">
						<div className="files__editor flex flex-col">
							<h2 className="dark:text-white">Project files</h2>
							<FileToolbar />
							<Splitter className="mt-4 min-w-full" gutterSize={8}>
								<SplitterPanel size={5} className="">
									<FileTree />
								</SplitterPanel>
								<SplitterPanel className="">
									<FileEditor />
								</SplitterPanel>
							</Splitter>
						</div>
					</SplitterPanel>
				</Splitter>
			</main>
		</div>
	);
}

export default Editor;
