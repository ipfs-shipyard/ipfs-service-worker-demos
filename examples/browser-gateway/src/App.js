import React, { Component } from 'react';
import { Router as ReactRouter, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Gateway from './Gateway';
import Home from './Home';

const browserHistory = createHistory();

export default class App extends Component {
  render() {
    return (
      <ReactRouter history={browserHistory}>
        <Switch>
          <Route exact path="/ipfs/:hash" component={Gateway} />
          <Route path="/" component={Home} />
        </Switch>
      </ReactRouter>
    );
  }
}
