import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Settings } from './core/interfaces/SettingsInterface';
import Editor from './pages/editor/Editor';
import Overview from './pages/overview/Overview';
import { useAppDispatch } from './redux/hooks';
import { loadSettings } from './redux/slices/settingsSlice';
import store from './redux/store';

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			window.electron.on('log', (event: any, args: any) => {
				console.log('%c MAIN ', 'font-size:14px;background-color:#2c71f2;color:white;', args);
			});
		}

		if (window.electron) {
			window.electron.on('settings-load-return', (event: any, args: Settings) => {
				dispatch(loadSettings(args));
			});

			window.electron.send('settings-load');
		}

		return () => {
			window.electron.removeAllListeners('log');
			window.electron.removeAllListeners('settings-load-return');
		};
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route path="/overview">
						<Overview />
					</Route>
					<Route path="/editor">
						<Editor />
					</Route>
					<Route path="/">
						<Overview />
					</Route>
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;
