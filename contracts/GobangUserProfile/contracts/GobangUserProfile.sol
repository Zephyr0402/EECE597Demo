// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract GobangUserProfile {
    struct UserProfile {
        string username;
        string avatarUrl; // added avatarUrl
        uint256 matchCount;
        uint256 winningCount;
        uint256 rank;
    }

    mapping(address => UserProfile) public profiles;

    function createUserProfile(
        address userAddress,
        string memory username,
        string memory avatarUrl
    ) public {
        profiles[userAddress] = UserProfile(username, avatarUrl, 0, 0, 0);  // use avatarUrl
    }

    function incrementMatchCount(address userAddress) public {
        profiles[userAddress].matchCount += 1;
    }

    function incrementWinningCount(address userAddress) public {
        profiles[userAddress].winningCount += 1;
    }

    function updateRank(address userAddress, uint256 newRank) public {
        profiles[userAddress].rank = newRank;
    }

    function updateUserProfile(address userAddress, string memory username, string memory avatarUrl, uint256 matchCount, uint256 winningCount, uint256 rank) public {  // added avatarUrl parameter
        UserProfile storage profile = profiles[userAddress];
        profile.username = username;
        profile.avatarUrl = avatarUrl; // update avatarUrl
        profile.matchCount = matchCount;
        profile.winningCount = winningCount;
        profile.rank = rank;
    }

    function getUserProfile(address userAddress) public view returns (string memory, string memory, uint256, uint256, uint256) { // added avatarUrl in return type
        UserProfile storage profile = profiles[userAddress];
        return (profile.username, profile.avatarUrl, profile.matchCount, profile.winningCount, profile.rank); // return avatarUrl
    }
}
