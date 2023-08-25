// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MemoryGameProfile {

    struct UserProfile {
        string userName;
        string userAvatar;
    }

    struct GameResult {
        uint32 completionTime; // stored in seconds
    }

    mapping(address => UserProfile) public userProfiles;
    mapping(address => GameResult) public gameResults;

    event UpdatedUserProfile(address indexed player, string userName, string userAvatar);
    event NewGameResult(address indexed player, uint32 completionTime);

    function updateUserProfile(string memory _userName, string memory _userAvatar) external {
        UserProfile memory profile = UserProfile({
            userName: _userName,
            userAvatar: _userAvatar
        });
        userProfiles[msg.sender] = profile;
        emit UpdatedUserProfile(msg.sender, _userName, _userAvatar);
    }

    function submitGameResult(uint32 _completionTime) external {
        GameResult memory result = GameResult({
            completionTime: _completionTime
        });
        gameResults[msg.sender] = result;
        emit NewGameResult(msg.sender, _completionTime);
    }

    function getUserProfile(address _player) external view returns (UserProfile memory) {
        return userProfiles[_player];
    }

    function getGameResult(address _player) external view returns (GameResult memory) {
        return gameResults[_player];
    }
}
