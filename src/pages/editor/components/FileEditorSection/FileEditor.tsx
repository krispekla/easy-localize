import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import './FileEditor.scss';
import { ProgressSpinner } from 'primereact/progressspinner';

function FileEditor() {
	const activeFile = useAppSelector((state) => state.files.activeFile);
	const [fileContent, setFileContent] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
			console.log('start index= ' + (vueI18nRegex.lastIndex - match[0].length));
			console.log('end index= ' + (vueI18nRegex.lastIndex - 1));
			foundTranslations.push({
				value: match[0].substring(match[0].indexOf('"') + 1, match[0].lastIndexOf('"')),
				start: vueI18nRegex.lastIndex - match[0].length,
				end: vueI18nRegex.lastIndex - 1,
			});
		}
		console.log(
			'%c 🤝: processTranslationsInFile -> foundTranslations ',
			'font-size:16px;background-color:#832c64;color:white;',
			foundTranslations
		);

		setFileContent(file.split('\n'));
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
				{fileContent.length > 0 &&
					fileContent.map((line, index) => {
						return (
							<div className="file__line flex text-xs flex-row" key={line + index}>
								<span className="text-gray-400 mr-3">{index + 1}</span>
								{/* {line} */}
								{line.split('').map((char, charIndex) => {
									return (
										<span className="char__element" key={char + index + charIndex}>
											{char}
										</span>
									);
								})}
							</div>
						);
					})}

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
