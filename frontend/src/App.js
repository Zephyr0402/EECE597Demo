import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import GameGrid from './components/GameGrid';
import Gobang from './components/Gobang';
import MemoryGame from './components/MemoryGame';
import Web3authHelper from './ChainlessJS/Web3authHelper';
import Web3Helper from './ChainlessJS/Web3Helper';

function App() {
    const [avatarUrl, setAvatarUrl] = useState('https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=');
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
          <NavBar data-testid="navbar" web3Helper={web3Helper} setWeb3Helper={setWeb3Helper} web3authHelper={web3authHelper} setWeb3authHelper={setWeb3authHelper} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
          <Switch>
            <Route path="/" exact component={GameGrid} />
            <Route
              path="/game/1"
              render={(props) => <Gobang {...props} web3Helper={web3Helper} web3authHelper={web3authHelper} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />} 
            />
            <Route
              path="/game/2"
              render={(props) => <MemoryGame {...props} web3Helper={web3Helper} web3authHelper={web3authHelper} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />} 
            />
          </Switch>
        </Router>
    );
}

export default App;
