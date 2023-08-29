import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import MemoryGame from './MemoryGame';
import Web3Helper from '../ChainlessJS/Web3Helper';
import MemoryGameProfile from '../ChainlessJS/MemoryGameProfile';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../ChainlessJS/Web3Helper');
jest.mock('../ChainlessJS/MemoryGameProfile');

let mockWeb3Helper;
let mockMemoryGameProfile;
let mockContract;

describe('<MemoryGame />', () => {
    const mockWeb3authHelper = {};

    beforeEach(() => {
        jest.clearAllMocks();
        
        Web3Helper.mockImplementation(() => {
            return {
                getAccounts: () => {
                    return ["0x123456"];
                },
                createWeb3Instance: jest.fn(),
                checkWeb3: jest.fn().mockReturnValue(true),
                getWeb3Instance: jest.fn().mockReturnValue({}),
            };
        });

        MemoryGameProfile.mockImplementation(() => {
            return {
                createContractInstance: jest.fn(),
                getUserProfile: () => {
                    return {
                        userAvatar: 'avatar.jpg',
                        userName: 'TestUser'
                    };
                },
                updateUserProfile: () => {
                    return true;
                },
                submitGameResult: () => {
                    return true;
                },
                getGameResult: () => {
                    return 10;
                }
            };
        });

        mockWeb3Helper = new Web3Helper();
        mockMemoryGameProfile = new MemoryGameProfile();
        mockContract = new MemoryGameProfile();
    });

    test('should render and handle card clicks', async () => {
        const { getByText, getAllByText } = render(
            <MemoryGame />
        );
        const startGameButton = getByText('Start Game');
        expect(startGameButton).toBeInTheDocument();
        await fireEvent.click(startGameButton);
        await waitFor(() => {
            const cards = getAllByText("?");
            expect(cards).toHaveLength(8);
        });
    });

    test('renders without crashing', async () => {
        await act(async () => {
            render(
                <MemoryGame web3Helper={mockWeb3Helper} web3authHelper={mockWeb3authHelper} avatarUrl='avatar.jpg' setAvatarUrl={jest.fn()} testContract={mockContract} />
            );
        });
        const userProfileText = await screen.findByText('User Profile');
        expect(userProfileText).toBeInTheDocument();
    });
    test('should display user profile correctly', async () => {
        await act(async () => {
            render(
                <MemoryGame web3Helper={mockWeb3Helper} web3authHelper={mockWeb3authHelper} avatarUrl='avatar.jpg' setAvatarUrl={jest.fn()} testContract={mockContract} />
            );
        });
        const userName = await screen.getByDisplayValue('TestUser');
        const userAvatar = await screen.getByDisplayValue('avatar.jpg');
        expect(userName).toBeInTheDocument();
        expect(userAvatar).toBeInTheDocument();
    });
    test('should display previous game results', async () => {
        await act(async () => {
            render(
                <MemoryGame web3Helper={mockWeb3Helper} web3authHelper={mockWeb3authHelper} avatarUrl='avatar.jpg' setAvatarUrl={jest.fn()} testContract={mockContract} />
            );
        });
        const gameResult = await screen.getByText('Best completion Time: 10 seconds');
        expect(gameResult).toBeInTheDocument();
    });

    test('updates profile correctly', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        await act(async () => {
            render(
                <MemoryGame web3Helper={mockWeb3Helper} web3authHelper={mockWeb3authHelper} avatarUrl='avatar.jpg' setAvatarUrl={jest.fn()} testContract={mockContract} />
            );
        });
        
        const nameInput = await screen.getByPlaceholderText("User Name");
        const avatarUrlInput = await screen.getByPlaceholderText("Avatar URL");
        const updateProfileButton = await screen.getByText("Update Profile");
        
        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'NewTestUser' } });
            fireEvent.change(avatarUrlInput, { target: { value: 'newavatar.jpg' } });
            fireEvent.click(updateProfileButton);
        });

        expect(consoleSpy).not.toHaveBeenCalled();
    });

        
});
