import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import GameGrid from './components/GameGrid';
// import GamePage from './components/GamePage';
import Gobang from './components/Gobang';


function App() {

  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact component={GameGrid} />
        <Route path="/game/1" component={Gobang} />
      </Switch>
    </Router>
  );
}

export default App;
