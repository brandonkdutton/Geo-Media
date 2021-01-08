import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Register from "./users/Register";
import Login from "./users/Login";
import HomeWrapper from "./Home/reducerContextWrappers/HomeContextWrapper";
import GlobalSnackbarWrapper from "./GlobalSnackbarWrapper";

// provides current user reducer to all pages in app
import CurrentUserContextWrapper from "./users/CurrentUserContextWrapper";

function App() {
  return (
    <>
      {/* Context wrappers that are required on all pages of the app */}
      <GlobalSnackbarWrapper>
        <CurrentUserContextWrapper>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <HomeWrapper {...props} />}
              />

              <Route
                exact
                path="/register"
                render={(props) => <Register {...props} />}
              />
              <Route
                exact
                path="/login"
                render={(props) => <Login {...props} />}
              />
              {/*<Route exact path='/posts/:postId' component={SinglePostPage} />*/}
              <Redirect to="/" />
            </Switch>
          </Router>
        </CurrentUserContextWrapper>
      </GlobalSnackbarWrapper>
    </>
  );
}

export default App;
