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
			setFileContent(file.split('\n'));
		});

		loadFileTree();

		return () => {
			window.electron.removeAllListeners('read-file-return');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setIsLoading(true);
		setFileContent([]);
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
		<section className="file__editor flex flex-col pl-3 pt-2">
			<h2 className="mb-1 text-gray-200">Editor</h2>
			<div
				className={`bg-gray-600 dark:text-white ${
					isLoading ? 'flex items-center bg-gray-800' : 'bg-gray-600'
				}`}>
				{fileContent.length > 0 &&
					fileContent.map((line, index) => {
						return (
							<div className="file__line flex text-xs flex-row" key={line + index}>
								<span className="text-gray-400 mr-3">{index + 1}</span>
								{line}
								{/* {line.split('').map((char, charIndex) => {
								return (
									<span className="char__element" key={char + index + charIndex}>
										{char}
									</span>
								);
							})} */}
							</div>
						);
					})}

				{isLoading && (
					<ProgressSpinner
						className="justify-self-center align-middle h-100"
						style={{ width: '50px', height: '50px' }}
						strokeWidth="8"
						animationDuration=".5s"
					/>
				)}
			</div>
		</section>
	);
}

export default FileEditor;
