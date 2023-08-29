import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import gameList from '../data/games';
import '../App.css';

function GameGrid() {
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    const handleGamePlay = (gameId) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            setShowModal(true);
        } else {
            history.push(`/game/${gameId}`);
        }
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <Container className="game-grid-margin">
          <Row>
            {gameList.map((game) => (
              <Col sm={4} key={game.id}>
                <Card>
                  <Card.Img variant="top" src={game.imageUrl} />
                  <Card.Body>
                    <Card.Title>{game.name}</Card.Title>
                    <Card.Text>{game.description}</Card.Text>
                    <Button variant="primary" onClick={() => handleGamePlay(game.id)}>Play</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Login Required</Modal.Title>
            </Modal.Header>
            <Modal.Body>Please login first to play the game.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
    );
}

export default GameGrid;
