import {
  readFileContent,
  readDirectoryTree,
  readTranslations,
  writeTranslations,
  Translation,
  addMissingLanguagesToTranslations
} from '../util/file-helper';
import TreeNode from '../types/interfaces/TreeNode';
import { Language } from '../types/interfaces/LanguageInterface';

function readDirectoryTreeHandler(
  event: Electron.IpcMainEvent,
  { path, ignoredDirectory }: { path: string; ignoredDirectory: string[] }
) {
  const loadedDirectoryTree: TreeNode = readDirectoryTree(path, ignoredDirectory);
  event.sender.send('read-directory-tree-return', loadedDirectoryTree);
}

function readFileHandler(event: Electron.IpcMainEvent, { path }: { path: string }) {
  const loadedFile = readFileContent(path);
  event.sender.send('read-file-return', loadedFile);
}

function readTranslationsHandler(
  event: Electron.IpcMainEvent,
  { path, languages }: { path: string; languages: Language[] }
) {
  const translations: Translation = readTranslations(path);
  addMissingLanguagesToTranslations(translations, languages);
  event.sender.send('read-translation-files-return', translations);
}

function writeTranslationsHandler(
  _event: Electron.IpcMainEvent,
  { url, translations }: { url: string; translations: Translation }
) {
  writeTranslations(url, translations);
}

export default [
  { name: 'read-directory-tree', handler: readDirectoryTreeHandler },
  { name: 'read-file', handler: readFileHandler },
  { name: 'read-translation-files', handler: readTranslationsHandler },
  { name: 'write-translation-files', handler: writeTranslationsHandler }
];
