import React, { useState, useEffect } from 'react';

function MemoryGame() {
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
    const [shuffledCards, setShuffledCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
        if (gameActive && matchedIndices.length === cards.length) {
            setEndTime(new Date());
            setGameActive(false);
        }
    }, [matchedIndices]);

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
