import Web3 from 'web3';

export default class Web3Helper {
    constructor() {
        this.web3 = null;
        this.authProvider = null;
    }

    getWeb3Instance() {
        return this.web3;
    }

    createWeb3Instance(authProvider) {
        this.authProvider = authProvider;
        this.web3 = new Web3(this.authProvider);
        return this.web3;
    }

    checkWeb3() {
        if (this.web3 == null) {
            return false; 
        } else {
            return true;
        }
    }

    async getAccounts() {
        if (!this.checkWeb3()) {
            return null;
        } else {
            console.log(this.web3);
            const userAccounts = await this.web3.eth.getAccounts();
            return userAccounts;
        }
    }

}