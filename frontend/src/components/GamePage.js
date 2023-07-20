import React from 'react';
import { useParams } from 'react-router-dom';

function GamePage() {
  const { id } = useParams();

  return <h2>Game Page for game {id}</h2>;
}

export default GamePage;
