import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import GameGrid from './components/GameGrid';
import Gobang from './components/Gobang';
import MemoryGame from './components/MemoryGame';

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('avatar.jpg');




  return (
    <Router>
      <NavBar web3auth={web3auth} setWeb3auth={setWeb3auth} web3={web3} setWeb3={setWeb3} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
      <Switch>
        <Route path="/" exact component={GameGrid} />
        <Route path="/game/1" component={Gobang} />
        <Route 
          path="/game/2" 
          render={(props) => <MemoryGame {...props} web3auth={web3auth} web3={web3} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />} 
        />
      </Switch>
    </Router>
  );
}

export default App;
