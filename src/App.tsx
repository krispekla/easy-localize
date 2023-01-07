import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Editor from './pages/editor/Editor';
import Overview from './pages/overview/Overview';
import store from './redux/store';

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
          <Route path="/">
            <Overview />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
