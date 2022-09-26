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
		ignoredDirectory.push('node_modules');
		ignoredDirectory.push('.git');
		currentNode.isIgnored = ignoredDirectory.includes(currentNode.name);

		if (currentNode && !currentNode.isIgnored) {
			const children = fs.readdirSync(currentNode.path, {
				withFileTypes: true,
			});

			for (let child of children) {
				const childPath = `${currentNode.path}/${child.name}`;
				const childNode = new TreeNode(childPath, child.name, child.isDirectory());

				if (fs.statSync(childNode.path).isDirectory()) {
					stack.push(childNode);
				} else {
					const translationsInFile = readTranslationsInVueType(childPath);
					if (translationsInFile) {
						childNode.setTranslations(translationsInFile);
					}
				}
				currentNode.children.push(childNode);
			}
			currentNode.sort();
		}
	}
	return root;
}

export function readTranslationsInVueType(url: string): string[] {
	const rawData = fs.readFileSync(url);
	let loadedData = rawData.toString();
	let vueI18nRegex = /\$t([^\)]+\))/g;
	let match;
	let foundTranslations = [];
	while ((match = vueI18nRegex.exec(loadedData))) {
		foundTranslations.push(
			match[0].substring(match[0].indexOf('"') + 1, match[0].lastIndexOf('"'))
		);
	}

	return foundTranslations;
}

export function readTranslations(url: string): Translation {
	const files = fs.readdirSync(url).filter((file) => path.extname(file) === '.json');
	const loadedTranslationsPerLanguage: any = {};
	files.forEach((file, index) => {
		const rawData = fs.readFileSync(path.join(url, file));
		const lngAlpha2 = file.slice(0, 2);
		loadedTranslationsPerLanguage[lngAlpha2] = flatten(JSON.parse(rawData.toString()));
	});
	const loadedTranslations: Translation = {};
	for (const [lng, translations] of Object.entries(loadedTranslationsPerLanguage)) {
		for (const [key, translation] of Object.entries(translations)) {
			if (loadedTranslations[key]) {
				loadedTranslations[key][lng] = translation;
			} else {
				loadedTranslations[key] = {
					[lng]: translation,
				};
			}
		}
	}
	return loadedTranslations;
}

export interface Translation {
	[name: string]: Object;
}

type Object = {
	[key: string]: String;
};
