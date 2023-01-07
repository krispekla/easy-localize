import React, { useEffect } from 'react';
import { HashRouterProps, withRouter } from 'react-router-dom';

function ProjectCommands({ history }: any | HashRouterProps) {
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
    <section className="flex">
      <button
        onClick={resize}
        className="mt-1 mr-3 px-3 h-10 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded-md shadow-md hover:shadow-lg uppercase"
      >
        Open existing
      </button>
      <button
        onClick={resize}
        className="mt-1 mr-5 px-3 h-10 text-sm text-white  bg-gray-800 hover:bg-gray-700 rounded-md shadow-md hover:shadow-lg uppercase"
      >
        Close
      </button>
    </section>
  );
}

export default withRouter(ProjectCommands);
