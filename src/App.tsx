import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Editor from './pages/editor/Editor';
import Overview from './pages/overview/Overview';
import store from "./redux/store";

function App() {

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
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
