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
	
	const fillData = new Array<any>(30).fill(		{
		id: 'test',
		HR: 'test',
	}, 0 , 30)

	return (
		<>
			<DataTable
				style={{width: '100%', height: '100%', overflow: 'scroll'}}
				value={fillData}
				editMode="cell"
				className="mt-4"
				resizableColumns 
				columnResizeMode="expand"
				showGridlines 
				reorderableColumns>
				<Column style={{minWwidth: '60px'}} field="id" header="ID" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="ENG" header="ENG" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="HR" header="HR" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="DE" header="DE" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="ITA" header="ITA" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="ITA" header="ITA" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="ITA" header="ITA" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="ITA" header="ITA" editor={(props) => codeEditor('products1', props)}></Column>
				<Column style={{minWwidth: '100px'}} field="ITA" header="ITA" editor={(props) => codeEditor('products1', props)}></Column>
			</DataTable>
			{/* <div className="mt-auto">
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
			</div> */}
		</>
	);
}

export default TranslationEditor;
