import React, { useState, useEffect, useContext } from 'react';
import Web3AuthContext from '../Web3AuthContext';

function MemoryGame() {
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
    const [shuffledCards, setShuffledCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);

    const { web3auth } = useContext(Web3AuthContext);

    useEffect(() => {
        setShuffledCards(shuffle([...cards]));
    }, []);

    const handleCardClick = (index) => {
        if (flippedIndices.includes(index) || matchedIndices.includes(index)) return;

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

    return (
      <div className="memory-game">
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
