import { MouseEventHandler, useEffect } from 'react';
import { Settings } from '../../core/interfaces/SettingsInterface';
import { useAppDispatch } from '../../redux/hooks';
import { loadSettings } from '../../redux/slices/settingsSlice';
import ProjectList from './components/ProjectList';
import './Overview.scss';

function Overview() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		window.electron.on('app-startup-return', (event: any, args: any[]) => {
			console.log('%c 💴: PROJECTS', 'font-size:16px;background-color:#676d1f;color:white;', args);
		});

		if (window.electron) {
			window.electron.on('settings-load-return', (event: any, args: Settings) => {
				dispatch(loadSettings(args));
			});

			window.electron.send('settings-load');
		}

		return () => {
			window.electron.removeAllListeners('app-startup-return');
			window.electron.removeAllListeners('settings-load-return');
		};
	}, [dispatch]);

	function quitApplication() {
		window.close();
	}

	return (
		<main className="overview bg-gradient-to-r from-sanJuan to-eastBay dark">
			<div className="flex row"></div>
			<h1 className="pt-3 dark:text-white text-center text-xl uppercase">Easy localise</h1>
			<section className="container mx-auto mt-5">
				<h2 className="dark:text-white text-lg mb-3">Projects</h2>
				<ProjectList />
			</section>
			<button
				className="absolute top-2 right-3 px-4 py-2 dark:text-white bg-red-700 hover:bg-red-600 rounded-md shadow-md hover:shadow-lg"
				onClick={quitApplication}>
				Quit
			</button>
		</main>
	);
}

export default Overview;
