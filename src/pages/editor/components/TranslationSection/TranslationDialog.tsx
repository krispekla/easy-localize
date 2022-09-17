import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { cloneDeep } from 'lodash';
import { addProject, updateProject } from '../../../../redux/slices/settingsSlice';
import { useAppDispatch } from '../../../../redux/hooks';
import TranslationDialogEnum from '../../../../core/enums/TranslationDialogEnum';

export interface TranslationDialogInterface {
	translation: any;
	type: TranslationDialogEnum;
	displayDialog: boolean;
	setDisplayDialog: any;
}

export type Translation = {
	id: string;

	name: string;
	src: string;
	isPinned: boolean;
	translationFolder?: string;
};

const TranslationDialog = (props: TranslationDialogInterface) => {
	// let formDefaultValues: Project =
	// 	props.type === ProjectDialogEnum.edit && props.project
	// 		? cloneDeep<Project>(props.project)
	// 		: {
	// 				name: '',
	// 				src: '',
	// 				isPinned: false,
	// 				translationFolder: '',
	// 				languages: [],
	// 				defaultLanguage: null,
	// 				projectType: ProjectType[1],
	// 				excludedFolders: [],
	// 		  };

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		trigger,
		formState: { errors },
		control,
		reset,
	} = useForm<any>({
		defaultValues: { test: [] },
	});

	const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray<any>({
		control,
		name: 'test',
	});

	const dispatch = useAppDispatch();
	useEffect(() => {}, []);

	function resetState() {
		// TODO Dohvati sve jezike
		// reset(cloneDeep(formDefaultValues));
		// Settaj sva polja
	}

	const onHideDialog = () => {
		resetState();
		props.setDisplayDialog(false);
	};

	const onConfirmDialog = (data: any) => {
		if (props.type === TranslationDialogEnum.add) {
			//    Izvrsi proslijedeni callback u parentu
		} else if (props.type === TranslationDialogEnum.edit) {
			//    Izvrsi proslijedeni callback u parentu
		}
		resetState();
		props.setDisplayDialog(false);
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
					onClick={() => onHideDialog()}
					className="px-4 py-2 bg-indigo-700 text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-sm">
					Reset value
				</button>
				<button
					onClick={handleSubmit(onConfirmDialog)}
					disabled={false}
					className={`px-4 py-2  text-white rounded-md shadow-md hover:shadow-sm ${
						false ? 'bg-indigo-400' : 'bg-indigo-700 hover:bg-indigo-600'
					}`}>
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
				onHide={() => onHideDialog()}>
				{props.translation && props.translation}
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
				<ul>
					{fields &&
						fields.map((item, index) => {
							return (
								<li key={index}>
									<input {...register(`${index}`)} />
									{item}
									{/* <Controller
									render={({ field }) => <input {...field} />}
									name={`test.${index}`}
									control={control}
								/> */}
								</li>
							);
						})}
				</ul>
			</Dialog>
		</>
	);
};

export default TranslationDialog;
