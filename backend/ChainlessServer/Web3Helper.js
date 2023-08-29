const web3 = require('web3');

class Web3Helper {
    constructor() {
        this.web3 = null;
        this.authProvider = null;
    }

    // Get web3 instance
    getWeb3Instance() {
        return this.web3;
    }

    // Create a web3 instance with given authentication provider
    createWeb3Instance(authProvider) {
        this.authProvider = authProvider;
        this.web3 = new Web3(this.authProvider);
        return this.web3;
    }

    // Check if there is web3 instance
    checkWeb3() {
        if (this.web3 == null) {
            return false; 
        } else {
            return true;
        }
    }

    // Get the network id of current chain
    async getNetworkId() {
        if (!this.checkWeb3()) {
            return null;
        } else {
            const networkId = await this.web3.eth.net.getId();
            return networkId;
        }
    }

    // Get accounts of the current user
    async getAccounts() {
        if (!this.checkWeb3()) {
            return null;
        } else {
            const userAccounts = await this.web3.eth.getAccounts();
            return userAccounts;
        }
    }
    
    // Get balance in ether of given account address
    async getBalance(address) {
        if (!this.checkWeb3()) {
            return null;
        } else {
            const balance = await this.web3.eth.getBalance(address);
            return this.web3.utils.fromWei(balance, 'ether');
        }
    }

}