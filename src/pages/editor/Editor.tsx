import React, { useEffect } from 'react';
import { HashRouterProps, withRouter } from 'react-router-dom';
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
import FileEditorCommand from './components/CommandSection/FileEditorCommand';

function Editor({ history }: any | HashRouterProps) {
	const currentProject: Project = useAppSelector(
		(state) => state.settings.projects[state.settings.currentProject]
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!currentProject) {
			window.electron.send('window-open-editor', { window: 'overview' });
			history.push('/overview');
		} else {
			window.electron.on('read-directory-tree-return', (event: any, fileTree: TreeNode) => {
				fileTree.isExpanded = true;
				dispatch(setFiles(fileTree));
			});

			loadFileTree();
		}

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
		<div className="editor flex flex-col dark pt-2">
			{currentProject && (
				<header className="flex justify-between px-5">
					<ProjectInfo />
					<ProjectCommands />
				</header>
			)}
			{currentProject && (
				<main className="">
					<Splitter className="min-w-full min-h-full" gutterSize={5}>
						<SplitterPanel className="filetree-splitter">
							<FileTree />
						</SplitterPanel>
						{/* <SplitterPanel size={20} className="p-d-flex p-ai-center p-jc-center">
							<div className="translation flex flex-col mr-5">
								<h2 className="dark:text-white">Translations</h2>
								<TranslationToolbar />
								<TranslationEditor />
							</div>
						</SplitterPanel> */}
						{/* <SplitterPanel className="p-d-flex p-ai-center p-jc-center"> */}
						{/* <div className="files__editor flex flex-col"> */}
						{/* <h2 className="dark:text-white">Project files</h2> */}
						{/* <FileToolbar /> */}
						{/* <Splitter className="pt-3 min-w-full" gutterSize={5}> */}
						{/* <SplitterPanel size={5} className="">
										<FileTree />3
									</SplitterPanel>
									<SplitterPanel className="">
										<FileEditor />
									</SplitterPanel> */}
						{/* </Splitter> */}
						{/* </div> */}
						{/* </SplitterPanel> */}
						<SplitterPanel className="splitter-editor">
							<Splitter layout="vertical" className="" gutterSize={5}>
								<SplitterPanel className="" size={70}>
									<FileEditor />
								</SplitterPanel>
								<SplitterPanel className="" size={30}>
									<FileEditorCommand />
								</SplitterPanel>
							</Splitter>
						</SplitterPanel>
					</Splitter>
				</main>
			)}
		</div>
	);
}

export default withRouter(Editor);
