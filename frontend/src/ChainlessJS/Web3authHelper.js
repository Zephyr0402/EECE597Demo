import { Web3Auth } from "@web3auth/modal";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

export default class Web3authHelper {

    constructor() {
        this.web3auth = null;
        this.web3authProvider = null;
    }
    
    // Get the web3 instance
    getWeb3authInstance() {
        return this.web3auth;
    }

    // Get the authentication provider of the web3 instance
    getWeb3authInstanceProvider() {
        return this.web3authProvider;
    }

    // Check if web3auth instance exists
    checkWeb3auth() {
        if (this.web3auth == null) {
            return false; 
        } else {
            return true;
        }
    }

    // Get accounts of the user
    async getAccounts() {
        if (!this.checkWeb3auth()) {
            return null;
        } else {
            const idToken = await this.web3auth.authenticateUser();
            const base64Url = idToken.idToken.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const result = JSON.parse(window.atob(base64));
            const accounts = result.wallets;
            return accounts;
        }
    }

    // Get the user information from web3auth
    async getUserInfo() {
        if (!this.checkWeb3auth()) {
            return null;
        } else {
            const userInfo = await this.web3auth.getUserInfo();
            return userInfo;
        }
    }

    // Log in with web3auth
    async loginWeb3auth() {
        if (!this.checkWeb3auth()) {
            return false;
        } else {
            this.web3authProvider = await this.web3auth.connect();
            return true;
        }
    }

    // Log out with web3auth
    async logoutWeb3auth() {
        if (!this.checkWeb3auth()) {
            return false;
        } else {
            try {
                await this.web3auth.logout();
            }
            catch {
                console.log("Error while logging out...");
                return false;
            }
            return true;
        }
    }
    
    // Create web3auth instance
    async createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget) {
        const web3authInstance = new Web3Auth({
            clientId: clientId, // Get your Client ID from Web3Auth Dashboard
            chainConfig: {
                chainNamespace: chainNamespace,
                chainId: chainId,
                rpcTarget: rpcTarget,
            },
        });
  
        const torusWalletAdapter = new TorusWalletAdapter({
            initParams: {
                whiteLabel: {
                    theme: {
                        isDark: true,
                        colors: { torusBrand1: "#FFA500" },
                    },
                    logoDark: "https://images.web3auth.io/web3auth-logo-w.svg",
                    logoLight: "https://images.web3auth.io/web3auth-logo-w-light.svg",
                    topupHide: true,
                    featuredBillboardHide: true,
                    disclaimerHide: true,
                    defaultLanguage: "en",
                },
            },
        });
    
        web3authInstance.configureAdapter(torusWalletAdapter);
        await web3authInstance.initModal();
        this.web3auth = web3authInstance;
        return web3authInstance;
    }

    // Check if web3auth is connected
    isConnected() {
        if (!this.checkWeb3auth()) {
            return false;
        }
        return this.web3auth.connected;
    }
}
