import { useCallback, useEffect, useRef, MutableRefObject } from 'react';
import './TranslationEditor.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Language } from '../../../../core/interfaces/LanguageInterface';
import { Translation } from '../../../../core/interfaces/TranslationInterface';
import { ContextMenu } from 'primereact/contextmenu';
import TranslationDialogEnum from '../../../../core/enums/TranslationDialogEnum';
import TranslationDialog from './TranslationDialog';
import { cloneDeep, isEmpty } from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
	setTranslationData,
	setUpdatedIds,
	setSelectedTranslation,
	setShowEditDialog,
	setTranslationDialogType,
	deleteTranslation,
	setExportCsvFlag,
} from '../../../../redux/slices/filesSlice';

function TranslationEditor() {
	const dispatch = useAppDispatch();
	const translationTableRef = useRef() as MutableRefObject<DataTable>;
	const cm = useRef() as MutableRefObject<ContextMenu>;
	const translations = useAppSelector((state) => state.files.translations as Translation);
	const translationData = useAppSelector((state) => state.files.translationData);
	const updatedIds = useAppSelector((state) => state.files.updatedIds);
	const selectedTranslation = useAppSelector((state) => state.files.selectedTranslation);
	const showEditDialog = useAppSelector((state) => state.files.showEditDialog);
	const translationDialogType = useAppSelector((state) => state.files.translationDialogType);
	const exportCsvFlag = useAppSelector((state) => state.files.exportCsv);

	const fillData = useCallback(() => {
		if (!translations) return dispatch(setTranslationData([]));
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
		dispatch(setTranslationData(filledTranslations));
	}, [dispatch, translations]);

	useEffect(() => {
		if (exportCsvFlag) {
			translationTableRef?.current.exportCSV();
			dispatch(setExportCsvFlag(false));
		}
	}, [exportCsvFlag]);

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
				dispatch(setTranslationDialogType(TranslationDialogEnum.add));
				dispatch(setShowEditDialog(true));
			},
		},
		{
			label: 'Edit',
			icon: 'pi pi-fw pi-pencil',
			command: () => {
				dispatch(setTranslationDialogType(TranslationDialogEnum.edit));
				dispatch(setShowEditDialog(true));
			},
		},
		{
			label: 'Delete',
			icon: 'pi pi-fw pi-trash',
			command: () => {
				if (isEmpty(selectedTranslation)) {
					return;
				}
				dispatch(deleteTranslation());
			},
		},
	];

	const renderColumns = languages.map((item) => (
		<Column
			key={item.alpha2}
			style={{ width: '320px' }}
			field={item.alpha2}
			header={`${item.language} (${item.alpha2})`}></Column>
	));

	const onTranslationUpdate = (translation: { [key: string]: String }) => {
		const translations = cloneDeep(translationData);
		if (translationDialogType === TranslationDialogEnum.add) {
			translations.push(translation);
			// @ts-ignore
			dispatch(setUpdatedIds((prev) => [...prev, translation.id]));
		} else {
			translations.forEach((item, index) => {
				if (translation.id === item.id) {
					translations[index] = translation;
					if (!updatedIds.some((x) => x === translation.id)) {
						// @ts-ignore
						dispatch(setUpdatedIds((prev: any[]) => [...prev, translation.id]));
					}
				}
			});
		}
		dispatch(setSelectedTranslation({}));
		dispatch(setTranslationData(translations));
	};

	return (
		<>
			<ContextMenu model={menuModel} ref={cm} onHide={() => dispatch(setSelectedTranslation({}))} />
			<DataTable
				ref={translationTableRef}
				style={{ width: '100%', height: '100%', overflow: 'scroll' }}
				value={translationData}
				selectionMode="single"
				selection={selectedTranslation}
				onContextMenuSelectionChange={(e) => dispatch(setSelectedTranslation(e.value))}
				onContextMenu={(e) => cm.current.show(e.originalEvent)}
				onRowDoubleClick={(e) => {
					dispatch(setTranslationDialogType(TranslationDialogEnum.edit));
					dispatch(setShowEditDialog(true));
				}}
				onSelectionChange={(e) => dispatch(setSelectedTranslation(e.value))}
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
					translation={selectedTranslation}
					type={translationDialogType}
					update={onTranslationUpdate}
					languages={languages}
				/>
			)}
		</>
	);
}

export default TranslationEditor;
