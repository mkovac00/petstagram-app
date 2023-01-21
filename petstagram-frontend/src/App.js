import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./users/pages/Users";
import NewAnimal from "./animals/pages/NewAnimal";
import UserAnimals from "./animals/pages/UserAnimals";
import UpdateAnimal from "./animals/pages/UpdateAnimal";
import Auth from "./users/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Container from "./shared/components/PageElements/Container";
import PageSplitter from "./shared/components/PageElements/PageSplitter";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Container />
          <PageSplitter text="Explore our current users" />
          <Users />
        </Route>
        <Route path="/:userId/animals" exact>
          <UserAnimals />
        </Route>
        <Route path="/animals/new" exact>
          <NewAnimal />
        </Route>
        <Route path="/animals/:animalId">
          <UpdateAnimal />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Container />
          <PageSplitter text="Explore our current users" />
          <Users />
        </Route>
        <Route path="/:userId/animals" exact>
          <UserAnimals />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
