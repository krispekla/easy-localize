import React, { useState } from 'react';
import ProjectDialog from '../../../core/components/ProjectDialog';
import ProjectDialogEnum from '../../../core/enums/ProjectDialogEnum';
import { Project } from '../../../core/interfaces/ProjectInterface';

function ProjectInfo() {
	const [displayDialog, setDisplayDialog] = useState(false);
	const [projectIndex, setProjectIndex] = useState<number>(-1);
	const [currentItem, setCurrentItem] = useState<Project>();
	
	return (
		<section className="flex">
			<div className="flex flex-col">
				<span className="text-xs text-gray-300">project name:</span>
				<span className="text-white">Random-project-x</span>
			</div>
			<div className="flex flex-col ml-8">
				<span className="text-xs text-gray-300">project type:</span>
				<span className="text-white">Vue.js</span>
			</div>
			<div className="flex flex-col ml-8">
				<span className="text-xs text-gray-300">project folder:</span>
				<span className="text-xs text-white mt-1 w-72">/Users/USERNAME/repos/random-project-x</span>
			</div>
			<button
				onClick={(e) => setDisplayDialog(true)}
				className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
				Project configuration
			</button>
			{/* <ProjectDialog
				project={currentItem}
				projectIndex={projectIndex}
				type={ProjectDialogEnum.edit}
				displayDialog={displayDialog}
				setDisplayDialog={setDisplayDialog}
				clearDefault={clearDefaultDialogType}
			/> */}
		</section>
	);
}

export default ProjectInfo;
