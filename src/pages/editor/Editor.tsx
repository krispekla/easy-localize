import React, { useEffect } from 'react';

function Editor() {
	useEffect(() => {
		window.electron.on('resize-window-return', (event: any, args: any) => {
			console.log(args);
		});
		return () => {
			window.electron.removeAllListeners('directory-path"');
		};
	}, []);

	function resize(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();

		if (window.electron) {
			window.electron.send('window-open-editor', 'overview');
		}
	}

	return (
		<div>
			Editor
			<button className="p-10 bg-red-500" onClick={resize}>
				Klikni
			</button>
		</div>
	);
}

export default Editor;
