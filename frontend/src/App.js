import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import GameGrid from './components/GameGrid';
// import GamePage from './components/GamePage';
import Gobang from './components/Gobang';
import MemoryGame from './components/MemoryGame';
import { UserContext } from './UserContext';


function App() {
  const initialAvatarUrl = localStorage.getItem('avatarUrl') || 'avatar.jpg';
  const [userData, setUserData] = useState({ avatarUrl: initialAvatarUrl });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={GameGrid} />
          <Route path="/game/1" component={Gobang} />
          <Route path="/game/2" component={MemoryGame} />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
