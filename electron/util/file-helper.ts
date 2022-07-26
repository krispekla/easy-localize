import * as fs from 'fs';
import * as path from 'path';
import { Settings } from '../types/interfaces/SettingsInterface';
import TreeNode from '../types/interfaces/TreeNode';
import { app } from '../main';
import { flatten } from './utils';

let APP_CONFIG_ROOT_PATH_CONFIG: string;

function checkIfConfigFileExists() {
	if (!APP_CONFIG_ROOT_PATH_CONFIG) {
		const APP_CONFIG_ROOT_PATH = app.getPath('userData');
		APP_CONFIG_ROOT_PATH_CONFIG = APP_CONFIG_ROOT_PATH + 'config.json';
	}
}

export function writeAppSettings(event: Electron.IpcMainEvent, args: any[]) {
	checkIfConfigFileExists();

	const configData = JSON.stringify(args);
	fs.writeFileSync(APP_CONFIG_ROOT_PATH_CONFIG, configData, 'utf-8');
}

export function readAppSettings(): Settings {
	checkIfConfigFileExists();

	const rawData = fs.readFileSync(APP_CONFIG_ROOT_PATH_CONFIG);
	let loadedData = JSON.parse(rawData.toString());

	return loadedData;
}

export function readFileContent(path: string): string {
	const rawData = fs.readFileSync(path);
	return rawData.toString();
}

export function readDirectoryTree(path: string, ignoredDirectory: string[]): TreeNode {
	const root = new TreeNode(path, path.slice(path.lastIndexOf('/') + 1, path.length));
	const stack = [root];

	while (stack.length) {
		const currentNode = stack.pop();
		currentNode.isIgnored = ignoredDirectory.includes(currentNode.name);

		if (currentNode && !currentNode.isIgnored) {
			const children = fs.readdirSync(currentNode.path, {
				withFileTypes: true,
			});

			for (let child of children) {
				const childPath = `${currentNode.path}/${child.name}`;
				const childNode = new TreeNode(childPath, child.name, child.isDirectory());
				currentNode.children.push(childNode);

				if (fs.statSync(childNode.path).isDirectory()) {
					stack.push(childNode);
				}
			}

			currentNode.sort();
		}
	}
	return root;
}

export function readTranslations(url: string, defaultLanguage: string): Map<String, Translation> {
	const files = fs.readdirSync(url).filter((file) => path.extname(file) === '.json');
	const translationsList: Map<String, Translation> = new Map<String, Translation>();

	const loadedTranslations = new Map<String, any>();
	files.forEach((file, index) => {
		const rawData = fs.readFileSync(path.join(url, file));
		const lngAlpha2 = file.slice(0, 2);
		loadedTranslations.set(lngAlpha2, flatten(JSON.parse(rawData.toString())));
	});

	// TODO: ~~Find default language~~
	// Go through default language and set its keys
	const translationResult = new Map<String, Translation>();
	for (const [key, value] of Object.entries(loadedTranslations.get(defaultLanguage))) {
		translationResult.set(key, {
			translations: new Map<String, String>([[defaultLanguage as String, value as String]]),
		});
	}
	// Go through other languages and set translationResult to their keys
	loadedTranslations.forEach((translations, lngAlpha2Key) => {
		// Check if default language continue to next
		if (lngAlpha2Key === defaultLanguage) return;
		for (const [key, value] of Object.entries(translations)) {
			if (translationResult.has(key)) {
				translationResult.get(key).translations.set(key, value as String);
			}
		}
	});
	return loadedTranslations;
}

export type Translation = {
	translations?: Map<String, String>;
	occurances?: [];
};

export type TranslationList = {
	translations: Translation[];
};

// type Object = {
// 	[key: string]: String;
// };
