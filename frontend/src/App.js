import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import GameGrid from './components/GameGrid';
// import GamePage from './components/GamePage';
import Gobang from './components/Gobang';
import MemoryGame from './components/MemoryGame';
import Web3AuthContext from './Web3AuthContext';


function App() {
  const [web3auth, setWeb3auth] = useState(null);

  return (
    <Web3AuthContext.Provider value={{ web3auth, setWeb3auth }}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={GameGrid} />
          <Route path="/game/1" component={Gobang} />
          <Route path="/game/2" component={MemoryGame} />
        </Switch>
      </Router>
    </Web3AuthContext.Provider>
  );
}

export default App;
