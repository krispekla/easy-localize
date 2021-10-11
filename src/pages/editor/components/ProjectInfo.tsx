import React, { useState } from 'react';
import ProjectDialog from '../../../core/components/ProjectDialog';
import ProjectDialogEnum from '../../../core/enums/ProjectDialogEnum';
import { Project } from '../../../core/interfaces/ProjectInterface';
import { useAppSelector } from '../../../redux/hooks';

function ProjectInfo() {
	const [projectConfigurationDialog, setProjectConfigurationDialog] = useState(false);
	const currentProject: Project = useAppSelector(
		(state) => state.settings.projects[state.settings.currentProject]
	);

	const currentProjectIndex: number = useAppSelector((state) => state.settings.currentProject);

	return (
		<section className="flex">
			<div className="flex flex-col">
				<span className="text-xs text-gray-300">project name:</span>
				<span className="text-white">{currentProject.name}</span>
			</div>
			<div className="flex flex-col ml-8">
				<span className="text-xs text-gray-300">project type:</span>
				<span className="text-white">{currentProject.projectType}</span>
			</div>
			<div className="flex flex-col ml-8">
				<span className="text-xs text-gray-300">project folder:</span>
				<span className="text-xs text-white mt-1 w-72">
					{currentProject.src.slice(currentProject.src.length - 30, currentProject.src.length)}
				</span>
			</div>
			<button
				onClick={(e) => setProjectConfigurationDialog(true)}
				className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
				Project configuration
			</button>
			<ProjectDialog
				project={currentProject}
				projectIndex={currentProjectIndex}
				type={ProjectDialogEnum.edit}
				displayDialog={projectConfigurationDialog}
				setDisplayDialog={setProjectConfigurationDialog}
				clearDefault={null}
			/>
		</section>
	);
}

export default ProjectInfo;
