import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  setShowEditDialog,
  setTranslationDialogType,
  deleteTranslation,
  setExportCsvFlag,
  saveTranslations,
  resetTranslationData
} from '../../../../redux/slices/filesSlice';
import { isEmpty } from 'lodash';
import TranslationDialogEnum from '../../../../core/enums/TranslationDialogEnum';
import { Toast } from 'primereact/toast';
import { MutableRefObject, useRef } from 'react';

function TranslationEditorCommand() {
  const toast = useRef() as MutableRefObject<Toast>;
  const dispatch = useAppDispatch();
  const selectedTranslation = useAppSelector((state) => state.files.selectedTranslation);
  const translationFolder: string =
    useAppSelector(
      (state) => state.settings.projects[state.settings.currentProject].translationFolder
    ) || '';
  function onEditHandler() {
    if (isEmpty(selectedTranslation)) {
      return;
    }
    dispatch(setTranslationDialogType(TranslationDialogEnum.edit));
    dispatch(setShowEditDialog(true));
  }
  function onAddHandler() {
    dispatch(setTranslationDialogType(TranslationDialogEnum.add));
    dispatch(setShowEditDialog(true));
  }

  function onDeleteHandler() {
    if (isEmpty(selectedTranslation)) {
      return;
    }
    dispatch(deleteTranslation());
  }
  function onExportCSVHandler() {
    dispatch(setExportCsvFlag(true));
  }
  function saveHandler() {
    dispatch(saveTranslations(translationFolder));
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Translations has been successfully written',
      life: 30000
    });
  }

  return (
    <div className="translation-editor-command  pl-3 pt-2">
      <h1 className="mb-3 text-gray-200">Commands</h1>
      <div className="flex justify-end">
        <button
          disabled={isEmpty(selectedTranslation)}
          className={`mt-1 mr-5 px-3 h-10 text-sm text-white rounded-md shadow-md hover:shadow-lg uppercase
					${isEmpty(selectedTranslation) ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-500'}`}
          onClick={() => onDeleteHandler()}
        >
          Delete translation
        </button>
        <button
          disabled={isEmpty(selectedTranslation)}
          className={`mt-1 mr-5 px-3 h-10 text-sm text-white  rounded-md shadow-md hover:shadow-lg uppercase
					${isEmpty(selectedTranslation) ? 'bg-gray-400' : 'bg-queenBlue hover:bg-queenBlueHover'}`}
          onClick={() => onEditHandler()}
        >
          Edit translation
        </button>
        <button
          className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase"
          onClick={() => onAddHandler()}
        >
          Add new
        </button>
      </div>
      <div className="absolute bottom-5 left-15">
        <button className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase">
          Revert all ID instances to text
        </button>
        <button
          disabled
          className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-gray-500 rounded-md  uppercase"
        >
          Import CSV
        </button>
        <button
          className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase"
          onClick={() => onExportCSVHandler()}
        >
          Export to CSV
        </button>
      </div>
      <div className="absolute bottom-5 right-5">
        <button
          className="mt-1 mr-5 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase"
          onClick={(e) => dispatch(resetTranslationData())}
        >
          Reset changes
        </button>
        <button
          className="mt-1 px-3 h-10 text-sm text-white bg-queenBlue hover:bg-queenBlueHover rounded-md shadow-md hover:shadow-lg uppercase"
          onClick={(e) => saveHandler()}
        >
          Save changes
        </button>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default TranslationEditorCommand;
