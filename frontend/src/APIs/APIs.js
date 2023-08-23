import Web3 from 'web3';
import { Web3Auth } from "@web3auth/modal";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import contractABI from './GobangUserProfile.json';

export const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // If user has multiple accounts connected, accounts[0] is the currently active one
            const account = accounts[0];

            console.log(account);

            console.log(`Connected with the account: ${account}`);
            return account;
        } catch (error) {
            // User denied account access or some other error occurred
            console.error("Failed to connect to MetaMask", error);
        }
    } else {
        console.log('MetaMask is not installed.');
    }
    return null;
}

class GobangUserProfile {
  constructor() {
     const web3 = new Web3('https://sepolia.infura.io/v3/b173276dc6b9424eb6fd20f4c910ebfa');
     const contractAddress = '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6';
     const contractFilePath = '../EECE597Demo/contract/GobangUserProfile/build/contracts/GobangUserProfile.json';
     this.contract = new web3.eth.Contract(contractABI.abi, contractAddress);
  }
  async profiles() {
     return await this.contract.methods.profiles().call();
  }
  async createUserProfile(userAddress, username) {
     return await this.contract.methods.createUserProfile(userAddress, username).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async createUserProfile_estimateGas(userAddress, username) {
     return await this.contract.methods.createUserProfile(userAddress, username).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementMatchCount(userAddress) {
     return await this.contract.methods.incrementMatchCount(userAddress).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementMatchCount_estimateGas(userAddress) {
     return await this.contract.methods.incrementMatchCount(userAddress).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementWinningCount(userAddress) {
     return await this.contract.methods.incrementWinningCount(userAddress).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementWinningCount_estimateGas(userAddress) {
     return await this.contract.methods.incrementWinningCount(userAddress).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateRank(userAddress, newRank) {
     return await this.contract.methods.updateRank(userAddress, newRank).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateRank_estimateGas(userAddress, newRank) {
     return await this.contract.methods.updateRank(userAddress, newRank).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateUserProfile(userAddress, username, matchCount, winningCount, rank) {
     return await this.contract.methods.updateUserProfile(userAddress, username, matchCount, winningCount, rank).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateUserProfile_estimateGas(userAddress, username, matchCount, winningCount, rank) {
     return await this.contract.methods.updateUserProfile(userAddress, username, matchCount, winningCount, rank).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async getUserProfile(userAddress) {
     return await this.contract.methods.getUserProfile(userAddress).call();
  }
}
