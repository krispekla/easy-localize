import { useEffect } from 'react';
import ProjectList from './components/ProjectList';
import './Overview.scss';

function Overview() {

	useEffect(() => {
		window.electron.on('app-startup-return', (event: any, args: any[]) => {
			console.log('%c 💴: PROJECTS', 'font-size:16px;background-color:#676d1f;color:white;', args);
		});

		if(window.electron) {
			window.electron.send('app-startup')
		}

		return () => {
			window.electron.removeAllListeners('app-startup-return');
		};
	}, []);

	return (
		<main className="overview bg-gradient-to-r from-sanJuan to-eastBay dark">
			<h1 className="pt-3 dark:text-white text-center text-xl">Easy localise</h1>
			<section className="container mx-auto mt-5">
				<h2 className="dark:text-white text-lg mb-3">Projects</h2>
				<button
					className="px-4 py-2 bg-indigo-700 dark:text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-lg">
					Add new project
				</button>
				<ProjectList />
			</section>
		</main>
	);
}

export default Overview;
