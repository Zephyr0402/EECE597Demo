const contractJSON = require('../ABI/GobangUserProfile.json');
class GobangUserProfile {
  constructor() {
     this.web3 = null;
     this.contract = null;
     this.contractAddress = '0x3b7799B6C9E677e3d4eef30Dc7b6672b26EF11Ab';
  }
  createContractInstance(web3) {
      this.web3 = web3;
      if (this.web3 == null) {
          return null;
      } else {
          this.contract = new web3.eth.Contract(contractJSON.abi, this.contractAddress);
          return this.contract;
      }
  }
  async profiles() {
     return await this.contract.methods.profiles().call();
  }
  async createUserProfile(senderAddress, userAddress, username, avatarUrl) {
     return await this.contract.methods.createUserProfile(userAddress, username, avatarUrl).send({ from: senderAddress });
  }
  async createUserProfile_estimateGas(senderAddress, userAddress, username, avatarUrl) {
     return await this.contract.methods.createUserProfile(userAddress, username, avatarUrl).estimateGas({ from: senderAddress });
  }
  async incrementMatchCount(senderAddress, userAddress) {
     return await this.contract.methods.incrementMatchCount(userAddress).send({ from: senderAddress });
  }
  async incrementMatchCount_estimateGas(senderAddress, userAddress) {
     return await this.contract.methods.incrementMatchCount(userAddress).estimateGas({ from: senderAddress });
  }
  async incrementWinningCount(senderAddress, userAddress) {
     return await this.contract.methods.incrementWinningCount(userAddress).send({ from: senderAddress });
  }
  async incrementWinningCount_estimateGas(senderAddress, userAddress) {
     return await this.contract.methods.incrementWinningCount(userAddress).estimateGas({ from: senderAddress });
  }
  async updateRank(senderAddress, userAddress, newRank) {
     return await this.contract.methods.updateRank(userAddress, newRank).send({ from: senderAddress });
  }
  async updateRank_estimateGas(senderAddress, userAddress, newRank) {
     return await this.contract.methods.updateRank(userAddress, newRank).estimateGas({ from: senderAddress });
  }
  async updateUserProfile(senderAddress, userAddress, username, avatarUrl, matchCount, winningCount, rank) {
     return await this.contract.methods.updateUserProfile(userAddress, username, avatarUrl, matchCount, winningCount, rank).send({ from: senderAddress });
  }
  async updateUserProfile_estimateGas(senderAddress, userAddress, username, avatarUrl, matchCount, winningCount, rank) {
     return await this.contract.methods.updateUserProfile(userAddress, username, avatarUrl, matchCount, winningCount, rank).estimateGas({ from: senderAddress });
  }
  async getUserProfile(userAddress) {
     return await this.contract.methods.getUserProfile(userAddress).call();
  }
}
