import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../redux/hooks';

function FileEditor() {
	const activeFile = useAppSelector((state) => state.files.activeFile);

	useEffect(() => {
		window.electron.on('read-file-return', (event: any, fileContent: any) => {
			console.log('ASDF', fileContent);
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

	return <div className="w-full bg-gray-600 dark:text-white"></div>;
}

export default FileEditor;
