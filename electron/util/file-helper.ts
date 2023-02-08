import * as fs from 'fs';
import * as path from 'path';
import { Settings } from '../types/interfaces/SettingsInterface';
import TreeNode from '../types/interfaces/TreeNode';
import { flatten, unflatten } from './utils';
import app from '../index';

let APP_CONFIG_ROOT_PATH_CONFIG: string;

function checkIfConfigFileExists() {
  if (!APP_CONFIG_ROOT_PATH_CONFIG) {
    const APP_CONFIG_ROOT_PATH = app.getPath('userData');
    APP_CONFIG_ROOT_PATH_CONFIG = `${APP_CONFIG_ROOT_PATH}config.json`;
  }
}

export function writeAppSettings(_event: Electron.IpcMainEvent, args: any[]) {
  checkIfConfigFileExists();
  const configData = JSON.stringify(args);
  fs.writeFileSync(APP_CONFIG_ROOT_PATH_CONFIG, configData, 'utf-8');
}

export function readAppSettings(): Settings {
  checkIfConfigFileExists();
  const rawData = fs.readFileSync(APP_CONFIG_ROOT_PATH_CONFIG);
  const loadedData = JSON.parse(rawData.toString());
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
    if (currentNode) {
      currentNode.isIgnored = ignoredDirectory.includes(currentNode.name);
    }

    if (currentNode && !currentNode.isIgnored) {
      const children = fs.readdirSync(currentNode.path, {
        withFileTypes: true
      });

      for (const child of children) {
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

export function readTranslationsInVueType(url: string): object[] {
  const rawData = fs.readFileSync(url);
  const loadedData = rawData.toString();
  const vueI18nRegex = /\$t([^\)]+\))/g;
  let match;
  const foundTranslations = [];
  while ((match = vueI18nRegex.exec(loadedData))) {
    foundTranslations.push({
      name: match[0].substring(match[0].indexOf('"') + 1, match[0].lastIndexOf('"')),
      start: vueI18nRegex.lastIndex - match[0].length,
      end: vueI18nRegex.lastIndex - 1
    });
  }

  return foundTranslations;
}

export function readTranslations(url: string): Translation {
  const files = fs.readdirSync(url).filter((file) => path.extname(file) === '.json');
  const loadedTranslationsPerLanguage: any = {};
  files.forEach((file) => {
    const rawData = fs.readFileSync(path.join(url, file));
    const lngAlpha2 = file.slice(0, 2);
    loadedTranslationsPerLanguage[lngAlpha2] = flatten(JSON.parse(rawData.toString()));
  });
  const loadedTranslations: Translation = {};
  for (const [lng, translations] of Object.entries(loadedTranslationsPerLanguage)) {
    // @ts-ignore
    for (const [key, translation] of Object.entries(translations)) {
      if (loadedTranslations[key]) {
        loadedTranslations[key][lng] = translation as string;
      } else {
        loadedTranslations[key] = {
          [lng]: translation
        } as Object;
      }
    }
  }
  return loadedTranslations;
}

export function writeTranslations(url: string, translations: Translation) {
  const fileTranslations = {};
  for (const [id, txs] of Object.entries(translations)) {
    for (const [lang, translation] of Object.entries(txs)) {
      // @ts-ignore
      if (!fileTranslations[lang]) {
        // @ts-ignore
        fileTranslations[lang] = {};
      } else {
        // @ts-ignore
        fileTranslations[lang][id] = translation;
      }
    }
  }
  for (const [langName, txs] of Object.entries(fileTranslations)) {
    // @ts-ignore
    const unflattenTranslations = unflatten(txs);
    const fileName = path.join(url, `${langName}.json`);
    fs.writeFileSync(fileName, JSON.stringify(unflattenTranslations, null, 2));
  }
}

export interface Translation {
  [name: string]: Object;
}

type Object = {
  [key: string]: string;
};
