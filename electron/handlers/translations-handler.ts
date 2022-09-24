import { ipcMain } from '../main';
// const { Translate } = require('@google-cloud/translate').v2;
import { Translate } from '@google-cloud/translate/build/src/v2/index';
async function getTranslationHandler(
	event: Electron.IpcMainEvent,
	{ text, source, target }: { text: string; source: string; target: string }
) {
	const projectId = 'easy-locale';
	const translate = new Translate({ projectId });
	const options = {
		from: source,
		to: target,
	};
	let [translation] = await translate.translate(text, options);
	event.sender.send('get-translation-return', translation);
}

export const getTranslationListener = ipcMain.on('get-translation', getTranslationHandler);
