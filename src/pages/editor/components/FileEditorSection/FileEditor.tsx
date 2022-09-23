/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import './FileEditor.scss';
import { ProgressSpinner } from 'primereact/progressspinner';

function FileEditor() {
	const activeFile = useAppSelector((state) => state.files.activeFile);
	const [fileContent, setFileContent] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [lines, setLines] = useState<any[]>([]);

	useEffect(() => {
		window.electron.on('read-file-return', (event: any, file: string) => {
			console.log('ASDF', file);
			setIsLoading(false);
			processTranslationsInFile(file);
		});

		loadFileTree();

		return () => {
			window.electron.removeAllListeners('read-file-return');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFile]);

	function processTranslationsInFile(file: string) {
		let vueI18nRegex = /\$t([^\)]+\))/g;
		let match;
		let foundTranslations = [];
		while ((match = vueI18nRegex.exec(file))) {
			foundTranslations.push({
				value: match[0].substring(match[0].indexOf('"') + 1, match[0].lastIndexOf('"')),
				start: vueI18nRegex.lastIndex - match[0].length,
				end: vueI18nRegex.lastIndex - 1,
			});
		}
		let translationRanges = foundTranslations.map((x) => [x.start, x.end, x.value]);

		let text = '';
		let translation = '';
		let activeTranslation: object | null = null;
		let row: any = [];
		let temp: any = [];
		file.split('').forEach((x, index) => {
			for (let i = 0; i < translationRanges.length; i++) {
				if (x === '\n') {
					if (text) {
						row.push({
							type: 'text',
							text,
						});
					}
					if (translation) {
						row.push({
							type: 'translation',
							translation,
						});
						translation = '';
					}
					activeTranslation = null;
					temp.push(
						<div className="flex flex-row whitespace-pre" key={x + index + i}>
							{row.map((item: any) => {
								if (item.type === 'text') {
									return <div>{item.text}</div>;
								} else {
									return (
										<div
											className="bg-indigo-700 hover:bg-indigo-600 cursor-pointer"
											onClick={(e) => onTranslationClick({ ...item.activeTranslation })}>
											{item.translation}
										</div>
									);
								}
							})}
						</div>
					);
					translation = '';
					text = '';
					row = [];
					return;
				} else if (index === translationRanges[i][0]) {
					activeTranslation = translationRanges[i];
					translation += x;
					if (text) {
						row.push({
							type: 'text',
							text,
						});
					}
					return;
				} else if (index === translationRanges[i][1]) {
					translation += x;
					row.push({
						type: 'translation',
						translation,
						activeTranslation,
					});
					text = '';
					translation = '';
					return;
				} else if (index > translationRanges[i][0] && index < translationRanges[i][1]) {
					translation += x;
					return;
				} else if (translationRanges.length - 1 === i) {
					if (!translation) {
						text += x;
					} else {
						translation = '';
					}
					return;
				}
			}
		});
		setLines(temp);
		// setFileContent(file.split('\n'));
	}
	function onTranslationClick(data: any) {
		console.log(
			'%c 🇦🇷: onTranslationClick -> data ',
			'font-size:16px;background-color:#4fb4dd;color:white;',
			data
		);
	}

	function loadFileTree() {
		if (window.electron && activeFile) {
			window.electron.send('read-file', {
				path: activeFile.path,
			});
		}
	}

	return (
		<section className="file__editor flex flex-col pl-3 pt-2">
			<h2 className="mb-1 text-gray-200">Editor</h2>
			<div className={` dark:text-white ${isLoading ? 'flex items-center' : ''}`}>
				{
					lines.length > 0 && lines.map((x) => x)
					// fileContent.map((line, index) => {
					// 	return (
					// 		<div className="file__line flex text-xs flex-row" key={line + index}>
					// 			<span className="text-gray-400 mr-3">{index + 1}</span>
					// 			{/* {line} */}
					// 			{line.split('').map((char, charIndex) => {
					// 				return (
					// 					<span className="char__element" key={char + index + charIndex}>
					// 						{char}
					// 					</span>
					// 				);
					// 			})}
					// 		</div>
					// 	);
					// })}
				}{' '}
				{isLoading && (
					<ProgressSpinner
						className="justify-self-center align-center h-100"
						style={{ width: '100px', height: '100px' }}
						strokeWidth="6"
						animationDuration=".5s"
					/>
				)}
			</div>
		</section>
	);
}

export default FileEditor;
