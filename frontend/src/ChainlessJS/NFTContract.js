import Web3 from 'web3';
import contractJSON from '../ABI/SimpleERC721.json';
export class NFTContract {
  constructor() {
     this.web3 = null;
     this.contract = null;
     this.contractAddress = '0xF66BC0373D2345112F008b0DaC44463a86E2dCAe';
  }
  createContractInstance(web3) {
      this.web3 = web3;
      if (this.web3 == null) {
          return null;
      } else {
          this.contract = new web3.eth.Contract(contractJSON, this.contractAddress);
          return this.contract;
      }
  }
  async approve(senderAddress, to, tokenId) {
     return await this.contract.methods.approve(to, tokenId).send({ from: senderAddress });
  }
  async approve_estimateGas(senderAddress, to, tokenId) {
     return await this.contract.methods.approve(to, tokenId).estimateGas({ from: senderAddress });
  }
  async balanceOf(owner) {
     return await this.contract.methods.balanceOf(owner).call();
  }
  async getApproved(tokenId) {
     return await this.contract.methods.getApproved(tokenId).call();
  }
  async isApprovedForAll(owner, operator) {
     return await this.contract.methods.isApprovedForAll(owner, operator).call();
  }
  async name() {
     return await this.contract.methods.name().call();
  }
  async owner() {
     return await this.contract.methods.owner().call();
  }
  async ownerOf(tokenId) {
     return await this.contract.methods.ownerOf(tokenId).call();
  }
  async publicMint(senderAddress, ) {
     return await this.contract.methods.publicMint().send({ from: senderAddress });
  }
  async publicMint_estimateGas(senderAddress, ) {
     return await this.contract.methods.publicMint().estimateGas({ from: senderAddress });
  }
  async renounceOwnership(senderAddress, ) {
     return await this.contract.methods.renounceOwnership().send({ from: senderAddress });
  }
  async renounceOwnership_estimateGas(senderAddress, ) {
     return await this.contract.methods.renounceOwnership().estimateGas({ from: senderAddress });
  }
  async safeTransferFrom(senderAddress, from, to, tokenId) {
     return await this.contract.methods.safeTransferFrom(from, to, tokenId).send({ from: senderAddress });
  }
  async safeTransferFrom_estimateGas(senderAddress, from, to, tokenId) {
     return await this.contract.methods.safeTransferFrom(from, to, tokenId).estimateGas({ from: senderAddress });
  }
  async safeTransferFrom(senderAddress, from, to, tokenId, data) {
     return await this.contract.methods.safeTransferFrom(from, to, tokenId, data).send({ from: senderAddress });
  }
  async safeTransferFrom_estimateGas(senderAddress, from, to, tokenId, data) {
     return await this.contract.methods.safeTransferFrom(from, to, tokenId, data).estimateGas({ from: senderAddress });
  }
  async setApprovalForAll(senderAddress, operator, approved) {
     return await this.contract.methods.setApprovalForAll(operator, approved).send({ from: senderAddress });
  }
  async setApprovalForAll_estimateGas(senderAddress, operator, approved) {
     return await this.contract.methods.setApprovalForAll(operator, approved).estimateGas({ from: senderAddress });
  }
  async supportsInterface(interfaceId) {
     return await this.contract.methods.supportsInterface(interfaceId).call();
  }
  async symbol() {
     return await this.contract.methods.symbol().call();
  }
  async tokenByIndex(index) {
     return await this.contract.methods.tokenByIndex(index).call();
  }
  async tokenOfOwnerByIndex(owner, index) {
     return await this.contract.methods.tokenOfOwnerByIndex(owner, index).call();
  }
  async tokenURI(tokenId) {
     return await this.contract.methods.tokenURI(tokenId).call();
  }
  async totalSupply() {
     return await this.contract.methods.totalSupply().call();
  }
  async transferFrom(senderAddress, from, to, tokenId) {
     return await this.contract.methods.transferFrom(from, to, tokenId).send({ from: senderAddress });
  }
  async transferFrom_estimateGas(senderAddress, from, to, tokenId) {
     return await this.contract.methods.transferFrom(from, to, tokenId).estimateGas({ from: senderAddress });
  }
  async transferOwnership(senderAddress, newOwner) {
     return await this.contract.methods.transferOwnership(newOwner).send({ from: senderAddress });
  }
  async transferOwnership_estimateGas(senderAddress, newOwner) {
     return await this.contract.methods.transferOwnership(newOwner).estimateGas({ from: senderAddress });
  }
}
