import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import gameList from '../data/games'; 
import '../App.css';

function GameGrid() {
  return (
    <Container className="game-grid-margin">
      <Row>
        {gameList.map((game, index) => (
          <Col sm={4} key={game.id}>
            <Card>
              <Card.Img variant="top" src={game.imageUrl} />
              <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Text>{game.description}</Card.Text>
                {index === 0 ? (
                  <Link to={`/game/${game.id}`}>
                    <Button variant="primary">Play</Button>
                  </Link>
                ) : (
                  <Button variant="primary" href={`/game/${game.id}`}>Play</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default GameGrid;
