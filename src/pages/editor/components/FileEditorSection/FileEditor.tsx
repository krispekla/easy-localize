import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import './FileEditor.scss';

function FileEditor() {
	const activeFile = useAppSelector((state) => state.files.activeFile);
	const [fileContent, setFileContent] = useState<string[]>([]);
	useEffect(() => {
		window.electron.on('read-file-return', (event: any, file: string) => {
			console.log('ASDF', file);
			setFileContent(file.split('\n'));

			console.log(
				'%c 🍸: FileEditor -> fileContent ',
				'font-size:16px;background-color:#552e94;color:white;',
				fileContent
			);
		});

		loadFileTree();

		return () => {
			window.electron.removeAllListeners('read-file-return');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		loadFileTree();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFile]);

	function loadFileTree() {
		if (window.electron && activeFile) {
			window.electron.send('read-file', {
				path: activeFile.path,
			});
		}
	}

	return (
		<div className="file__editor w-full bg-gray-600 dark:text-white">
			{fileContent.map((line, index) => {
				return (
					<div className="file__line flex flex-row" key={line + index}>
						<span className="text-gray-400 mr-3">{index + 1}</span>
						{line.split('').map((char, charIndex) => {
							return <span className="char__element" key={char + index + charIndex}>{char}</span>;
						})}
					</div>
				);
			})}
		</div>
	);
}

export default FileEditor;
