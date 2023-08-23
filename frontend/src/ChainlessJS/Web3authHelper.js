import Web3 from 'web3';
import { Web3Auth } from "@web3auth/modal";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

export async function getWeb3authLoginInstance() {
  const web3authInstance = new Web3Auth({
    clientId: "BCbclsdWIz4v0qoul50MEUdiacaGdvkNHDurmjgQap7Kl-tr4fMdDAir06PYN275EgN-99qtQn2OASm667TCHdU", // Get your Client ID from Web3Auth Dashboard
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x13881", // Please use 0x5 for Goerli Testnet Sepolia
        rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
      },
  });
  
  const torusWalletAdapter = new TorusWalletAdapter({
    initParams: {
      // type WhiteLabelParams
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
  
  return web3authInstance;
}