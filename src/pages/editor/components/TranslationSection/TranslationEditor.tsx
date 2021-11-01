import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

function TranslationEditor() {
	const inputTextEditor = (productKey: any, props: { rowData: { [x: string]: any; }; }, field: string) => {
        return <InputText type="text" value={props.rowData[field]} onChange={(e: { target: { value: any; }; }) => onEditorValueChange(productKey, props, e.target.value)} />;
    }

    const codeEditor = (productKey: any, props: any) => {
        return inputTextEditor(productKey, props, 'code');
    }
	const onEditorValueChange = (productKey: any, props: { rowData?: { [x: string]: any; }; value?: any; rowIndex?: any; field?: any; }, value: any) => {
        let updatedProducts = [...props.value];
        updatedProducts[props.rowIndex][props.field] = value;
    }
	
	return (
		<>
			<DataTable
				value={[
					{
						id: 'test',
						ENG: 'test',
						HR: 'test',
					},
					{
						id: 'test',
						ENG: 'test',
						HR: 'test',
					},
					{
						id: 'test',
						ENG: 'test',
						HR: 'test',
					},
					{
						id: 'test',
						ENG: 'test',
						HR: 'test',
					},
					{
						id: 'test',
						ENG: 'test',
						HR: 'test',
					},
				]}
				editMode="cell"
				className="w-80 mt-4"
				reorderableColumns>
				<Column field="id" header="ID" editor={(props) => codeEditor('products1', props)}></Column>
				<Column field="ENG" header="ENG" editor={(props) => codeEditor('products1', props)}></Column>
				<Column field="HR" header="HR" editor={(props) => codeEditor('products1', props)}></Column>
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
