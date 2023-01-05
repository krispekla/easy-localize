import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setGoogleApiKey } from '../../redux/slices/settingsSlice';
export interface TranslationConfigurationDialogInterface {
	displayDialog: boolean;
	setDisplayDialog: any;
}

const TranslationConfigurationDialog = (props: TranslationConfigurationDialogInterface) => {
	const dispatch = useAppDispatch();
	const apiKey: string = useAppSelector((state) => state.settings.googleApiKey);
	let formDefaultValues: { apiKey: string } = {
		apiKey: '',
	};

	const {
		handleSubmit,
		setValue,
		formState: { errors },
		control,
	} = useForm<{ apiKey: string }>({
		defaultValues: { ...formDefaultValues },
	});

	useEffect(() => {
		setValue('apiKey', apiKey);
	}, [apiKey]);

	const onHideDialog = () => {
		props.setDisplayDialog(false);
	};

	const onConfirmDialog = (data: any) => {
		dispatch(setGoogleApiKey(data.apiKey));
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
					onClick={handleSubmit(onConfirmDialog)}
					disabled={false}
					className={`px-4 py-2  text-white rounded-md shadow-md hover:shadow-sm ${
						false ? 'bg-indigo-400' : 'bg-indigo-700 hover:bg-indigo-600'
					}`}>
					Save configuration
				</button>
			</div>
		);
	};

	return (
		<>
			<Dialog
				header={`Translation configuration`}
				visible={props.displayDialog}
				style={{ maxWidth: '450px', width: '100%' }}
				draggable={false}
				footer={renderDialogAddNewFooter()}
				onHide={() => onHideDialog()}>
				<div className="flex d-col">
					<div className="flex flex-col">
						<label htmlFor="projectName">Google API key:</label>
						<Controller
							name="apiKey"
							control={control}
							rules={{ required: 'Key is required' }}
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
						{errors['apiKey'] && <small className="p-error">{errors['apiKey'].message}</small>}
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default TranslationConfigurationDialog;
