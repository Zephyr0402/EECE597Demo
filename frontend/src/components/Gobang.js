import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import GobangUserProfile from '../ChainlessJS/GobangUserProfile'

const SIZE = 15;

function Gobang({ web3Helper, web3authHelper, avatarUrl, setAvatarUrl }) {
    const [board, setBoard] = useState(() => Array(SIZE).fill().map(() => Array(SIZE).fill(null)));
    const [winner, setWinner] = useState(null);
    const [socket, setSocket] = useState(null);
    const [playerColor, setPlayerColor] = useState(null);
    const [isGameReady, setIsGameReady] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    
    const [contract, setContract] = useState(new GobangUserProfile());
    
    const [userName, setUserName] = useState('');
    const [winningCount, setWinningCount] = useState(0);
    const [matchCount, setMatchCount] = useState(0);
    const [rank, setRank] = useState(0);

    const gameId = "1";

    useEffect(() => {
        if (web3Helper && web3authHelper) {
            contract.createContractInstance(web3Helper.getWeb3Instance());
            fetchUserProfile();
        }
    }, [web3Helper, web3authHelper]);


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
            setPlayerColor(game.currentPlayer);
            setBoard(game.board);
            setCurrentPlayer(game.currentPlayer);
            setWinner(game.winner);
        });
        return () => newSocket.close();
    }, [setSocket]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "userName":
                setUserName(value);
                break;
            case "avatarUrl":
                setAvatarUrl(value);
                break;
            case "rank":
                setRank(parseInt(value));
                break;
            default:
                break;
        }
    };

    const updateProfile = async () => {
        try {
            const playerAccounts = await web3Helper.getAccounts();
            await contract.updateUserProfile(playerAccounts[0], playerAccounts[0], userName, avatarUrl, matchCount, winningCount, rank);
            if (winner != null) {
                updateWinningCount();
                setWinner(null);
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    };

    const fetchUserProfile = async () => {
        try {
            const playerAccounts = await web3Helper.getAccounts();
            const profile = await contract.getUserProfile(playerAccounts[0]);
            let newAvatarURL = "signin.png";
            if (profile[1] != '') {
                newAvatarURL = profile[1];
            }
            setUserName(profile[0]);
            setAvatarUrl(newAvatarURL);
            setWinningCount(profile[2]);
            setMatchCount(profile[3]);
            setRank(profile[4]);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleButtonClick = async () => {
        try {
            await updateProfile();
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

    const handleClick = (row, col) => {
        if (!isGameReady) {
            alert('The game is not ready yet. Please wait for another player to join.');
            return;
        }
        if (socket == null || board[row][col] !== null || winner !== null || playerColor !== currentPlayer) return;
        socket.emit('makeMove', { gameId, row, col });
    };

    const updateWinningCount = async () => {
        const playerAccounts = await web3Helper.getAccounts();
        await contract.incrementMatchCount(playerAccounts[0], playerAccounts[0]);
        await contract.incrementWinningCount(playerAccounts[0], playerAccounts[0]);
    }

    return (
        <div className="container mt-5">
            <div className="jumbotron text-center bg-success text-white">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="d-flex justify-content-center">
                        {row.map((value, colIndex) => (
                            <Cell 
                                key={colIndex} 
                                value={value} 
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
                {isGameReady && <h3 className="mt-3">The game is ready!</h3>}
                {winner && <h2 className="mt-3">{winner} chess won the game!</h2>}
            </div>
            <div className="card">
                <div className="card-header">User Profile</div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        User Name: 
                        <input 
                            type="text" 
                            value={userName || ''} 
                            onChange={handleInputChange} 
                            name="userName" 
                            className="ml-2"
                            placeholder={'User Name'}
                        />
                    </li>
                    <li className="list-group-item">
                        Avatar URL: 
                        <input 
                            type="text" 
                            value={avatarUrl || 'avatar.jpg'} 
                            onChange={handleInputChange} 
                            name="avatarUrl" 
                            className="ml-2"
                        />
                    </li>
                    <li className="list-group-item">Winning Count: {winningCount}</li>
                    <li className="list-group-item">Match Count: {matchCount}</li>
                    <li className="list-group-item">
                        Rank: 
                        <input 
                            type="number" 
                            value={rank || ''} 
                            onChange={handleInputChange} 
                            name="rank" 
                            className="ml-2"
                        />
                    </li>
                </ul>
            </div>
            <button onClick={handleButtonClick} className="btn btn-primary btn-block mt-3">Update Profile</button>
        </div>
    );
}

function Cell({value, onClick}) {
    const cellStyle = {
        width: '20px',
        height: '20px',
        border: '1px solid black',
        cursor: 'pointer',
    };

    if(value) {
        cellStyle.backgroundColor = value === 'Black' ? 'black' : 'white';
    }

    return <div style={cellStyle} onClick={onClick} className="m-1" />;
}

export default Gobang;
