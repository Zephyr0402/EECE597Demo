import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import GameGrid from './components/GameGrid';
import Gobang from './components/Gobang';
import MemoryGame from './components/MemoryGame';
import { Web3authHelper } from './ChainlessJS/Web3authHelper';
import { Web3Helper } from './ChainlessJS/Web3Helper';

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('avatar.jpg');
  const [web3Helper, setWeb3Helper] = useState(new Web3Helper());
  const [web3authHelper, setWeb3authHelper] = useState(new Web3authHelper());

  const history = useHistory();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [history]);

  return (
    <Router>
      <NavBar web3Helper={web3Helper} setWeb3Helper={setWeb3Helper} web3authHelper={web3authHelper} setWeb3authHelper={setWeb3authHelper} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
      <Switch>
        <Route path="/" exact component={GameGrid} />
        <Route path="/game/1" component={Gobang} />
        <Route 
          path="/game/2" 
          render={(props) => <MemoryGame {...props} web3Helper={web3Helper} web3authHelper={web3authHelper} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />} 
        />
      </Switch>
    </Router>
  );
}

export default App;
