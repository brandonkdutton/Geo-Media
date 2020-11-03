import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Register from './users/Register';
import Login from './users/Login';
import Logout from './users/Logout';
import Home from './Home/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/logout' component={Logout} />
        {/*<Route exact path='/posts/:postId' component={SinglePostPage} />*/}
        <Redirect to="/" />
      </Switch>
    </Router>
  )
}

export default App
