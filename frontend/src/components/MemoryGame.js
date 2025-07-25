import React, { useState, useEffect } from 'react';
import MemoryGameProfile from '../ChainlessJS/MemoryGameProfile';

function MemoryGame({ web3Helper, web3authHelper, avatarUrl, setAvatarUrl, testContract }) {
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
    const [shuffledCards, setShuffledCards] = useState([]);
    const [flippedCardIndices, setFlippedCardIndices] = useState([]);
    const [matchedCardIndices, setMatchedCardIndices] = useState([]);
    
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    
    const [gameActive, setGameActive] = useState(false);
    
    const [userName, setUserName] = useState("");
    const [completionTime, setCompletionTime] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (gameActive && matchedCardIndices.length === cards.length) {
            const end = new Date();
            setEndTime(end);
            setGameActive(false);

            const completionTime = Math.floor((end - startTime) / 1000);
            updateCompletionTime(completionTime);
        }
    }, [matchedCardIndices]);

    useEffect(() => {
        if (web3Helper && web3authHelper) {
            let currentContract = null;
            
            if (testContract) {
                currentContract = testContract;
                setContract(currentContract);
            } else {
                currentContract = new MemoryGameProfile();
                setContract(currentContract);
            }
            
            currentContract.createContractInstance(web3Helper.getWeb3Instance());
            
            fetchUserProfile(currentContract);
            fetchGameCompletionTime(currentContract);
        }
    }, [web3Helper, web3authHelper]);

    const fetchUserProfile = async (currentContract) => {
        try {
            const playerAccounts = await web3Helper.getAccounts();
            const profile = await currentContract.getUserProfile(playerAccounts[0]);
            if (profile.userAvatar === '') {
                setAvatarUrl("signin.png");
            } else {
                setAvatarUrl(profile.userAvatar);
            }
            setUserName(profile.userName);

        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };
  
    const fetchGameCompletionTime = async (currentContract) => {
        try {
            const playerAccounts = await web3Helper.getAccounts();
            const time = await currentContract.getGameResult(playerAccounts[0]);
            setCompletionTime(time);
        } catch (error) {
            console.error("Error fetching game completion time:", error);
        }
    };

    const updateProfile = async (newName, newAvatar) => {
        try {
            const playerAccounts = await web3Helper.getAccounts();
            await contract.updateUserProfile(playerAccounts[0], newName, newAvatar);
            fetchUserProfile(contract);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const updateCompletionTime = async (newTime) => {
        try {
            const playerAccounts = await web3Helper.getAccounts();
            
            const gameResult = await contract.getGameResult(playerAccounts[0]);
            
            if (gameResult.completionTime === '0' || newTime < gameResult.completionTime) {
                await contract.submitGameResult(playerAccounts[0], newTime);
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
        setShuffledCards(shufflingCards([...cards]));
        setFlippedCardIndices([]);
        setMatchedCardIndices([]);
    }  
  
    const abortGame = () => {
        setGameActive(false);
        setShuffledCards([]);
        setFlippedCardIndices([]);
        setMatchedCardIndices([]);
    }  
  
    const handleCardClick = (index) => {
        if (!gameActive) {
            return;
        } 
        if (flippedCardIndices.includes(index) || matchedCardIndices.includes(index)) {
            return; 
        }
        if (flippedCardIndices.length === 2) {
            setTimeout(() => setFlippedCardIndices([index]), 1000);
        } else {
            setFlippedCardIndices(prevFlippedCardIndices => [...prevFlippedCardIndices, index]);
        }  
        if (flippedCardIndices.length === 1) {
            const [firstCardIndex] = flippedCardIndices;
            if (shuffledCards[firstCardIndex] === shuffledCards[index]) {
                setMatchedCardIndices(prevFlippedCardIndices => [...prevFlippedCardIndices, firstCardIndex, index]);
                setFlippedCardIndices([]);
          }
        }
    }  
  
    const elapsedTime = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;  
  
    return (
        <div className="container mt-5">
            <h2 className="mb-4">User Profile</h2>
            <div className="mb-3">
                <label className="form-label">Name:</label>
                <input value={userName} onChange={e => setUserName(e.target.value)} className="form-control" placeholder="User Name"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Avatar URL:</label>
                <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="form-control" placeholder="Avatar URL"/>
            </div>
            <button onClick={() => updateProfile(userName, avatarUrl)} className="btn btn-primary mb-3">Update Profile</button>

            <p className="mb-3">Best completion Time: {completionTime ? `${completionTime} seconds` : "None"}</p>
            <button onClick={fetchUserProfile} className="btn btn-secondary mb-3">Refresh Profile</button>

            <div className="memory-game">
                {gameActive ? (
                    <>
                        <button onClick={abortGame} className="btn btn-danger mb-3">Abort Challenge</button>
                        <div className="memory-game-board d-flex flex-wrap">
                            {shuffledCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="memory-game-card m-2 card text-center"
                                    style={{ width: '100px', height: '100px', lineHeight: '100px' }}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {(flippedCardIndices.includes(index) || matchedCardIndices.includes(index)) ? card : "?"}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {matchedCardIndices.length === cards.length ? (
                            <div className="game-summary">
                                <p className="mb-3">You've finished in {elapsedTime} seconds!</p>
                                <button onClick={startGame} className="btn btn-success">Play Again</button>
                            </div>
                        ) : (
                            <button onClick={startGame} className="btn btn-primary">Start Game</button>
                        )}
                    </>
                )}
            </div>
        </div>
    );

}

function shufflingCards(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
    return cardsArray;
}

export default MemoryGame;
