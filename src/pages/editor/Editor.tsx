import React, { useEffect } from 'react';
import { HashRouterProps, withRouter } from 'react-router-dom';

function Editor({ history }: any | HashRouterProps) {
	useEffect(() => {
		window.electron.on('resize-window-return', (event: any, args: any) => {
			console.log(args);
		});
		return () => {
			window.electron.removeAllListeners('resize-window-return');
		};
	}, []);

	function resize(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();

		if (window.electron) {
			window.electron.send('window-open-editor', { window: 'overview' });
		}
		history.push('/overview');
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

export default withRouter(Editor);
