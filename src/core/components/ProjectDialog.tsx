import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { Fieldset } from 'primereact/fieldset';
import { cloneDeep } from 'lodash';
import ProjectDialogEnum from '../enums/ProjectDialogEnum';
import languageCodes from '../../utils/language-codes';
import { Language } from '../interfaces/LanguageInterface';
import ProjectType from '../enums/ProjectType';
import { Project } from '../interfaces/ProjectInterface';
import { addProject, updateProject } from '../../redux/slices/settingsSlice';
import { useAppDispatch } from '../../redux/hooks';

export interface ProjectDialogInterface {
  project?: Project;
  type: ProjectDialogEnum;
  displayDialog: boolean;
  setDisplayDialog: any;
  projectIndex: number;
  clearDefault: any | undefined;
}

function ProjectDialog(props: ProjectDialogInterface) {
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [languageDropdown, setLanguageDropdown] = useState<Language | any>(null);

  const formDefaultValues: Project =
    props.type === ProjectDialogEnum.edit && props.project
      ? cloneDeep<Project>(props.project)
      : {
          name: '',
          src: '',
          isPinned: false,
          translationFolder: '',
          languages: [],
          defaultLanguage: null,
          projectType: ProjectType[1],
          excludedFolders: []
        };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    control,
    reset
  } = useForm<Project>({
    defaultValues: { ...formDefaultValues }
  });

  const dispatch = useAppDispatch();
  const watchProjectSource = watch('src');
  const watchTranslationFolderSource = watch('translationFolder');
  const watchLanguages = watch('languages');
  const watchDefaultLanguages = watch('defaultLanguage');

  useEffect(() => {}, [watchDefaultLanguages]);
  useEffect(() => {
    if (props.project && props.type === ProjectDialogEnum.edit)
      reset(cloneDeep<Project>(props.project));
  }, [props.project, props.type, reset]);

  useEffect(() => {
    setFilteredLanguages(languageCodes.sort((a, b) => (a.language < b.language ? -1 : 1)));

    window.electron.on('directory-dialog-return', (event: any, args: any) => {
      if (args === 'canceled') return;

      args.type === 'source'
        ? setValue('src', args.source)
        : setValue('translationFolder', args.source);

      trigger(['src', 'translationFolder']);
    });
    return () => {
      window.electron.removeAllListeners('directory-dialog-return');
    };
  }, [setValue, trigger]);

  function onLanguageChange(e: DropdownChangeParams) {
    setLanguageDropdown(e.value);
  }

  function onAddNewLanguageClick() {
    const languageList = getValues('languages') as Language[];
    languageList.push(languageDropdown);

    if (!getValues('defaultLanguage')) setValue('defaultLanguage', languageDropdown);
    setValue('languages', languageList);
    setFilteredLanguages(
      filteredLanguages.filter(
        (x) => !languageList.some((selectedLanguage) => selectedLanguage.language === x.language)
      )
    );
    setLanguageDropdown(null);
    trigger(['languages', 'defaultLanguage']);
  }

  function onRemoveLanguageClick(language: Language) {
    filteredLanguages.push(language);
    setFilteredLanguages(filteredLanguages.sort((a, b) => (a.language < b.language ? -1 : 1)));
    const languageList = getValues('languages') as Language[];
    setValue(
      'languages',
      languageList.filter((x) => x !== language)
    );

    if (watchDefaultLanguages === language) {
      getValues('languages').length > 0
        ? setValue('defaultLanguage', getValues('languages')[0])
        : setValue('defaultLanguage', undefined);
    }
    setLanguageDropdown(null);
    trigger(['languages', 'defaultLanguage']);
  }

  function onSourceFolderButtonClick(e: { preventDefault: () => void }) {
    e.preventDefault();

    window.electron.send('directory-dialog', 'source');
  }
  function onTranslationsFolderButtonClick(e: { preventDefault: () => void }) {
    e.preventDefault();

    window.electron.send('directory-dialog', 'translation');
  }

  function onChangeDefaultLanguageCheckboxClick(language: Language) {
    setValue('defaultLanguage', language);
  }

  function resetState() {
    reset(cloneDeep(formDefaultValues));
    setFilteredLanguages(languageCodes.sort((a, b) => (a.language < b.language ? -1 : 1)));
    setLanguageDropdown(null);
  }

  const isDefaultLanguageCheckboxCheck = (language: Language): boolean => {
    return getValues('defaultLanguage')?.language === language.language;
  };

  const onHideDialog = () => {
    resetState();
    if (props.clearDefault) props.clearDefault();

    props.setDisplayDialog(false);
  };

  const onConfirmDialog = (data: any) => {
    if (props.type === ProjectDialogEnum.add) dispatch(addProject(data));
    else if (props.type === ProjectDialogEnum.edit && props.projectIndex >= 0)
      dispatch(updateProject({ project: data, index: props.projectIndex }));

    resetState();
    props.setDisplayDialog(false);
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
          onClick={handleSubmit(onConfirmDialog)}
          disabled={false}
          className={`px-4 py-2  text-white rounded-md shadow-md hover:shadow-sm ${
            false ? 'bg-indigo-400' : 'bg-indigo-700 hover:bg-indigo-600'
          }`}
        >
          {props.type === ProjectDialogEnum.add ? 'Add new project' : 'Update project'}
        </button>
      </div>
    );
  };

  return (
    <Dialog
      header={`${props.type === ProjectDialogEnum.add ? 'Add new' : 'Update'} project`}
      visible={props.displayDialog}
      style={{ width: '90vw' }}
      draggable={false}
      footer={renderDialogAddNewFooter()}
      onHide={() => onHideDialog()}
    >
      <div className="flex d-col">
        <div className="flex flex-col">
          <label htmlFor="projectName">Name:</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Project name is required.' }}
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
          {errors.name && <small className="p-error">{errors.name.message}</small>}
        </div>
        <div className="flex flex-col mx-3">
          <label htmlFor="folderSrc font-weight-bold">Type</label>
          <div className="flex mt-2">
            <Controller
              name="projectType"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Dropdown
                  {...field}
                  id="projectTypeDropdown"
                  value={field.value}
                  className="mr-3 w-52 h-10"
                  placeholder="Select project type"
                  options={Object.values(ProjectType).filter((x) => typeof x === 'string')}
                  optionDisabled={(x) => {
                    return x !== ProjectType[1] && x !== ProjectType[3];
                  }}
                  onChange={(e) => setValue('projectType', e.value)}
                />
              )}
            />
            {errors.projectType && <small className="p-error">{errors.projectType.message}</small>}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="folderSrc font-weight-bold">Pinned?</label>
          <div className="flex mt-2">
            <Controller
              name="isPinned"
              control={control}
              render={({ field, fieldState }) => (
                <Checkbox
                  inputId={field.name}
                  onChange={(e) => field.onChange(e.checked)}
                  checked={field.value}
                  className="mt-2 mx-auto"
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="folderSrc">Source folder:</label>
        <div className="flex items-center mt-2">
          <span
            {...register('src', { required: 'Project folder is required' })}
            className={`${watchProjectSource && 'mx-3'} font-semibold`}
          >
            {watchProjectSource}
          </span>

          <button
            onClick={onSourceFolderButtonClick}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-md shadow-md hover:shadow-sm "
          >
            {props.type === ProjectDialogEnum.add && !watchProjectSource ? 'Add' : 'Update'} source
            folder
          </button>
        </div>
        {errors.src && <small className="p-error">{errors.src.message}</small>}
      </div>
      <div className="flex flex-col mt-5">
        <label htmlFor="folderSrc">Translations folder:</label>
        <div className="flex items-center mt-2">
          <span
            {...register('translationFolder', {
              required: 'Translation folder is required'
            })}
            className={`${watchTranslationFolderSource && 'mx-3'} font-semibold`}
          >
            {watchTranslationFolderSource}
          </span>

          <button
            onClick={onTranslationsFolderButtonClick}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-md shadow-md hover:shadow-sm "
          >
            {props.type === ProjectDialogEnum.add && !watchTranslationFolderSource
              ? 'Add'
              : 'Update'}{' '}
            translation folder
          </button>
        </div>
        {errors.translationFolder && (
          <small className="p-error">{errors.translationFolder.message}</small>
        )}
      </div>
      <Fieldset
        {...register('languages', {
          required: 'Setting languages is required'
        })}
        {...register('defaultLanguage', {
          required: 'Setting default languages is required'
        })}
        className="mt-5"
        legend="Languages"
      >
        {watchLanguages.length > 0 && (
          <div className="flex items-center min-w-max px-2">
            <div className="w-4/12 font-semibold">Name</div>
            <div className="w-3/12 font-semibold">Alpha2</div>
            <div className="w-2/12 font-semibold">Default</div>
            <div className="w-3/12 font-semibold">Command</div>
          </div>
        )}
        {watchLanguages &&
          watchLanguages.map((item, key) => {
            return (
              <div
                className="flex items-center bg-gray-200 px-2 py-3 min-w-max mb-1 border-b-2 border-t-2 border-gray-300"
                key={key}
              >
                <div className="w-4/12">{item.language}</div>
                <div className="w-3/12">{item.alpha2}</div>
                <div className="w-2/12">
                  <Checkbox
                    inputId={item.alpha3}
                    onChange={(e) => onChangeDefaultLanguageCheckboxClick(item)}
                    checked={isDefaultLanguageCheckboxCheck(item)}
                  />
                </div>
                <button
                  onClick={(e) => onRemoveLanguageClick(item)}
                  className="w-20 px-2 py-1 text-sm text-white rounded-md shadow-md hover:shadow-sm  bg-red-500 hover:bg-red-400"
                >
                  Remove
                </button>
              </div>
            );
          })}
        <div className="flex flex-col">
          {errors.languages && <small className="p-error">Setting languages is required</small>}
          {errors.defaultLanguage && (
            <small className="p-error">Setting default language is required</small>
          )}
        </div>
        <hr className="mt-5 mb-2 border-2 border-gray-200" />
        <div className="font-semibold">Add new language</div>
        <div className="flex mt-2">
          <Dropdown
            id="languageDropdown"
            value={languageDropdown}
            key="language"
            className="mr-3 w-72"
            placeholder="Select language"
            options={filteredLanguages}
            optionLabel="language"
            onChange={onLanguageChange}
          />
          <button
            onClick={onAddNewLanguageClick}
            disabled={!languageDropdown}
            className={`px-4 py-2 text-white rounded-md shadow-md hover:shadow-sm ${
              !languageDropdown ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            Add language
          </button>
        </div>
      </Fieldset>
    </Dialog>
  );
}

export default ProjectDialog;
