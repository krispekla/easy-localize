import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Editor from './Views/Editor/Editor';
import Overview from './Views/Overview/Overview';

function App() {
  // useEffect(() => {
  //   window.electron.on('directory-path', (event: any, args: any) => {
  //     console.log(args);
  //   })
  //   return () => {
  //     window.electron.removeAllListeners('directory-path"')
  //   }
  // }, [])

  // function loadAllFiles(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   e.preventDefault()

  //   if (window.electron) {
  //     window.electron.send('load-directory')
  //   }
  // }



  return (
    <Router>
      <Switch>
        <Route path="/overview">
          <Overview />
        </Route>
        <Route path="/editor">
          <Editor />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
