import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TranslationDialogEnum from '../../../../core/enums/TranslationDialogEnum';
import { useAppDispatch } from '../../../../redux/hooks';
import { setShowEditDialog } from '../../../../redux/slices/filesSlice';
import googleTranslateIcon from '../../../../assets/icons/google-translate-icon.svg';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';

export interface TranslationDialogInterface {
  translation: {};
  type: TranslationDialogEnum;
  displayDialog: boolean;
  update: Function;
  languages: Array<{}>;
}

export type Translation = {
  id: string;
  translation: object;
};

const TranslationDialog = (props: TranslationDialogInterface) => {
  const dispatch = useAppDispatch();
  const [activeTranslation, setActiveTranslation] = useState('');
  const setTranslationAsArrayAndCopy = (translation: any) => {
    const proccessedTranslation = [];
    for (const [key, value] of Object.entries(translation)) {
      if (key === 'id') continue;
      proccessedTranslation.push({
        name: key,
        value: value
      });
    }
    return proccessedTranslation;
  };
  const apiKey: string = useAppSelector((state) => state.settings.googleApiKey);

  const setId = (translation: { [key: string]: String }) => translation.id;
  const getLanguages = (translation: Array<{}>) => {
    return translation.map((x: any) => {
      return {
        name: x.alpha2,
        value: ''
      };
    });
  };
  const defaultLanguage: string = useAppSelector(
    (state) =>
      state.settings.projects[state.settings.currentProject].defaultLanguage?.alpha2 || 'en'
  );

  useEffect(() => {
    if (window.electron) {
      window.electron.on('get-translation-return', (event: any, translation: any) => {
        setValue(activeTranslation, translation);
      });
    }
    return () => {
      window.electron.removeAllListeners('get-translation-return');
    };
  }, [activeTranslation]);

  let formDefaultValues: any =
    props.type === TranslationDialogEnum.edit && props.translation
      ? {
          id: setId(props.translation),
          translation: setTranslationAsArrayAndCopy(props.translation)
        }
      : {
          id: '',
          translation: getLanguages(props.languages)
        };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<any>({
    defaultValues: { ...formDefaultValues }
  });
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'translation' // unique name for your Field Array
  });

  function resetState() {
    // TODO Dohvati sve jezike
    // reset(cloneDeep(formDefaultValues));
    // Settaj sva polja
  }

  const onHideDialog = () => {
    resetState();
    dispatch(setShowEditDialog(false));
  };

  async function onTranslateClickHandler(target: any, translationArrayId: string) {
    const translations = getValues('translation');
    const translation = translations.find(
      (x: { name: string }) => x.name === defaultLanguage
    ).value;
    setActiveTranslation(translationArrayId);
    if (window.electron) {
      window.electron.send('get-translation', {
        text: translation,
        source: defaultLanguage,
        target: target,
        key: apiKey
      });
    }
  }

  const onConfirmDialog = (data: any) => {
    if (props.type === TranslationDialogEnum.add) {
      //    Izvrsi proslijedeni callback u parentu
    } else if (props.type === TranslationDialogEnum.edit) {
      //    Izvrsi proslijedeni callback u parentu
    }
    const prepareTranslationForUpdate: { [key: string]: String } = {
      id: data.id
    };
    for (const item of Object.values(data.translation)) {
      // @ts-ignore
      prepareTranslationForUpdate[item.name] = item.value;
    }
    resetState();
    dispatch(setShowEditDialog(false));
    props.update(prepareTranslationForUpdate);
  };

  const renderDialogAddNewFooter = () => {
    return (
      <div>
        <button
          onClick={() => onHideDialog()}
          className="px-4 py-2 bg-indigo-700 text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => onHideDialog()}
          className="px-4 py-2 bg-indigo-700 text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-sm"
        >
          Reset value
        </button>
        <button
          onClick={handleSubmit(onConfirmDialog)}
          disabled={false}
          className={`px-4 py-2  text-white rounded-md shadow-md hover:shadow-sm ${
            false ? 'bg-indigo-400' : 'bg-indigo-700 hover:bg-indigo-600'
          }`}
        >
          {props.type === TranslationDialogEnum.add ? 'Add new translation' : 'Update translation'}
        </button>
      </div>
    );
  };
  return (
    <>
      <Dialog
        visible={props.displayDialog}
        header={`${props.type === TranslationDialogEnum.add ? 'Add new' : 'Update'} translation`}
        draggable={false}
        footer={renderDialogAddNewFooter()}
        onHide={() => onHideDialog()}
      >
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <label htmlFor="projectName" className="mr-3">
              ID:
            </label>
            <Controller
              name="id"
              control={control}
              rules={{ required: 'Id is required' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  autoFocus
                  value={field.value}
                  className={`mr-3 w-72 h-10 my-2 ${
                    fieldState.invalid && fieldState.isTouched && 'border-red-400'
                  }`}
                />
              )}
            />
          </div>
          {errors['id'] && <small className="p-error ml-8">{errors['id'].message}</small>}
        </div>
        {fields.map((item: any, index) => {
          return (
            <div className="flex flex-col" key={item.id}>
              <div className="flex flex-row items-center">
                <Controller
                  name={`translation.${index}.value`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor="projectName" className="mr-3">
                        {item.name.toUpperCase()}:
                      </label>
                      <InputText
                        id={field.name}
                        {...field}
                        autoFocus
                        value={field.value}
                        className={`mr-3 w-72 h-10 my-2 ${
                          fieldState.invalid && fieldState.isTouched && 'border-red-400'
                        }`}
                      />
                      <img
                        className="h-5 my-auto cursor-pointer"
                        alt=""
                        src={googleTranslateIcon}
                        onClick={(e) => onTranslateClickHandler(item.name, field.name)}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          );
        })}
      </Dialog>
    </>
  );
};

export default TranslationDialog;
