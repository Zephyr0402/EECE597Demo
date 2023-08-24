import '../App.css';
import React, { useEffect } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { NFTContract } from '../ChainlessJS/NFTContract';

function NavBar({ web3Helper, web3authHelper, setWeb3Helper, setWeb3authHelper, avatarUrl, setAvatarUrl }) {
    const history = useHistory();
    const clientId = "BCbclsdWIz4v0qoul50MEUdiacaGdvkNHDurmjgQap7Kl-tr4fMdDAir06PYN275EgN-99qtQn2OASm667TCHdU";
    const chainNamespace = "eip155";
    const chainId = "0x13881";
    const rpcTarget = "https://rpc.ankr.com/polygon_mumbai";

    useEffect(() => {
        const init = async () => {
            try {
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('isLoggedIn');
                if (isLoggedIn !== 'true') {
                    await web3authHelper.createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget);
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
        if (!web3authHelper.checkWeb3auth()) {
            window.alert('Login expired, refreshing...');
            localStorage.removeItem('avatarUrl');
            localStorage.removeItem('isLoggedIn');
            setAvatarUrl('avatar.jpg');
            history.push('/');
            await web3authHelper.createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget);
        }

      if (web3authHelper.isConnected()) {
          if (window.confirm('Do you want to log out?')) {
              await web3authHelper.logoutWeb3auth();
              localStorage.removeItem('avatarUrl');
              localStorage.removeItem('isLoggedIn');
              setAvatarUrl('avatar.jpg');
              history.push('/');
              await web3authHelper.createWeb3authLoginInstance(clientId, chainNamespace, chainId, rpcTarget);
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
          var httpImageUrl = "avatar.jpg";
          if (userAccounts[0] == "0x63f5fA9eCACBD0C512A334B5db3Eba24603F3043") {
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
              httpImageUrl = ipfsImageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
          }
          

          // Set the HTTP URL as the avatar
          setAvatarUrl(httpImageUrl);
          setWeb3Helper(web3Helper);
          // setWeb3(web3Helper.getWeb3Instance());
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
