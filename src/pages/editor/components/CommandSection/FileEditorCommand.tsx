import React, { useEffect } from 'react';

function FileEditorCommand() {
	return (
		<div className="file-editor-command  pl-3 pt-2">
			<h1 className="mb-3 text-gray-200">File editor command</h1>
			<div className="absolute bottom-15 right-5">
				<button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Revert to Text
				</button>
				<button className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Edit ID
				</button>
				<button className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Add new translation
				</button>
			</div>
			<div className="absolute bottom-5 right-5">
				<button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-gray-500 hover:bg-gray-400 rounded-md shadow-md hover:shadow-lg uppercase">
					Cancel
				</button>
				<button className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Save file
				</button>
			</div>
		</div>
	);
}

export default FileEditorCommand;
