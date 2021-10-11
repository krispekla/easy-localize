import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { HashRouter, withRouter } from 'react-router-dom';
import { Project } from '../../../core/interfaces/ProjectInterface';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
	removeProject,
	toggleProjectPin,
	setCurrentProject,
} from '../../../redux/slices/settingsSlice';
import ProjectDialog from '../../../core/components/ProjectDialog';
import ProjectDialogEnum from '../../../core/enums/ProjectDialogEnum';
import fullPin from '../../../assets/icons/full-pin.svg';
import emptyPin from '../../../assets/icons/empty-pin.svg';
import pin from '../../../assets/icons/pin.png';
import pinFilled from '../../../assets/icons/pin-filled.png';

function ProjectList({ history }: any | HashRouter) {
	const contextMenuRef = useRef() as MutableRefObject<ContextMenu>;
	const [currentItem, setCurrentItem] = useState<Project>();
	const [projectDialogType, setProjectDialogType] = useState<ProjectDialogEnum>(
		ProjectDialogEnum.add
	);
	const [displayDialog, setDisplayDialog] = useState(false);
	const [projectIndex, setProjectIndex] = useState<number>(-1);

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

	function onProjectOpen(e: any, index?: number) {
		const projectId = currentItem ? projects.findIndex((x) => x.name === currentItem.name) : index;
		dispatch(setCurrentProject(projectId as number));

		if (window.electron) {
			window.electron.send('window-open-editor', { window: 'editor', projectId });
		}
		history.push('/editor');
	}

	const contextMenuItems = [
		{
			label: 'Open',
			command: onProjectOpen,
		},
		{
			label: 'Edit project',
			command: onProjectEdit,
		},
		{
			label: 'Remove',
			command: onProjectRemove,
		},
	];

	function onProjectEdit(e: any) {
		setProjectDialogType(ProjectDialogEnum.edit);
		setDisplayDialog(true);
	}

	function onProjectRemove(e: any) {
		if (currentItem) dispatch(removeProject(currentItem));
	}

	function onItemContextMenuClickHide(e: any) {
		setCurrentItem(undefined);
	}

	function clearDefaultDialogType() {
		setProjectDialogType(ProjectDialogEnum.add);
		setProjectIndex(-1);
	}

	function onContextMenuShow(e: any, project: Project) {
		contextMenuRef.current.show(e);
		setProjectIndex(projects.findIndex((x) => x.name === project.name));
		setCurrentItem(project);
	}

	function onProjectPinClick(index: number) {
		dispatch(toggleProjectPin(index));
	}

	const projectItemRenderer = (project: Project, key: number) => (
		<React.Fragment key={key}>
			<div className="flex flex-row w-full justify-between">
				<div
					onClick={(e) => onProjectOpen(e, key)}
					onContextMenu={(e) => onContextMenuShow(e, project)}
					className="flex flex-row flex-1 dark:text-white text-sm hover:bg-queenBlueHover hover:shadow-md cursor-pointer py-3">
					<span className="w-4/12 pl-2">{project.name}</span>
					<span className="w-3/12 pl-2">{project.projectType}</span>
					<span className="w-5/12 font-light">
						...{project.src.slice(project.src.length - 30, project.src.length)}
					</span>
				</div>
				<img
					className="hover: transform h-6 my-auto hover:scale-125 cursor-pointer"
					alt="pin"
					onClick={(e) => onProjectPinClick(key)}
					src={project.isPinned ? pinFilled : pin}
				/>
			</div>
		</React.Fragment>
	);

	return (
		<>
			<button
				onClick={(e) => setDisplayDialog(true)}
				className="px-4 py-2 dark:text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg">
				Add new project
			</button>
			<ProjectDialog
				project={currentItem}
				projectIndex={projectIndex}
				type={projectDialogType}
				displayDialog={displayDialog}
				setDisplayDialog={setDisplayDialog}
				clearDefault={clearDefaultDialogType}
			/>

			<div className="flex flex-row mt-5 dark:text-white">
				<span className="w-4/12 pl-2">Name</span>
				<span className="w-3/12 pl-2">Type</span>
				<span className="w-5/12 ">Folder</span>
			</div>
			<hr className="bg-blue-200 h-1 border-0 mt-2 mb-3" />

			<ContextMenu
				model={contextMenuItems}
				ref={contextMenuRef}
				onHide={onItemContextMenuClickHide}></ContextMenu>
			{projects.map((project: Project, key: number) => projectItemRenderer(project, key))}
			{projects.length < 1 && <span className="text-gray-200 ml-3">Project list is empty!</span>}
		</>
	);
}

export default withRouter(ProjectList);
