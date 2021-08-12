import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { increment, ProjectInterface } from '../../redux/slices/projectSlice';
import ProjectList from './components/ProjectList';
import './Overview.scss';

function Overview() {
	const da = useAppSelector((state) => state.overview.projects);
	const dispatch = useAppDispatch();

	const mockedProjects: Array<ProjectInterface> = [
		{
			name: 'Test projekt 1',
			src: '/user/app/test1',
			isPinned: false,
		},
		{
			name: 'Test projekt 2',
			src: '/user/app/test2',
			isPinned: false,
		},
		{
			name: 'Test projekt 3',
			src: '/user/app/test3',
			isPinned: true,
		},
	];

	return (
		<main className="overview bg-gradient-to-r from-sanJuan to-eastBay dark">
			<h1 className="pt-3 dark:text-white text-center text-xl">Easy localise</h1>
			<section className="container mx-auto mt-5">
				<h2 className="dark:text-white text-lg mb-3">Projects</h2>
				<button
					className="px-4 py-2 bg-indigo-700 dark:text-white hover:bg-indigo-600 rounded-md shadow-md hover:shadow-lg"
					onClick={(e) => dispatch(increment())}>
					Add new project
				</button>
				<ProjectList projects={mockedProjects} />
			</section>
			{/* <div className="bg-green-800 p-5">
                {da.map((s, key) => <p key={key}>{s}</p>)}
            </div>
            <button className="p-10 bg-yellow-500" onClick={e => dispatch(increment())}>Povecaj</button>
            <button className="p-10 bg-red-500" onClick={resize}>Klikni</button> */}
		</main>
	);
}

export default Overview;
