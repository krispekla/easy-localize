import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Editor from './pages/editor/Editor';
import Overview from './pages/overview/Overview';
import store from './redux/store';

function App() {
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			window.electron.on('log', (event: any, args: any) => {
				console.log('%c MAIN ', 'font-size:14px;background-color:#2c71f2;color:white;', args);
			});
		}

		return () => {
			window.electron.removeAllListeners('log');
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
