import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Project } from '../interfaces/ProjectInterface';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { useForm, Controller } from 'react-hook-form';
import ProjectDialogEnum from '../enums/ProjectDialogEnum';
import languageCodes from '../../utils/language-codes';
import { Language } from '../interfaces/LanguageInterface';
import { Fieldset } from 'primereact/fieldset';
import ProjectType from '../enums/ProjectType';
import { cloneDeep } from 'lodash';
export interface ProjectDialogInterface {
	project: Project;
	type: ProjectDialogEnum;
}

const ProjectDialog = (props: ProjectDialogInterface) => {
	const [displayDialog, setDisplayDialog] = useState(false);
	const [project, setProject] = useState(props.project);
	const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
	const [languageDropdown, setLanguageDropdown] = useState<Language | any>(null);

	let formDefaultValues: Project =
		props.type === ProjectDialogEnum.edit
			? cloneDeep<Project>(props.project)
			: {
					name: '',
					src: '',
					isPinned: false,
					translationFolder: '',
					languages: [],
					projectType: ProjectType[1],
			  };

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
		control,
	} = useForm<Project>({
		defaultValues: { ...formDefaultValues },
	});

	const watchLanguages = watch('languages');
	const watchDefaultLanguages = watch('defaultLanguage');

	useEffect(() => {}, [watchDefaultLanguages]);

	useEffect(() => {
		setFilteredLanguages(languageCodes.sort((a, b) => (a.language < b.language ? -1 : 1)));

		window.electron.on('directory-dialog-return', (event: any, args: any) => {
			if (args === 'canceled') return;

			if (project) {
				args.type === 'source'
					? setProject((prevState) => ({ ...prevState, src: args.source }))
					: setProject((prevState) => ({ ...prevState, translationFolder: args.source }));
			} else {
				args.type === 'source'
					? setProject((prevState) => ({ ...prevState, src: args.source }))
					: setProject((prevState) => ({ ...prevState, translationFolder: args.source }));
			}
		});
		return () => {
			window.electron.removeAllListeners('directory-dialog-return');
		};
	}, [project]);

	function onLanguageChange(e: DropdownChangeParams) {
		setLanguageDropdown(e.value);
	}

	function onAddNewLanguageClick() {
		let languageList = getValues('languages') as Language[];
		languageList.push(languageDropdown);

		if (!getValues('defaultLanguage')) setValue('defaultLanguage', languageDropdown);
		setValue('languages', languageList);
		setFilteredLanguages(
			filteredLanguages.filter(
				(x) => !languageList.some((selectedLanguage) => selectedLanguage.language === x.language)
			)
		);
		setLanguageDropdown(null);
	}

	function onRemoveLanguageClick(language: Language) {
		filteredLanguages.push(language);
		setFilteredLanguages(filteredLanguages.sort((a, b) => (a.language < b.language ? -1 : 1)));
		let languageList = getValues('languages') as Language[];
		setValue(
			'languages',
			languageList.filter((x) => x !== language)
		);
		if (watchDefaultLanguages === language) {
			const newDefaultLanguage =
				getValues('languages').length > 0 ? getValues('languages')[0] : ({} as Language);
			setValue('defaultLanguage', newDefaultLanguage);
		}
		setLanguageDropdown({});
	}

	function onAddNewButtonClick() {
		setDisplayDialog(true);
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

	const isDefaultLanguageCheckboxCheck = (language: Language): boolean => {
		return getValues('defaultLanguage') === language;
	};

	const onHideDialog = () => {
		setDisplayDialog(false);
	};

	const onConfirmDialog = () => {
		setDisplayDialog(false);
	};

	const renderDialogAddNewFooter = () => {
		return (
			<div>
				<button
					onClick={() => onHideDialog()}
					className="px-4 py-2 bg-indigo-700 text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-sm">
					Cancel
				</button>
				<button
					onClick={() => onConfirmDialog()}
					disabled={true}
					className={`px-4 py-2  text-white rounded-md shadow-md hover:shadow-sm ${
						true ? 'bg-indigo-400' : 'bg-indigo-700 hover:bg-indigo-600'
					}`}>
					Add
				</button>
			</div>
		);
	};

	return (
		<>
			<button
				onClick={onAddNewButtonClick}
				className="px-4 py-2 bg-indigo-700 dark:text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-lg">
				{props.type === ProjectDialogEnum.add ? 'Add new project' : 'Project settings'}
			</button>
			<Dialog
				header="Add new project"
				visible={displayDialog}
				style={{ width: '90vw' }}
				draggable={false}
				footer={renderDialogAddNewFooter()}
				onHide={() => onHideDialog()}>
				<div className="flex d-col">
					<div className="flex flex-col">
						<label htmlFor="projectName">Name:</label>
						<InputText className="mr-3 w-72 h-10 my-2" id="projectName" value={project?.name} />
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
						<span className="mx-3 font-semibold">{project?.src}</span>
						<button
							onClick={onSourceFolderButtonClick}
							className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-md shadow-md hover:shadow-sm ">
							{props.type === ProjectDialogEnum.add && !project ? 'Add' : 'Update'} source folder
						</button>
					</div>
				</div>
				<div className="flex flex-col mt-5">
					<label htmlFor="folderSrc">Translations folder:</label>
					<div className="flex items-center mt-2">
						<span className="mx-3 font-semibold">{project?.translationFolder}</span>
						<button
							onClick={onTranslationsFolderButtonClick}
							className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-md shadow-md hover:shadow-sm ">
							{props.type === ProjectDialogEnum.add && !project ? 'Add' : 'Update'} translation
							folder
						</button>
					</div>
				</div>
				<Fieldset className="mt-5" legend="Languages">
					{watchLanguages.length > 0 && (
						<>
							<div className="flex items-center min-w-max px-2">
								<div className="w-4/12 font-semibold">Name</div>
								<div className="w-3/12 font-semibold">Alpha2</div>
								<div className="w-2/12 font-semibold">Default</div>
								<div className="w-3/12 font-semibold">Command</div>
							</div>
						</>
					)}
					{watchLanguages &&
						watchLanguages.map((item, key) => {
							return (
								<div
									className="flex items-center bg-gray-200 px-2 py-3 min-w-max mb-1 border-b-2 border-t-2 border-gray-300"
									key={key}>
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
										className="w-3/12 px-2 py-1 text-white rounded-md shadow-md hover:shadow-sm  bg-red-500 hover:bg-red-400">
										Remove
									</button>
								</div>
							);
						})}

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
							}`}>
							Add language
						</button>
					</div>
				</Fieldset>
			</Dialog>
		</>
	);
};

export default ProjectDialog;
