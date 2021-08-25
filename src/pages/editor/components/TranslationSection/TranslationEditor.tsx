import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function TranslationEditor() {
	return (
		<>
			<DataTable editMode="cell" className="w-80 mt-4">
				<Column field="id" header="ID"></Column>
				<Column field="ENG" header="ENG"></Column>
				<Column field="HR" header="HR"></Column>
			</DataTable>
			<div className="mt-auto">
				<div className="flex justify-between">
					<button className="px-2 h-8 text-xs text-gray-900  bg-gray-300 hover:bg-gray-200 rounded-md shadow-md hover:shadow-lg w-36">
						Add New Translation
					</button>
					<button className="px-2 h-8 ml-auto mr-2 text-xs text-gray-900  bg-gray-300 hover:bg-gray-200 rounded-md shadow-md hover:shadow-lg w-20">
						Cancel
					</button>
					<button className="px-2 h-8 text-xs text-gray-900  bg-gray-300 hover:bg-gray-200 rounded-md shadow-md hover:shadow-lg w-20">
						Save
					</button>
				</div>
			</div>
		</>
	);
}

export default TranslationEditor;
