import React from "react";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/login/Login";
import Session from "./auth/Session";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Session />
      <BrowserRouter>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/login" render={() => <Login />} />
      </BrowserRouter>
    </>
  );
}

export default App;
