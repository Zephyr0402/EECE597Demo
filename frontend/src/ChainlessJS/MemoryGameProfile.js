import Web3 from 'web3';
import contractJSON from '../ABI/MemoryGameProfile.json';
export class MemoryGameProfile {
  constructor() {
     this.web3 = null;
     this.contract = null;
     this.contractAddress = '0x6f13891DbD3D00503CD5cBD283a6e375Bc80E4EB';
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
  async gameResults() {
     return await this.contract.methods.gameResults().call();
  }
  async userProfiles() {
     return await this.contract.methods.userProfiles().call();
  }
  async updateUserProfile(senderAddress, _userName, _userAvatar) {
     return await this.contract.methods.updateUserProfile(_userName, _userAvatar).send({ from: senderAddress });
  }
  async updateUserProfile_estimateGas(senderAddress, _userName, _userAvatar) {
     return await this.contract.methods.updateUserProfile(_userName, _userAvatar).estimateGas({ from: senderAddress });
  }
  async submitGameResult(senderAddress, _completionTime) {
     return await this.contract.methods.submitGameResult(_completionTime).send({ from: senderAddress });
  }
  async submitGameResult_estimateGas(senderAddress, _completionTime) {
     return await this.contract.methods.submitGameResult(_completionTime).estimateGas({ from: senderAddress });
  }
  async getUserProfile(_player) {
     return await this.contract.methods.getUserProfile(_player).call();
  }
  async getGameResult(_player) {
     return await this.contract.methods.getGameResult(_player).call();
  }
}
