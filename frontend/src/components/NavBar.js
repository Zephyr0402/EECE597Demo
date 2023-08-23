import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';
import '../App.css';
import { Web3Auth } from "@web3auth/modal";
import Web3 from 'web3';
import NFT_ABI from '../ABI/SimpleERC721.json';
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

const NFT_ADDRESS = "0xF66BC0373D2345112F008b0DaC44463a86E2dCAe";

function NavBar({ web3auth, setWeb3auth, web3, setWeb3}) {
  const [provider, setProvider] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('avatar.jpg');

  useEffect(() => {
    const init = async () => {
      try {
        // Check for avatar in local storage
        const savedAvatarUrl = localStorage.getItem('avatarUrl');
        if (savedAvatarUrl) {
            setAvatarUrl(savedAvatarUrl);
        }
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
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
          if (web3authInstance.provider) {
            setProvider(web3authInstance.provider);
          }
          setWeb3auth(web3authInstance);
        } else {
            // User is not logged in or their session has expired.
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleAvatarClick = async (response) => {
    //Initialize within your constructor
    // const savedWeb3auth = localStorage.getItem('web3auth');
    // console.log("saved web3");
    // if (savedWeb3auth) {
    //   setWeb3auth(savedWeb3auth);
    //   console.log("savedweb3auth");
    //   console.log(savedWeb3auth);
    // } else {
    //   console.log("savedweb3auth is null");
    // }

    if (!web3auth) {
      window.alert('Login expired, refreshing...');
      localStorage.removeItem('avatarUrl');
      localStorage.removeItem('isLoggedIn');
      setWeb3auth(null);
      setAvatarUrl('avatar.jpg');
      window.location.href = `/`;
    }

    if (web3auth.connected) {
      if (window.confirm('Do you want to log out?')) {
        await web3auth.logout();
        localStorage.removeItem('avatarUrl');
        localStorage.removeItem('isLoggedIn');
        setWeb3auth(null);
        setAvatarUrl('avatar.jpg');
        window.location.href = `/`;
      }
    } else {
      const web3authProvider = await web3auth.connect();
      const userInfo = await web3auth.getUserInfo();
      console.log("User info");
      console.log(userInfo);
      const idToken = await web3auth.authenticateUser();
      const base64Url = idToken.idToken.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const result = JSON.parse(window.atob(base64));
      console.log("Auth user");
      console.log(result)
      console.log("web3authProvider");
      console.log(web3authProvider);
      const accounts = result.wallets;
      if (!web3authProvider) {
        console.log('provider not initialized yet');
        return
      }
      const web3 = new Web3(web3authProvider);
      
      console.log("get accounts");
      const userAccounts = await web3.eth.getAccounts();
      console.log(userAccounts);
      const NFTContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
      console.log("account");
      console.log(accounts[0]);
      const tokenID = await NFTContract.methods.tokenOfOwnerByIndex(accounts[0].address, 0).call();
      console.log("Token ID");
      console.log(tokenID);
      const tokenURI = await NFTContract.methods.tokenURI(tokenID).call();
      console.log(tokenURI);
      // Convert the IPFS tokenURI to an HTTP URL
      const httpTokenUri = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');

      // Fetch the metadata JSON from IPFS
      const metadata = await fetch(httpTokenUri).then(response => response.json());

      // Extract the image property, which is an IPFS URL
      const ipfsImageUrl = metadata.image;

      // Convert the IPFS image URL to an HTTP URL
      const httpImageUrl = ipfsImageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');

      // Set the HTTP URL as the avatar
      setAvatarUrl(httpImageUrl);
      setWeb3auth(web3auth);
      setWeb3(web3);
      console.log(web3auth);
      localStorage.setItem('avatarUrl', httpImageUrl);
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  return (
    <Navbar className="nav-dreamy navbar-padding" expand="lg">
      <Navbar.Brand href="/">Game Platform</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="white-toggler" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
        </Nav>
        <Image
          src={avatarUrl} // Fetch avatar image from NFT
          roundedCircle
          className="avatar-img"
          onClick={handleAvatarClick} // Handle click event
        />

      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
