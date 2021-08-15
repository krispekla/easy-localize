import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { HashRouter, withRouter } from 'react-router-dom';
import { Project } from '../../../core/interfaces/ProjectInterface';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { changeProjectFolder, removeProject, renameProject } from '../../../redux/slices/settingsSlice';

function ProjectList({ history }: any | HashRouter) {
	const contextMenuRef = useRef() as MutableRefObject<ContextMenu>;
	const [currentItem, setCurrentItem] = useState(-1);
	const projects = useAppSelector((state) => state.settings.projects);
	const dispatch = useAppDispatch();

	useEffect(() => {
		window.electron.on('resize-window-return', (event: any, args: any) => {
			console.log(args);
		});
		return () => {
			window.electron.removeAllListeners('resize-window-return');
		};
	}, []);

	function onProjectOpen(e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) {
		e.preventDefault();

		if (window.electron) {
			window.electron.send('window-open-editor', 'editor');
		}
		history.push('/editor');
	}

	const contextMenuItems = [
		{
			label: 'Rename',
			command: onProjectRename,
		},
		{
			label: 'Change folder',
			command: onProjectChangeFolder,
		},
		{
			label: 'Remove',
			command: onProjectRemove,
		},
	];

	function onProjectRename(e: any) {
		if (currentItem) dispatch(renameProject({ index: currentItem, newName: 'rename' }));
	}

	function onProjectChangeFolder(e: any) {
		if (currentItem) dispatch(changeProjectFolder({ index: currentItem, newSrc: 'newSrc' }));
	}

	function onProjectRemove(e: any) {
		if (currentItem) dispatch(removeProject(currentItem));
	}

	function onItemContextMenuClickShow(e: any, index: any) {
		setCurrentItem(index);
	}

	function onItemContextMenuClickHide(e: any) {
		setCurrentItem(-1);
	}

	return (
		<>
			<div className="flex flex-row mt-5 dark:text-white">
				<span className="w-5/12 pl-2">Name</span>
				<span className="w-7/12 ">Folder</span>
			</div>
			<hr className="bg-blue-200 h-1 border-0 mt-2 mb-3" />

			{projects.map((project: Project, key: number) => {
				return (
					<React.Fragment key={key}>
						<ContextMenu
							model={contextMenuItems}
							ref={contextMenuRef}
							onShow={(e) => onItemContextMenuClickShow(e, key)}
							onHide={onItemContextMenuClickHide}></ContextMenu>
						<div
							onClick={(e) => onProjectOpen(e, key)}
							onContextMenu={(e) => contextMenuRef.current.show(e)}
							className="flex flex-row dark:text-white text-sm hover:bg-indigo-800 hover:shadow-md cursor-pointer py-3">
							<span className="w-5/12 pl-2">{project.name}</span>
							<span className="w-6/12 font-light">{project.src}</span>
							<span className="w-1/12">{project.isPinned ? 'yes' : 'no'}</span>
						</div>
					</React.Fragment>
				);
			})}
		</>
	);
}

export default withRouter(ProjectList);
