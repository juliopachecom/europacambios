import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { NavBar } from './Components/NavBar'
import { Footer } from './Components/Footer'
import routes from './Config/routes';

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavBar />
          <Switch>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
          </Switch>
          <Footer />
      </Router>
    </React.Fragment>
  );
}

export default App;