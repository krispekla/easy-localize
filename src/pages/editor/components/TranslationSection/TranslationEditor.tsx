import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useAppSelector } from '../../../../redux/hooks';
import { Language } from '../../../../core/interfaces/LanguageInterface';
import { Translation } from '../../../../core/interfaces/TranslationInterface';

function TranslationEditor() {
	const inputTextEditor = (
		productKey: any,
		props: { rowData: { [x: string]: any } },
		field: string
	) => {
		return (
			<InputText
				type="text"
				value={props.rowData[field]}
				onChange={(e: { target: { value: any } }) =>
					onEditorValueChange(productKey, props, e.target.value)
				}
			/>
		);
	};

	const codeEditor = (productKey: any, props: any) => {
		return inputTextEditor(productKey, props, props.field);
	};
	const onEditorValueChange = (
		productKey: any,
		props: { rowData?: { [x: string]: any }; value?: any; rowIndex?: any; field?: any },
		value: any
	) => {
		let updatedProducts = [...props.value];
		updatedProducts[props.rowIndex][props.field] = value;
	};

	const [translationData, setTranslationData] = useState<any[]>([]);
	const translations: Translation = useAppSelector(
		(state) => state.files.translations as Translation
	);

	const fillData = useCallback(() => {
		if (!translations) {
			return [];
		}

		const filledTranslations = [];
		for (const [key, value] of Object.entries(translations)) {
			const temp: { [key: string]: String } = {
				id: key,
			};
			for (const [lng, translation] of Object.entries(value)) {
				temp[lng] = translation;
			}
			filledTranslations.push(temp);
		}
		setTranslationData(filledTranslations);
	}, [translations]);

	useEffect(() => {
		fillData();
	}, [fillData]);

	const languages: Language[] = useAppSelector((state) => {
		const languages = [...state.settings.projects[state.settings.currentProject].languages];
		const defaultLanguage = state.settings.projects[state.settings.currentProject].defaultLanguage;
		if (!languages) {
			return [];
		}
		return languages.sort((a) => (a.alpha2 !== defaultLanguage?.alpha2 ? 1 : -1));
	});

	const renderColumns = languages.map((item) => (
		<Column
			key={item.alpha2}
			style={{ width: '320px' }}
			field={item.alpha2}
			header={`${item.language} (${item.alpha2})`}
			editor={(props) => codeEditor(item.alpha2, props)}></Column>
	));

	return (
		<>
			<DataTable
				style={{ width: '100%', height: '100%', overflow: 'scroll' }}
				value={translationData}
				editMode="cell"
				className="	mt-0"
				resizableColumns
				scrollable
				scrollHeight="600px"
				virtualScrollerOptions={{ itemSize: 46 }}
				columnResizeMode="expand"
				showGridlines
				reorderableColumns>
				<Column
					style={{ width: '320px' }}
					field="id"
					header="ID"
					editor={(props) => codeEditor('products1', props)}></Column>
				{renderColumns}
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
