import React, { useCallback, useEffect, useRef, useState, MutableRefObject } from 'react';
import './TranslationEditor.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useAppSelector } from '../../../../redux/hooks';
import { Language } from '../../../../core/interfaces/LanguageInterface';
import { Translation } from '../../../../core/interfaces/TranslationInterface';
import { ContextMenu } from 'primereact/contextmenu';
import { Button } from 'primereact/button';
import TranslationDialogEnum from '../../../../core/enums/TranslationDialogEnum';
import TranslationDialog from './TranslationDialog';

function TranslationEditor() {
	const translationTableRef = useRef() as MutableRefObject<DataTable>;
	const cm = useRef() as MutableRefObject<ContextMenu>;
	const [translationData, setTranslationData] = useState<any[]>([]);
	const [selectedTranslation, setSelectedTranslation] = useState(null);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const translations: Translation = useAppSelector(
		(state) => state.files.translations as Translation
	);
	const [translationDialogType, setTranslationDialogType] = useState<TranslationDialogEnum>(
		TranslationDialogEnum.add
	);
	const fillData = useCallback(() => {
		if (!translations) return setTranslationData([]);
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
	const menuModel = [
		{
			label: 'Add',
			icon: 'pi pi-fw pi-plus',
			command: () => {
				// return viewProduct(selectedProduct)
			},
		},
		{
			label: 'Edit',
			icon: 'pi pi-fw pi-pencil',
			command: () => {
				// return viewProduct(selectedProduct)
			},
		},
		{
			label: 'Delete',
			icon: 'pi pi-fw pi-trash',
			command: () => {
				// return deleteProduct(selectedProduct)
			},
		},
	];

	// const viewProduct = (product) => {
	// 	toast.current.show({ severity: 'info', summary: 'Product Selected', detail: product.name });
	// };

	// const deleteProduct = (product) => {
	// 	let _products = [...products];
	// 	_products = _products.filter((p) => p.id !== product.id);

	// 	toast.current.show({ severity: 'error', summary: 'Product Deleted', detail: product.name });
	// 	setProducts(_products);
	// };

	const renderColumns = languages.map((item) => (
		<Column
			key={item.alpha2}
			style={{ width: '320px' }}
			field={item.alpha2}
			header={`${item.language} (${item.alpha2})`}></Column>
	));
	// const exportCSV = () => {
	// 	translationTableRef.current.exportCSV();
	// };
	const hideEditDialog = () => {
		setShowEditDialog(false);
	};

	return (
		<>
			<ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedTranslation(null)} />
			<DataTable
				ref={translationTableRef}
				style={{ width: '100%', height: '100%', overflow: 'scroll' }}
				value={translationData}
				selectionMode="single"
				selection={selectedTranslation}
				onContextMenuSelectionChange={(e) => setSelectedTranslation(e.value)}
				onContextMenu={(e) => cm.current.show(e.originalEvent)}
				onRowDoubleClick={(e) => setShowEditDialog(true)}
				onSelectionChange={(e) => setSelectedTranslation(e.value)}
				className="mt-0"
				resizableColumns
				scrollable
				scrollHeight="600px"
				virtualScrollerOptions={{ itemSize: 20 }}
				columnResizeMode="expand"
				showGridlines
				reorderableColumns>
				<Column style={{ width: '320px' }} field="id" header="ID" />
				{renderColumns}
			</DataTable>
			{showEditDialog && (
				<TranslationDialog
					displayDialog={showEditDialog}
					setDisplayDialog={setShowEditDialog}
					translation={selectedTranslation}
					type={translationDialogType}
				/>
			)}
		</>
	);
}

export default TranslationEditor;
