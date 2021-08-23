import { useEffect } from 'react';
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


	return (
		<main className="overview bg-gradient-to-r from-sanJuan to-eastBay dark">
			<h1 className="pt-3 dark:text-white text-center text-xl">Easy localise</h1>
			<section className="container mx-auto mt-5">
				<h2 className="dark:text-white text-lg mb-3">Projects</h2>
				<ProjectList />
			</section>
		</main>
	);
}

export default Overview;
