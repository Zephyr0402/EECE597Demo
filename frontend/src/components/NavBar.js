import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';
import '../App.css';
import { Web3Auth } from "@web3auth/modal";
import Web3 from 'web3';
import NFT_ABI from '../ABI/SimpleERC721.json';
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import { Link, useHistory } from 'react-router-dom';
import { Web3authHelper } from '../ChainlessJS/Web3authHelper';
import { Web3Helper } from '../ChainlessJS/Web3Helper';
import { NFTContract } from '../ChainlessJS/NFTContract';

function NavBar({ web3Helper, web3authHelper, setWeb3Helper, setWeb3authHelper, web3auth, setWeb3auth, web3, setWeb3, avatarUrl, setAvatarUrl }) {
    const history = useHistory();
    const clientId = "BCbclsdWIz4v0qoul50MEUdiacaGdvkNHDurmjgQap7Kl-tr4fMdDAir06PYN275EgN-99qtQn2OASm667TCHdU";
    const chainNamespace = "eip155";
    const chainId = "0x13881";
    const rpcTarget = "https://rpc.ankr.com/polygon_mumbai";
    // const [web3authHelper, setWeb3authHelper] = useState(new Web3authHelper());
    // const [web3Helper, setWeb3Helper] = useState(new Web3Helper());

    useEffect(() => {
        const init = async () => {
            try {
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('isLoggedIn');
                if (isLoggedIn !== 'true') {
                    const web3authInstance = await web3authHelper.createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget);
                    setWeb3auth(web3authInstance);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const handleHomeClick = () => {
        // Change avatarUrl (or reset to default) when Home link is clicked
        const mainAvatarURL = localStorage.getItem('avatarUrl');
        setAvatarUrl(mainAvatarURL);
    };

    const handleAvatarClick = async (response) => {
        if (!web3auth) {
            window.alert('Login expired, refreshing...');
            localStorage.removeItem('avatarUrl');
            localStorage.removeItem('isLoggedIn');
            setWeb3auth(null);
            setAvatarUrl('avatar.jpg');
            history.push('/');
            const web3authInstance = await web3authHelper.createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget);
        }

      if (web3auth.connected) {
          if (window.confirm('Do you want to log out?')) {
              await web3auth.logout();
              localStorage.removeItem('avatarUrl');
              localStorage.removeItem('isLoggedIn');
              setWeb3auth(null);
              setAvatarUrl('avatar.jpg');
              history.push('/');
              const web3authInstance = await web3authHelper.createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget);
              setWeb3auth(web3authInstance);
          }
      } else {
          await web3authHelper.loginWeb3auth();
          const web3authProvider = web3authHelper.getWeb3authInstanceProvider();
          const userInfo = await web3authHelper.getUserInfo();
          const accounts = await web3authHelper.getAccounts();
          if (!web3authProvider) {
              console.log('provider not initialized yet');
              return
          }
          web3Helper.createWeb3Instance(web3authHelper.getWeb3authInstanceProvider());
          const userAccounts = await web3Helper.getAccounts();
          const contract = new NFTContract();
          contract.createContractInstance(web3Helper.getWeb3Instance());
          const tokenID = await contract.tokenOfOwnerByIndex(accounts[0].address, 0);
          const tokenURI = await contract.tokenURI(tokenID);

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
          setWeb3Helper(web3Helper);
          // setWeb3(web3Helper.getWeb3Instance());
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
          <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
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
