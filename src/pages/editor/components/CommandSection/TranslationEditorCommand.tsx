import React, { useEffect } from 'react';

function TranslationEditorCommand() {
	return (
		<div className="translation-editor-command  pl-3 pt-2">
			<h1 className="mb-3 text-gray-200">Translation editor command</h1>

			<div className="absolute bottom-5 left-15">
				<button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Add ID
				</button>
				<button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Revert all ID instances to text
				</button>
				<button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Import CSV
				</button>
				<button className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Export to CSV
				</button>
			</div>
			<div className="absolute bottom-5 right-5">
				<button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-gray-500 hover:bg-gray-400 rounded-md shadow-md hover:shadow-lg uppercase">
					Cancel
				</button>
				<button className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
					Save
				</button>
			</div>
		</div>
	);
}

export default TranslationEditorCommand;
