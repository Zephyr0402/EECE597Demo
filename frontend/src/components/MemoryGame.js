import React, { useState, useEffect } from 'react';
import MemoryGameProfileJSON from '../ABI/MemoryGameProfile.json';

// 0xE7Ea5f23B1Fb3290c6230996c4032E2555c645d5

function MemoryGame({ web3auth, web3, avatarUrl, setAvatarUrl }) {
  const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
  const [shuffledCards, setShuffledCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameActive, setGameActive] = useState(false);  
  const [userName, setUserName] = useState("");
  const [completionTime, setCompletionTime] = useState(null);  
  const contractAddress = "0x6f13891DbD3D00503CD5cBD283a6e375Bc80E4EB";  
  
  useEffect(() => {
    if (gameActive && matchedIndices.length === cards.length) {
      const end = new Date();  // Get the current time
      setEndTime(end);  // Store it in the state for other usages
      setGameActive(false);
      
      // Calculate the difference using the direct value
      const completionTime = Math.floor((end - startTime) / 1000);
      updateCompletionTime(completionTime);
    }
}, [matchedIndices]);  

  
  useEffect(() => {
    if (web3 && web3auth) {
      fetchUserProfile();
      fetchGameCompletionTime();
    }
  }, [web3, web3auth]);  
  
  const fetchUserProfile = async () => {
    try {
      const playerAccounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(MemoryGameProfileJSON.abi, contractAddress);
      const profile = await contract.methods.getUserProfile(playerAccounts[0]).call();
      setUserName(profile.userName);
      setAvatarUrl(profile.userAvatar);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const fetchGameCompletionTime = async () => {
    try {
      const playerAccounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(MemoryGameProfileJSON.abi, contractAddress);
      const time = await contract.methods.getGameResult(playerAccounts[0]).call();
      setCompletionTime(time);
    } catch (error) {
      console.error("Error fetching game completion time:", error);
    }
  };
  
  const updateProfile = async (newName, newAvatar) => {
    try {
      const playerAccounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(MemoryGameProfileJSON.abi, contractAddress);
      await contract.methods.updateUserProfile(newName, newAvatar).send({ from: playerAccounts[0] });
    
      // Update the local state after successful update
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };  
  
  const updateCompletionTime = async (newTime) => {
    try {
      const playerAccounts = await web3.eth.getAccounts();
      console.log(playerAccounts);
      const contract = new web3.eth.Contract(MemoryGameProfileJSON.abi, contractAddress);
      
      // Fetch existing time from smart contract
      const gameResult = await contract.methods.getGameResult(playerAccounts[0]).call();
      
      console.log(newTime);
      console.log(gameResult.completionTime);
      // Check if the new time is shorter or if there was no existing time
      if (gameResult.completionTime === '0' || newTime < gameResult.completionTime) {
        await contract.methods.submitGameResult(newTime).send({ from: playerAccounts[0] });
          
        // Update the local state with the new shorter time
        setCompletionTime(newTime);
      }
    } catch (error) {
      console.error("Error updating time:", error);
    }
}; 
  
  const startGame = () => {
    setStartTime(new Date());
    setEndTime(null);
    setGameActive(true);
    setShuffledCards(shuffle([...cards]));
    setFlippedIndices([]);
    setMatchedIndices([]);
  }  
  
  const abortGame = () => {
    setGameActive(false);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setShuffledCards([]);
  }  
  
  const handleCardClick = (index) => {
    if (!gameActive || flippedIndices.includes(index) || matchedIndices.includes(index)) return;  
    if (flippedIndices.length === 2) {
      setTimeout(() => setFlippedIndices([index]), 1000);
    } else {
      setFlippedIndices(prev => [...prev, index]);
    }  
    if (flippedIndices.length === 1) {
      const [firstCardIndex] = flippedIndices;
      if (shuffledCards[firstCardIndex] === shuffledCards[index]) {
        setMatchedIndices(prev => [...prev, firstCardIndex, index]);
        setFlippedIndices([]);
      }
    }
  }  
  
  const elapsedTime = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;  
  
  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {userName}</p>
      <p>Completion Time: {completionTime ? `${completionTime} seconds` : "None"}</p>
      <button onClick={fetchUserProfile}>Refresh Profile</button>
      <div>
        <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="User Name"/>
        <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="Avatar URL"/>
        <button onClick={() => updateProfile(userName, avatarUrl)}>Update Profile</button>
      </div>
      <div className="memory-game">
          {gameActive ? (
              <>
                <button onClick={abortGame}>Abort Challenge</button>
                <div className="memory-game-board">
                    {shuffledCards.map((card, index) => (
                        <div
                            key={index}
                            className="memory-game-card"
                            onClick={() => handleCardClick(index)}
                        >
                            {(flippedIndices.includes(index) || matchedIndices.includes(index)) ? card : "?"}
                        </div>
                    ))}
                </div>
              </>
          ) : (
              <>
                  {matchedIndices.length === cards.length ? (
                      <div className="game-summary">
                          <p>You've finished in {elapsedTime} seconds!</p>
                          <button onClick={startGame}>Play Again</button>
                      </div>
                  ) : (
                      <button onClick={startGame}>Start Game</button>
                  )}
              </>
          )}
      </div>
    </div>
  );
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default MemoryGame;
