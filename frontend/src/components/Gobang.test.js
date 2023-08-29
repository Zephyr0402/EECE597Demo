import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Gobang from './Gobang';
import socketIOClient from "socket.io-client";

jest.mock('socket.io-client');

describe('Gobang Component', () => {

    let mockSocket;

    beforeEach(() => {
        mockSocket = {
            emit: jest.fn(),
            on: jest.fn(),
            close: jest.fn(),
        };

        socketIOClient.mockReturnValue(mockSocket);
    });

    it('Check if the Gobang component can be rendered properly', () => {
        render(<Gobang />);
        expect(screen.getByText(/User Profile/)).toBeInTheDocument();
    });

    it('Check if a warning message will be shown when the player clicks the chessboard before the second player enters the game', async () => {
        window.alert = jest.fn();
        render(<Gobang />);
        const cells = document.querySelectorAll('[style="width: 20px; height: 20px; border: 1px solid black; cursor: pointer;"]');
        const cell = cells[0];
        fireEvent.click(cell);
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('The game is not ready yet. Please wait for another player to join.');
        });
    });

    it('Check if the input box value is changed when the player enters the text', () => {
        render(<Gobang />);
        const input = screen.getByPlaceholderText(/User Name/);
        fireEvent.change(input, { target: { value: 'Peter Parker' } });
        expect(input.value).toBe('Peter Parker');
    });

    it('Check if createGame gets emitted when the game component is rendered', () => {
        render(<Gobang />);
        expect(mockSocket.emit).toHaveBeenCalledWith('createGame', '1');
    });

});
