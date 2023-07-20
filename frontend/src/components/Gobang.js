import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import NFT_ABI from '../ABI/GobangUserProfile.json';
import Web3 from 'web3';
import {connectMetaMask} from "../APIs/APIs";

const SIZE = 15;

function Gobang() {
  const [grid, setGrid] = useState(() => Array(SIZE).fill().map(() => Array(SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [winner, setWinner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState('1');
  const [playerColor, setPlayerColor] = useState(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  // define user profile state
  const [userProfile, setUserProfile] = useState({
    userName: '',
    winningCount: 0,
    matchCount: 0,
    rank: 0,
  });

  const handleButtonClick = () => {
    // Connect to Metamask and get the user's address.
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(async (accounts) => {
        const defaultAccount = accounts[0];
        setUserAddress(defaultAccount);

        // Specify your contract's ABI and address.
        const contractAddress = "0x96ACAc928E166AEB616dA5aCEF589b666eD1d802"; // Replace with your contract's address.
        const contract = new web3.eth.Contract(NFT_ABI.abi, contractAddress);

        // Set the user profile state.
        console.log(defaultAccount);

        try {
          const result = await contract.methods.getUserProfile(defaultAccount).call();
          console.log(result);

          setUserProfile({
            userName: result[0],
            winningCount: result[1],
            matchCount: result[2],
            rank: result[3],
          });
        } catch (error) {
          console.error('An error occurred:', error);
        }

        // if (window.confirm('Do you want to test write?')) {
        //   contract.methods
        //     .updateUserProfile(defaultAccount, "bevis", 1, 2, 3) 
        //     .send({ from: defaultAccount })
        //     .catch((error) => {
        //       console.error('An error occurred:', error);
        //     });
        // } else {
          
        // }

        // contract.methods
        // .createUserProfile(defaultAccount, "bevis")
        // .send({ from: defaultAccount })
        // .then((receipt) => {
        //   console.log('Transaction receipt:', receipt);
        //   // Fetch the user profile again to get the updated state.
        //   contract.methods.getUserProfile(defaultAccount).call()
        //     .then(([username, matchCount, winningCount, rank]) => {
        //       setUserProfile({
        //         userName: username,
        //         winningCount: winningCount,
        //         matchCount: matchCount,
        //         rank: rank,
        //       });
        //     });
        // })
        // .catch((error) => {
        //   console.error('An error occurred:', error);
        // });


        // contract.methods.getUserProfile(defaultAccount).call()
        // .then(([username, matchCount, winningCount, rank]) => {
        //   // Set the user profile state.
        //   setUserProfile({
        //     userName: username,
        //     winningCount: winningCount,
        //     matchCount: matchCount,
        //     rank: rank,
        //   });
        // });
      });
    } else {
      console.log('Metamask is not installed.');
    }
  };

  const handleClick = (row, col) => {
    if (!isGameReady) {
      alert('The game is not ready yet. Please wait for another player to join.');
      return;
    }
    if (socket == null || grid[row][col] !== null || winner !== null || playerColor !== currentPlayer) return;
    console.log('make a move!');
    socket.emit('makeMove', { gameId, row, col });
  };

  useEffect(() => {
    

    const newSocket = socketIOClient('http://localhost:3001');
    setSocket(newSocket);

    newSocket.emit('createGame', gameId);

    newSocket.on('gameReady', game => {
      console.log('game ready!');
      setIsGameReady(true);
    });

    newSocket.on('gameUpdate', game => {
      console.log('game update!');
      // setPlayerColor(playerColor === null ? game.currentPlayer : playerColor);
      setPlayerColor(game.currentPlayer);
      setGrid(game.grid);
      setCurrentPlayer(game.currentPlayer);
      setWinner(game.winner);
    });

    return () => newSocket.close();
  }, [setSocket, gameId]);

  const boardStyle = {
    backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '10px',
  };

  return (
    <div>
    <div style={boardStyle}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <Cell 
              key={colIndex} 
              value={value} 
              onClick={() => handleClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
      {isGameReady && <h3>The game is ready!</h3>}
      {winner && <h2>{winner} won the game!</h2>}
      </div>
      <div>
        <h3>User Profile</h3>
        <p>User Name: {userProfile.userName}</p>
        <p>Winning Count: {userProfile.winningCount}</p>
        <p>Match Count: {userProfile.matchCount}</p>
        <p>Rank: {userProfile.rank}</p>
      </div>
      <button onClick={handleButtonClick}>Click Me!</button>
    </div>
  );
}

function Cell({value, onClick}) {
  const cellStyle = {
    width: '20px',
    height: '20px',
    border: '1px solid black',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  };

  if(value) {
    cellStyle.backgroundColor = value === 'Black' ? 'black' : 'white';
  }

  return <div style={cellStyle} onClick={onClick} />;
}

export default Gobang;
